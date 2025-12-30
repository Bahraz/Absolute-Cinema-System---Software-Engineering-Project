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
      // 💳 PAYMENT
      payment = await paymentRepository.create(data.payment_provider);

      // 🎟️ TICKET
      ticket = await ticketRepository.create({
        payment_id: payment._id.toString(),
        amount: 25, // możesz później liczyć dynamicznie
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

  async cancelReservation(id: string) {
    const reservation = await reservationRepository.findById(id);

    if (!reservation) {
      throw new Error("RESERVATION_NOT_FOUND");
    }

    if (reservation.ticket_id) {
      // ⬇️ pobieramy ticket jawnie
      const ticket = await ticketRepository.findById(
        reservation.ticket_id.toString()
      );

      if (ticket) {
        // ⬇️ usuwamy payment
        if (ticket.payment_id) {
          await paymentRepository.delete(ticket.payment_id.toString());
        }

        // ⬇️ usuwamy ticket
        await ticketRepository.delete(ticket._id.toString());
      }
    }

    // ⬇️ usuwamy rezerwację
    await reservationRepository.delete(id);

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
    const reservations =
      await reservationRepository.findByScreening(screeningId);

    const takenSeatIds = reservations.map((r) =>
      r.seats_id.toString()
    );

    return allSeats.filter(
      (seat) => !takenSeatIds.includes(seat._id.toString())
    );
  }
}


export const reservationService = new ReservationService();
