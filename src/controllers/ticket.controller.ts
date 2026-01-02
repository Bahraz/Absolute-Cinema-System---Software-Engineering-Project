import type { Request, Response, NextFunction } from "express";
import { ticketService } from "@services/ticket.service";
import { HttpError } from "@utils/httpError";

export class TicketController {
  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const tickets = await ticketService.getAll();
      res.json(tickets);
    } catch (err) {
      next(err);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await ticketService.getById(req.params.id);

      if (!ticket) {
        throw new HttpError(404, "Nie znaleziono biletu", "TICKET_NOT_FOUND");
      }

      res.json(ticket);
    } catch (err) {
      next(err);
    }
  }

  async findByPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await ticketService.getByPayment(req.params.paymentId);

      if (!ticket) {
        throw new HttpError(404, "Nie znaleziono biletu", "TICKET_NOT_FOUND");
      }

      res.json(ticket);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { payment_id, amount, expires_at } = req.body;

      if (!payment_id || amount == null || !expires_at) {
        throw new HttpError(
          400,
          "payment_id, amount i expires_at są wymagane",
          "MISSING_FIELDS"
        );
      }

      const ticket = await ticketService.createTicket({
        payment_id,
        amount,
        expires_at: new Date(expires_at),
      });

      res.status(201).json(ticket);
    } catch (err) {
      next(err);
    }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await ticketService.activateTicket(req.params.id);
      res.json(ticket);
    } catch (err) {
      next(err);
    }
  }

  async expire(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await ticketService.expireTicket(req.params.id);
      res.json(ticket);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ticketService.delete(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}

export const ticketController = new TicketController();
