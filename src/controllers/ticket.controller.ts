import type { Request, Response } from "express";
import { ticketService } from "@services/ticket.service";

export class TicketController {

  async show(req: Request, res: Response) {
    try {
      const tickets = await ticketService.getAll();
      res.status(200).json(tickets);
    } catch {
      res.status(500).json({ error: "Błąd pobierania biletów" });
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const ticket = await ticketService.getById(req.params.id);
      if (!ticket) {
        return res.status(404).json({ error: "Nie znaleziono biletu" });
      }
      res.json(ticket);
    } catch {
      res.status(500).json({ error: "Błąd pobierania biletu" });
    }
  }

  async findByPayment(req: Request, res: Response) {
    try {
      const ticket = await ticketService.getByPayment(req.params.paymentId);
      if (!ticket) {
        return res.status(404).json({
          error: "Nie znaleziono biletu dla tej płatności",
        });
      }
      res.json(ticket);
    } catch {
      res.status(500).json({ error: "Błąd pobierania biletu" });
    }
  }


  async create(req: Request, res: Response) {
    try {
      const { payment_id, amount, expires_at } = req.body;

      if (!payment_id || amount === undefined || !expires_at) {
        return res.status(400).json({
          error: "payment_id, amount oraz expires_at są wymagane",
        });
      }

      const ticket = await ticketService.createTicket({
        payment_id,
        amount,
        expires_at: new Date(expires_at),
      });

      res.status(201).json(ticket);
    } catch (err) {
      if (err instanceof Error && err.message === "PAYMENT_NOT_FOUND") {
        return res.status(404).json({
          error: "Nie znaleziono płatności",
        });
      }

      res.status(500).json({
        error: "Błąd tworzenia biletu",
      });
    }
  }

  async activate(req: Request, res: Response) {
    try {
      const ticket = await ticketService.activateTicket(req.params.id);
      res.json(ticket);
    } catch (err) {
      if (err instanceof Error && err.message === "TICKET_NOT_FOUND") {
        return res.status(404).json({
          error: "Nie znaleziono biletu",
        });
      }

      res.status(500).json({
        error: "Błąd aktywacji biletu",
      });
    }
  }

  async expire(req: Request, res: Response) {
    try {
      const ticket = await ticketService.expireTicket(req.params.id);
      res.json(ticket);
    } catch (err) {
      if (err instanceof Error && err.message === "TICKET_NOT_FOUND") {
        return res.status(404).json({
          error: "Nie znaleziono biletu",
        });
      }

      res.status(500).json({
        error: "Błąd wygaszania biletu",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await ticketService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Nie znaleziono biletu" });
      }
      res.sendStatus(204);
    } catch {
      res.status(500).json({ error: "Błąd usuwania biletu" });
    }
  }
}

export const ticketController = new TicketController();
