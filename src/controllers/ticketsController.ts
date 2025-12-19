import type { Request, Response } from "express";
import { Ticket } from "@models/ticketModel";
import { Screening } from "@models/screeningModel";
import { Reservation } from "@models/reservationModel";
import { Seat } from "@models/seatModel";

export class TicketsController {
  // === GET ALL TICKETS ===
  async getAll(req: Request, res: Response) {
    try {
      const tickets = await Ticket.find()
        .populate("screening_id", "movie_id hall_id start_at base_price")
        .populate("reservation_id", "user_id status total_amount")
        .populate("seat_id", "hall_id row_label seat_number seat_type_id")
        .sort({ issued_at: -1 });

      res.json(tickets);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania biletów" });
    }
  }

  // === GET TICKET BY ID ===
  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const ticket = await Ticket.findById(id)
        .populate("screening_id", "movie_id hall_id start_at base_price")
        .populate("reservation_id", "user_id status total_amount")
        .populate("seat_id", "hall_id row_label seat_number seat_type_id");

      if (!ticket) return res.status(404).json({ error: "Bilet nie istnieje" });

      res.json(ticket);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania biletu" });
    }
  }

  // === CREATE TICKET ===
  async create(req: Request, res: Response) {
    try {
      const { screening_id, reservation_id, seat_id, qr_payload_hash } =
        req.body;

      // Sprawdź wymagane pola
      if (!screening_id || !reservation_id || !seat_id || !qr_payload_hash) {
        return res.status(400).json({ error: "Brak wymaganych danych" });
      }

      // Tworzenie biletu
      const ticket = new Ticket({
        screening_id,
        reservation_id,
        seat_id,
        qr_payload_hash: Buffer.from(qr_payload_hash, "base64"), // zakładamy, że QR przesyłany w base64
      });

      await ticket.save();

      res.status(201).json(ticket);
    } catch (err: any) {
      if (err.code === 11000) {
        return res
          .status(409)
          .json({ error: "To miejsce w tym seansie jest już zarezerwowane" });
      }
      res.status(500).json({ error: "Błąd tworzenia biletu" });
    }
  }

  // === DELETE TICKET ===
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await Ticket.findByIdAndDelete(id);

      if (!deleted)
        return res.status(404).json({ error: "Bilet nie istnieje" });

      res.json({ message: "Bilet został usunięty" });
    } catch (err) {
      res.status(500).json({ error: "Błąd usuwania biletu" });
    }
  }
}

export const ticketsController = new TicketsController();
