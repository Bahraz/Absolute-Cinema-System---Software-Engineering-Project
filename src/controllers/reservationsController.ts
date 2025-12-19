import type { Request, Response } from "express";
import { Reservation } from "@models/reservationModel";
import { Screening } from "@models/screeningModel";
import { Payment } from "@models/paymentModel";

export class ReservationsController {
  // === GET ALL ===
  async getAll(req: Request, res: Response) {
    try {
      const reservations = await Reservation.find()
        .populate("user_id", "email")
        .populate("screening_id");

      res.json(reservations);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania rezerwacji" });
    }
  }

  // === GET BY ID ===
  async getOne(req: Request, res: Response) {
    try {
      const { reservation_id } = req.params;

      const reservation = await Reservation.findById(reservation_id)
        .populate("user_id", "email")
        .populate("screening_id");

      if (!reservation)
        return res.status(404).json({ error: "Nie znaleziono rezerwacji" });

      res.json(reservation);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania rezerwacji" });
    }
  }

  // === GET BY USER ===
  async getByUser(req: Request, res: Response) {
    try {
      const { user_id } = req.params;

      const reservations = await Reservation.find({ user_id })
        .populate("screening_id");

      if (!reservations.length)
        return res.status(404).json({ error: "Brak rezerwacji użytkownika" });

      res.json(reservations);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania rezerwacji użytkownika" });
    }
  }

  // === CREATE (PENDING) ===
  async create(req: Request, res: Response) {
    try {
      const { user_id, screening_id, total_amount } = req.body;

      // Czy screening istnieje?
      const screening = await Screening.findById(screening_id);
      if (!screening)
        return res.status(404).json({ error: "Seans nie istnieje" });

      // czas wygaśnięcia rezerwacji (np. 15 min)
      const expires_at = new Date(Date.now() + 15 * 60 * 1000);

      const reservation = new Reservation({
        user_id,
        screening_id,
        total_amount,
        status: "PENDING",
        expires_at,
      });

      await reservation.save();

      res.status(201).json(reservation);
    } catch (err) {
      res.status(500).json({ error: "Nie udało się utworzyć rezerwacji" });
    }
  }

  // === CANCEL RESERVATION ===
  async cancel(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const reservation = await Reservation.findById(id);

      if (!reservation)
        return res.status(404).json({ error: "Rezerwacja nie istnieje" });

      if (reservation.status !== "PENDING")
        return res.status(400).json({ error: "Nie można anulować tej rezerwacji" });

      reservation.status = "CANCELLED";
      await reservation.save();

      res.json({ message: "Rezerwacja anulowana" });
    } catch (err) {
      res.status(500).json({ error: "Błąd anulowania rezerwacji" });
    }
  }

  // === MARK AS PAID (wywoływane przez PaymentController) ===
  async markAsPaid(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const reservation = await Reservation.findById(id);

      if (!reservation)
        return res.status(404).json({ error: "Rezerwacja nie istnieje" });

      if (reservation.status !== "PENDING")
        return res.status(400).json({ error: "Rezerwacja nie jest w stanie PENDING" });

      reservation.status = "PAID";
      await reservation.save();

      res.json({ message: "Rezerwacja opłacona" });
    } catch (err) {
      res.status(500).json({ error: "Błąd aktualizacji statusu rezerwacji" });
    }
  }

  // === EXPIRE RESERVATION (CRON / manual) ===
  async expire(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const reservation = await Reservation.findById(id);

      if (!reservation)
        return res.status(404).json({ error: "Rezerwacja nie istnieje" });

      if (reservation.status !== "PENDING")
        return res.status(400).json({ error: "Tylko rezerwacje PENDING mogą wygasnąć" });

      if (reservation.expires_at > new Date())
        return res.status(400).json({ error: "Rezerwacja jeszcze nie wygasła" });

      reservation.status = "EXPIRED";
      await reservation.save();

      res.json({ message: "Rezerwacja wygasła" });
    } catch (err) {
      res.status(500).json({ error: "Błąd wygaszania rezerwacji" });
    }
  }

  // === DELETE ===
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await Reservation.findByIdAndDelete(id);

      if (!deleted)
        return res.status(404).json({ error: "Rezerwacja nie istnieje" });

      res.json({ message: "Rezerwacja usunięta" });
    } catch (err) {
      res.status(500).json({ error: "Błąd usuwania rezerwacji" });
    }
  }
}

export const reservationsController = new ReservationsController();
