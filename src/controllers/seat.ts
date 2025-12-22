import type { Request, Response } from "express";
import { Seat } from "@models/seat";

export class SeatController {
  // lista miejsc
  async show(req: Request, res: Response) {
    try {
      const seats = await Seat.find().populate("hall_id");
      res.status(200).json(seats);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania miejsc" });
    }
  }

  // dodaj miejsce
  async create(req: Request, res: Response) {
    try {
      const { hall_id, row, seat_number } = req.body;

      if (!hall_id || row == null || seat_number == null) {
        return res.status(400).json({ error: "Brak wymaganych danych" });
      }

      const seat = new Seat({ hall_id, row, seat_number });
      await seat.save();

      res.status(201).json(seat);
    } catch (err) {
      res.status(500).json({ error: "Błąd dodawania miejsca" });
    }
  }

  // edytuj miejsce
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { hall_id, row, seat_number } = req.body;

      const seat = await Seat.findById(id);
      if (!seat) {
        return res.status(404).json({ error: "Miejsce nie istnieje" });
      }

      if (hall_id) seat.hall_id = hall_id;
      if (row != null) seat.row = row;
      if (seat_number != null) seat.seat_number = seat_number;

      await seat.save();
      res.status(200).json(seat);
    } catch (err) {
      res.status(500).json({ error: "Błąd edycji miejsca" });
    }
  }

  // usuń miejsce
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await Seat.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: "Miejsce nie istnieje" });
      }

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: "Błąd usuwania miejsca" });
    }
  }
}
export const seatController = new SeatController();
