import { reservationRepository } from "@repositories/reservation.repository";
import { seatRepository } from "@repositories/seat.repository";
import { screeningRepository } from "@repositories/screening.repository";
import { ticketRepository } from "@repositories/ticket.repository";
import { paymentRepository } from "@repositories/payment.repository";
import { HttpError } from "@utils/httpError";
import QRCode from "qrcode";

export class ReservationService {
  findByUserId(userId: string) {
    return reservationRepository.findByUserId(userId);
  }

  findAll() {
    return reservationRepository.findAll();
  }

  async getPanelData() {
    const reservations = await reservationRepository.findAll();
    const screenings = await screeningRepository.findAll();
    return { reservations, screenings };
  }

  async createReservation(data: {
    user_id: string;
    screening_id: string;
    seats_id: string;
    payment_provider: "KARTA" | "BLIK" | "PRZELEW" | "GOTÓWKA";
  }) {
    if (
      !data.user_id ||
      !data.screening_id ||
      !data.seats_id ||
      !data.payment_provider
    ) {
      throw new HttpError(
        400,
        "screening_id, seats_id i payment_provider są wymagane",
        "MISSING_FIELDS"
      );
    }

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
      const screening = await screeningRepository.findById(data.screening_id);

      if (!screening) {
        throw new Error("SCREENING_NOT_FOUND");
      }

      const price = this.calculateTicketPrice(new Date(screening.start_at));

      // 1. Tworzenie płatności
      payment = await paymentRepository.create(data.payment_provider);

      // 2. Generowanie kodu QR (np. na podstawie ID płatności i ID użytkownika)
      const qrData = JSON.stringify({
        p: payment._id.toString(),
        u: data.user_id,
        s: data.seats_id
      });
      const qrCodeBase64 = await QRCode.toDataURL(qrData);

      // 3. Tworzenie biletu z kodem QR
      ticket = await ticketRepository.create({
        payment_id: payment._id.toString(),
        amount: price,
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
        qr_code: qrCodeBase64,
      });

      // 4. Tworzenie rezerwacji
      const reservation = await reservationRepository.create({
        user_id: data.user_id,
        screening_id: data.screening_id,
        seats_id: data.seats_id,
        ticket_id: ticket._id.toString(),
      });

      return reservation;
    } catch (err) {
      // Rollback w przypadku błędu
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
    const day = screeningDate.getDay();
    const hour = screeningDate.getHours();

    if (day === 0 || day === 6) {
      return 35;
    }
    if (hour >= 18 && hour < 22) {
      return 30;
    }

    return 25;
  }

  async calculatePrice(screeningId: string): Promise<number> {
    const screening = await screeningRepository.findById(screeningId);
    if (!screening) throw new Error("SCREENING_NOT_FOUND");

    return this.calculateTicketPrice(new Date(screening.start_at));
  }

  async cancelReservation(id: string) {
    const reservation = await reservationRepository.findById(id);

    if (!reservation || !reservation.is_active) {
      throw new Error("RESERVATION_NOT_FOUND");
    }

    await reservationRepository.markInactive(id);

    return true;
  }

  async updateReservation(id: string, screening_id: string, seats_id: string) {
    if (!screening_id || !seats_id) {
      throw new HttpError(
        400,
        "screening_id oraz seats_id są wymagane",
        "MISSING_FIELDS"
      );
    }

    const reservation = await reservationRepository.findById(id);

    if (!reservation) {
      throw new Error("RESERVATION_NOT_FOUND");
    }

    const existing = await reservationRepository.findByScreeningAndSeat(
      screening_id,
      seats_id
    );

    if (existing && existing._id.toString() !== reservation._id.toString()) {
      throw new Error("SEAT_ALREADY_RESERVED");
    }

    const updated = await reservationRepository.update(id, {
      screening_id,
      seats_id,
    });

    return updated;
  }

  async getAvailableSeatsForScreening(screeningId: string) {
    const screening = await screeningRepository.findById(screeningId);
    if (!screening) {
      throw new Error("SCREENING_NOT_FOUND");
    }

    const hallId =
      typeof screening.hall_id === "string"
        ? screening.hall_id
        : screening.hall_id._id.toString();

    const allSeats = await seatRepository.findByHall(hallId);

    const reservations = await reservationRepository.findByScreening(
      screeningId
    );

    const takenSeatIds = reservations.map((r) =>
      typeof r.seats_id === "string" ? r.seats_id : r.seats_id._id.toString()
    );

    return allSeats.filter(
      (seat) => !takenSeatIds.includes(seat._id.toString())
    );
  }
}

export const reservationService = new ReservationService();