import type { Request, Response, NextFunction } from "express";
import { seatService } from "@services/seat.service";
import { HttpError } from "@utils/httpError";

export class SeatController {
  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const seats = await seatService.findAll();
      res.json(seats);
    } catch (err) {
      next(err);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const seat = await seatService.findById(req.params.id);

      if (!seat) {
        throw new HttpError(
          404,
          "Nie znaleziono miejsca",
          "SEAT_NOT_FOUND"
        );
      }

      res.json(seat);
    } catch (err) {
      next(err);
    }
  }

  async findByHall(req: Request, res: Response, next: NextFunction) {
    try {
      const seats = await seatService.findByHall(req.params.hallId);
      res.json(seats);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { hall_id, row, seat_number } = req.body;

      if (!hall_id || row == null || seat_number == null) {
        throw new HttpError(
          400,
          "hall_id, row oraz seat_number są wymagane",
          "MISSING_FIELDS"
        );
      }

      const seat = await seatService.create({
        hall_id,
        row,
        seat_number,
      });

      res.status(201).json(seat);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { hall_id, row, seat_number } = req.body;

      if (!hall_id || row == null || seat_number == null) {
        throw new HttpError(
          400,
          "hall_id, row oraz seat_number są wymagane",
          "MISSING_FIELDS"
        );
      }

      const updated = await seatService.update(req.params.id, {
        hall_id,
        row,
        seat_number,
      });

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await seatService.delete(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}

export const seatController = new SeatController();
