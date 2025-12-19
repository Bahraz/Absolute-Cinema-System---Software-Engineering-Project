import type { Request, Response } from "express";
import { Payment } from "@models/paymentModel";
import { Reservation } from "@models/reservationModel";

export class PaymentsController {
  // === GET ALL PAYMENTS ===
  async getAll(req: Request, res: Response) {
    try {
      const payments = await Payment.find().sort({ created_at: -1 });
      res.json(payments);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania płatności" });
    }
  }

  // === GET PAYMENT BY ID ===
  async getOne(req: Request, res: Response) {
    try {
      const { payment_id } = req.params;
      const payment = await Payment.findById(payment_id);

      if (!payment) return res.status(404).json({ error: "Płatność nie znaleziona" });

      res.json(payment);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania płatności" });
    }
  }

  // === GET PAYMENT BY RESERVATION ===
  async getByReservation(req: Request, res: Response) {
    try {
      const { reservation_id } = req.params;

      const payment = await Payment.findOne({ reservation_id });

      if (!payment)
        return res.status(404).json({ error: "Brak płatności dla tej rezerwacji" });

      res.json(payment);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania płatności" });
    }
  }

  // === CREATE NEW PAYMENT (INITIATED) ===
  async create(req: Request, res: Response) {
    try {
      const { reservation_id, provider, amount } = req.body;

      // Czy rezerwacja istnieje?
      const reservation = await Reservation.findById(reservation_id);
      if (!reservation)
        return res.status(404).json({ error: "Rezerwacja nie istnieje" });

      // Czy płatność już istnieje?
      const existing = await Payment.findOne({ reservation_id });
      if (existing)
        return res
          .status(409)
          .json({ error: "Ta rezerwacja ma już przypisaną płatność" });

      const payment = new Payment({
        reservation_id,
        provider,
        amount,
        status: "INITIATED",
      });

      await payment.save();
      return res.status(201).json(payment);
    } catch (err) {
      res.status(500).json({ error: "Nie udało się utworzyć płatności" });
    }
  }

  // === UPDATE PAYMENT STATUS ===
  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, provider_tx_id } = req.body;

      const allowed = ["INITIATED", "AUTHORIZED", "CAPTURED", "FAILED", "REFUNDED"];
      if (!allowed.includes(status))
        return res.status(400).json({ error: "Nieprawidłowy status płatności" });

      const payment = await Payment.findById(id);
      if (!payment)
        return res.status(404).json({ error: "Płatność nie znaleziona" });

      // WALIDACJA PRZEJŚĆ STATUSÓW
      if (
        payment.status === "FAILED" ||
        payment.status === "REFUNDED" ||
        payment.status === "CAPTURED"
      ) {
        return res
          .status(400)
          .json({ error: "Płatność zakończona — nie można zmienić statusu" });
      }

      // Przykład przejścia: INITIATED → AUTHORIZED
      payment.status = status;

      if (provider_tx_id) payment.provider_tx_id = provider_tx_id;

      await payment.save();
      res.json(payment);
    } catch (err) {
      res.status(500).json({ error: "Błąd aktualizacji statusu płatności" });
    }
  }

  // === DELETE PAYMENT ===
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await Payment.findByIdAndDelete(id);
      if (!deleted)
        return res.status(404).json({ error: "Płatność nie znaleziona" });

      res.json({ message: "Płatność została usunięta" });
    } catch (err) {
      res.status(500).json({ error: "Błąd usuwania płatności" });
    }
  }
}

export const paymentsController = new PaymentsController();
