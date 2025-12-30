import type { Request, Response } from "express";
import { seatRepository } from "@repositories/seat.repository";

export class SeatController {
  async show(req: Request, res: Response) {
    try {
      const seats = await seatRepository.findAll();
      res.status(200).json(seats);
    } catch {
      res.status(500).json({
        error: "Błąd pobierania miejsc",
      });
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const seat = await seatRepository.findById(req.params.id);

      if (!seat) {
        return res.status(404).json({
          error: "Nie znaleziono miejsca",
        });
      }

      res.status(200).json(seat);
    } catch {
      res.status(500).json({
        error: "Błąd pobierania miejsca",
      });
    }
  }

  async findByHall(req: Request, res: Response) {
    try {
      const seats = await seatRepository.findByHall(req.params.hallId);
      res.status(200).json(seats);
    } catch {
      res.status(500).json({
        error: "Błąd pobierania miejsc sali",
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { hall_id, row, seat_number } = req.body;

      if (!hall_id || row === undefined || seat_number === undefined) {
        return res.status(400).json({
          error: "hall_id, row oraz seat_number są wymagane",
        });
      }

      const seat = await seatRepository.create({
        hall_id,
        row,
        seat_number,
      });

      res.status(201).json(seat);
    } catch {
      res.status(500).json({
        error: "Błąd tworzenia miejsca",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { hall_id, row, seat_number } = req.body;

      if (!hall_id || row === undefined || seat_number === undefined) {
        return res.status(400).json({
          error: "hall_id, row oraz seat_number są wymagane",
        });
      }

      const updated = await seatRepository.update(req.params.id, {
        hall_id,
        row,
        seat_number,
      });

      if (!updated) {
        return res.status(404).json({
          error: "Nie znaleziono miejsca",
        });
      }

      res.status(200).json(updated);
    } catch {
      res.status(500).json({
        error: "Błąd edycji miejsca",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await seatRepository.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          error: "Nie znaleziono miejsca",
        });
      }

      res.sendStatus(204);
    } catch {
      res.status(500).json({
        error: "Błąd usuwania miejsca",
      });
    }
  }
}

export const seatController = new SeatController();
