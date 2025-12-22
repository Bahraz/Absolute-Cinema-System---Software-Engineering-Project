import type { Request, Response } from "express";
import { Ticket } from "@models/ticket";

export class TicketController {
  // 📋 lista ticketów
  async show(req: Request, res: Response) {
    try {
      const tickets = await Ticket.find().populate("payment_id");
      res.status(200).json(tickets);
    } catch (err) {
      res.status(500).json({
        error: "Błąd pobierania ticketów",
      });
    }
  }

  // 🔍 jeden ticket
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const ticket = await Ticket.findById(id).populate("payment_id");

      if (!ticket) {
        return res.status(404).json({
          error: "Ticket nie istnieje",
        });
      }

      res.status(200).json(ticket);
    } catch (err) {
      res.status(400).json({
        error: "Nieprawidłowe ID ticketa",
      });
    }
  }

  // ➕ utwórz ticket
  async create(req: Request, res: Response) {
    try {
      const { payment_id, amount, expires_at } = req.body;

      if (!payment_id || !expires_at) {
        return res.status(400).json({
          error: "payment_id oraz expires_at są wymagane",
        });
      }

      const ticket = new Ticket({
        payment_id,
        amount: amount ?? 0,
        expires_at: new Date(expires_at),
        status: "AKTYWNY",
      });

      await ticket.save();

      res.status(201).json(ticket);
    } catch (err) {
      res.status(500).json({
        error: "Błąd tworzenia ticketa",
      });
    }
  }

  // ✏️ zmień status / dane
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, amount, expires_at } = req.body;

      const ticket = await Ticket.findById(id);
      if (!ticket) {
        return res.status(404).json({
          error: "Ticket nie istnieje",
        });
      }

      if (status) ticket.status = status;
      if (amount != null) ticket.amount = amount;
      if (expires_at) ticket.expires_at = new Date(expires_at);

      await ticket.save();

      res.status(200).json(ticket);
    } catch (err) {
      res.status(500).json({
        error: "Błąd aktualizacji ticketa",
      });
    }
  }

  // ❌ usuń ticket
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await Ticket.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({
          error: "Ticket nie istnieje",
        });
      }

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({
        error: "Błąd usuwania ticketa",
      });
    }
  }
}

export const ticketController = new TicketController();
