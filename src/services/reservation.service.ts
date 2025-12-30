import { reservationRepository } from "@repositories/reservation.repository";
import { Screening } from "@models/screening.model";
import { seatRepository } from "@repositories/seat.repository";
import { ticketRepository } from "@repositories/ticket.repository";
import { paymentRepository } from "@repositories/payment.repository";
import { screeningRepository } from "@repositories/screening.repository";

export class ReservationService {
  async createReservation(data: {
    user_id: string;
    screening_id: string;
    seats_id: string;
    payment_provider: "KARTA" | "BLIK" | "PRZELEW" | "GOTÓWKA";
  }) {
    // 🔒 sprawdzenie miejsca
    const existing = await reservationRepository.findByScreeningAndSeat(
      data.screening_id,
      data.seats_id
    );

    if (existing) {
      throw new Error("SEAT_ALREADY_RESERVED");
    }

    let payment: any = null;
    let ticket: any = null;

    try {
      // 🎬 SEANS (potrzebny do ceny)
      const screening = await screeningRepository.findById(data.screening_id);

      if (!screening) {
        throw new Error("SCREENING_NOT_FOUND");
      }

      // 💰 LICZENIE CENY
      const price = this.calculateTicketPrice(new Date(screening.start_at));

      // 💳 PAYMENT
      payment = await paymentRepository.create(data.payment_provider);

      // 🎟️ TICKET
      ticket = await ticketRepository.create({
        payment_id: payment._id.toString(),
        amount: price,
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
      });

      // 📌 RESERVATION
      const reservation = await reservationRepository.create({
        user_id: data.user_id,
        screening_id: data.screening_id,
        seats_id: data.seats_id,
        ticket_id: ticket._id.toString(),
      });

      return reservation;
    } catch (err) {
      // 🧹 RĘCZNY ROLLBACK
      if (ticket?._id) {
        await ticketRepository.delete(ticket._id.toString());
      }

      if (payment?._id) {
        await paymentRepository.delete(payment._id.toString());
      }

      throw err;
    }
  }

  private calculateTicketPrice(screeningDate: Date): number {
    const day = screeningDate.getDay(); // 0 = niedziela, 6 = sobota
    const hour = screeningDate.getHours();

    // 🟥 WEEKEND
    if (day === 0 || day === 6) {
      return 35;
    }

    // 🟧 GODZINY 18–22
    if (hour >= 18 && hour < 22) {
      return 30;
    }

    // 🟩 STANDARD
    return 25;
  }

  async calculatePrice(screeningId: string): Promise<number> {
  const screening = await screeningRepository.findById(screeningId);
  if (!screening) throw new Error("SCREENING_NOT_FOUND");

  const date = new Date(screening.start_at);
  const hour = date.getHours();
  const day = date.getDay(); // 0 = niedziela, 6 = sobota

  // weekend
  if (day === 0 || day === 6) return 35;

  // 18–22
  if (hour >= 18 && hour < 22) return 30;

  return 25;
}


  async cancelReservation(id: string) {
  const reservation = await reservationRepository.findById(id);

  if (!reservation || !reservation.is_active) {
    throw new Error("RESERVATION_NOT_FOUND");
  }

  reservation.is_active = false;
  await reservation.save();

  return true;
}

  async getAvailableSeatsForScreening(screeningId: string) {
    const screening = await Screening.findById(screeningId);
    if (!screening) {
      throw new Error("SCREENING_NOT_FOUND");
    }

    // wszystkie miejsca w sali
    const allSeats = await seatRepository.findByHall(
      screening.hall_id.toString()
    );

    // tylko rezerwacje DLA TEGO SEANSU
    const reservations = await reservationRepository.findByScreening(
      screeningId
    );

    const takenSeatIds = reservations.map((r) => r.seats_id.toString());

    return allSeats.filter(
      (seat) => !takenSeatIds.includes(seat._id.toString())
    );
  }
}

export const reservationService = new ReservationService();
