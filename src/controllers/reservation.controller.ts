import type { Request, Response, NextFunction } from "express";
import { reservationService } from "@services/reservation.service";
import { screeningService } from "@services/screening.service";
import { HttpError } from "@utils/httpError";

export class ReservationController {
  async getMyReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const reservations = await reservationService.findByUserId(req.user.id);
      res.json(reservations);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const reservations = await reservationService.findAll();
      res.json(reservations);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { screening_id, seats_id, payment_provider } = req.body;

      if (!screening_id || !seats_id || !payment_provider) {
        throw new HttpError(
          400,
          "Brak wymaganych danych rezerwacji",
          "MISSING_FIELDS"
        );
      }

      const reservation = await reservationService.createReservation({
        user_id: req.user.id,
        screening_id,
        seats_id,
        payment_provider,
      });

      res.status(201).json(reservation);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { screening_id, seats_id } = req.body;

      const updated = await reservationService.updateReservation(
        req.params.id,
        screening_id,
        seats_id
      );

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      await reservationService.cancelReservation(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }

  async getAvailableSeats(req: Request, res: Response, next: NextFunction) {
    try {
      const seats = await reservationService.getAvailableSeatsForScreening(
        req.params.screeningId
      );

      res.json(seats);
    } catch (err) {
      next(err);
    }
  }

  async getPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const price = await reservationService.calculatePrice(
        req.params.screeningId
      );

      res.json({ price });
    } catch (err) {
      next(err);
    }
  }
}

export const reservationController = new ReservationController();
