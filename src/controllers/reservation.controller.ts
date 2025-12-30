import type { Request, Response } from "express";
import { reservationService } from "@services/reservation.service";
import { reservationRepository } from "@repositories/reservation.repository";
import { screeningRepository } from "@repositories/screening.repository";

export class ReservationController {
  async userPanel(req: Request, res: Response) {
    const screenings = await screeningRepository.findUpcoming();

    res.render("user/reservation", {
      screenings,
    });
  }

  // ========================
  // USER VIEW – MOJE REZERWACJE
  // ========================
  async myReservationPanel(req: Request, res: Response) {
    const reservations = await reservationRepository.findByUserId(req.user.id);

    res.render("user/my-reservations", {
      reservations,
    });
  }
  // ========================
  // ADMIN VIEW
  // ========================
  async panel(req: Request, res: Response) {
    const reservations = await reservationRepository.findAll();
    const screenings = await screeningRepository.findAll();

    res.render("admin/reservations", {
      reservations,
      screenings, // 🔥 TO BYŁO BRAKIEM
    });
  }

  // ========================
  // USER – MOJE REZERWACJE
  // ========================
  async getMyReservation(req: Request, res: Response) {
    try {
      const reservations = await reservationRepository.findByUserId(
        req.user.id
      );

      res.status(200).json(reservations);
    } catch {
      res.status(500).json({
        error: "Błąd pobierania rezerwacji",
      });
    }
  }

  // ========================
  // ADMIN – WSZYSTKIE
  // ========================
  async getAll(req: Request, res: Response) {
    try {
      const reservations = await reservationRepository.findAll();
      res.status(200).json(reservations);
    } catch {
      res.status(500).json({
        error: "Błąd pobierania rezerwacji",
      });
    }
  }

  // ========================
  // UTWÓRZ REZERWACJĘ (USER)
  // ========================
  async create(req: Request, res: Response) {
    try {
      const { screening_id, seats_id, payment_provider } = req.body;

      if (!screening_id || !seats_id || !payment_provider) {
        return res.status(400).json({
          error: "screening_id, seats_id i payment_provider są wymagane",
        });
      }

      const reservation = await reservationService.createReservation({
        user_id: req.user.id,
        screening_id,
        seats_id,
        payment_provider,
      });

      res.status(201).json(reservation);
    } catch (err: any) {
      if (err instanceof Error && err.message === "SEAT_ALREADY_RESERVED") {
        return res.status(409).json({
          error: "Wybrane miejsce jest już zajęte",
        });
      }

      res.status(500).json({
        error: "Błąd tworzenia rezerwacji",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { screening_id } = req.body;

      if (!screening_id) {
        return res.status(400).json({
          error: "screening_id jest wymagane",
        });
      }

      const reservation = await reservationRepository.findById(req.params.id);
      if (!reservation) {
        return res.status(404).json({
          error: "Nie znaleziono rezerwacji",
        });
      }

      // 🔒 sprawdzamy kolizję miejsca w nowym seansie
      const existing = await reservationRepository.findByScreeningAndSeat(
        screening_id,
        reservation.seats_id.toString()
      );

      if (existing) {
        return res.status(409).json({
          error: "To miejsce jest już zajęte w wybranym seansie",
        });
      }

      reservation.screening_id = screening_id;
      await reservation.save();

      res.json(reservation);
    } catch {
      res.status(500).json({
        error: "Błąd edycji rezerwacji",
      });
    }
  }

  // ========================
  // ANULUJ REZERWACJĘ
  // ========================
  async cancel(req: Request, res: Response) {
    try {
      await reservationService.cancelReservation(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      if (err instanceof Error && err.message === "RESERVATION_NOT_FOUND") {
        return res.status(404).json({
          error: "Nie znaleziono rezerwacji",
        });
      }

      res.status(500).json({
        error: "Błąd anulowania rezerwacji",
      });
    }
  }

  async getAvailableSeats(req: Request, res: Response) {
    try {
      const seats = await reservationService.getAvailableSeatsForScreening(
        req.params.screeningId
      );

      res.json(seats);
    } catch {
      res.status(500).json({
        error: "Błąd pobierania wolnych miejsc",
      });
    }
  }
  async getPrice(req: Request, res: Response) {
    try {
      const { screeningId } = req.params;

      const price = await reservationService.calculatePrice(screeningId);

      res.json({ price });
    } catch {
      res.status(500).json({ error: "Błąd obliczania ceny" });
    }
  }
}

export const reservationController = new ReservationController();
