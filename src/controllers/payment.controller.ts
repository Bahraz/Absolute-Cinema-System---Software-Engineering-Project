import type { Request, Response } from "express";
import { paymentService } from "@services/payment.service";

export class PaymentController {
  async show(req: Request, res: Response) {
    try {
      const payments = await paymentService.getAll();
      res.status(200).json(payments);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania płatności" });
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const payment = await paymentService.getById(req.params.id);
      if (!payment) {
        return res.status(404).json({ error: "Nie znaleziono płatności" });
      }
      res.json(payment);
    } catch {
      res.status(500).json({ error: "Błąd pobierania płatności" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { provider } = req.body;
      if (!provider) {
        return res.status(400).json({ error: "Provider jest wymagany" });
      }

      const payment = await paymentService.createPayment(provider);
      res.status(201).json(payment);
    } catch {
      res.status(500).json({ error: "Błąd tworzenia płatności" });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status jest wymagany" });
      }

      const payment = await paymentService.changeStatus(req.params.id, status);

      res.json(payment);
    } catch (err) {
      if (err instanceof Error && err.message.startsWith("INVALID_STATUS")) {
        return res.status(409).json({ error: err.message });
      }
      if (err instanceof Error && err.message === "PAYMENT_NOT_FOUND") {
        return res.status(404).json({ error: "Nie znaleziono płatności" });
      }

      res.status(500).json({ error: "Błąd zmiany statusu" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await paymentService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Nie znaleziono płatności" });
      }
      res.sendStatus(204);
    } catch {
      res.status(500).json({ error: "Błąd usuwania płatności" });
    }
  }
}

export const paymentController = new PaymentController();
