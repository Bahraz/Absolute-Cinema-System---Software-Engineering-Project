import type { Request, Response } from "express";
import { Payment } from "@models/payment";

export class PaymentController {
  // 📋 lista płatności
  async show(req: Request, res: Response) {
    try {
      const payments = await Payment.find();
      res.status(200).json(payments);
    } catch (err) {
      res.status(500).json({
        error: "Błąd pobierania płatności",
      });
    }
  }

  // 🔍 jedna płatność po ID
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const payment = await Payment.findById(id);

      if (!payment) {
        return res.status(404).json({
          error: "Płatność nie istnieje",
        });
      }

      res.status(200).json(payment);
    } catch (err) {
      res.status(400).json({
        error: "Nieprawidłowe ID płatności",
      });
    }
  }

  // ➕ utwórz płatność
  async create(req: Request, res: Response) {
    try {
      const { status, provider } = req.body;

      if (!provider) {
        return res.status(400).json({
          error: "provider jest wymagany",
        });
      }

      const payment = new Payment({
        provider,
        status: status ?? "ZAINICJOWANA",
      });

      await payment.save();

      res.status(201).json(payment);
    } catch (err) {
      res.status(500).json({
        error: "Błąd tworzenia płatności",
      });
    }
  }

  // ✏️ aktualizacja płatności
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, provider } = req.body;

      const payment = await Payment.findById(id);
      if (!payment) {
        return res.status(404).json({
          error: "Płatność nie istnieje",
        });
      }

      if (status) payment.status = status;
      if (provider) payment.provider = provider;

      await payment.save();

      res.status(200).json(payment);
    } catch (err) {
      res.status(500).json({
        error: "Błąd aktualizacji płatności",
      });
    }
  }

  // ❌ usuń płatność
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await Payment.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({
          error: "Płatność nie istnieje",
        });
      }

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({
        error: "Błąd usuwania płatności",
      });
    }
  }
}

export const paymentController = new PaymentController();
