import type { Request, Response } from "express";
import { ReservationSeat } from "@models/reservationSeatModel";
import { Reservation } from "@models/reservationModel";

export class ReservationsSeatsController {
  // === GET SEATS FOR RESERVATION ===
async getByReservation(req: Request, res: Response) {
  const { reservation_id } = req.params;
  
  try {
    const seats = await ReservationSeat.find({ reservation_id : reservation_id})
      .populate("seat_id", "hall_id row_label seat_number seat_type_id");

    res.json(seats);
  } catch (err) {
    res.status(500).json({ error: "Błąd pobierania miejsc rezerwacji" });
  }
}

  // === ADD SEAT TO RESERVATION ===
  async add(req: Request, res: Response) {
    try {
      const { reservation_id, seat_id } = req.body;

      // Czy rezerwacja istnieje?
      const reservation = await Reservation.findById(reservation_id);
      if (!reservation)
        return res.status(404).json({ error: "Rezerwacja nie istnieje" });

      // Czy miejsce należy do tego samego seansu?
      const existingReservationWithSeat = await ReservationSeat.findOne({
        seat_id,
      }).populate({
        path: "reservation_id",
        select: "screening_id status",
      });

      if (existingReservationWithSeat) {
        const otherRes = existingReservationWithSeat.reservation_id as any;

        // miejsce zajęte w aktywnej rezerwacji
        if (["PENDING", "PAID"].includes(otherRes.status)) {
          return res.status(409).json({
            error: "To miejsce jest już zajęte dla tego seansu",
          });
        }
      }

      // Dodaj miejsce do rezerwacji
      const reservedSeat = new ReservationSeat({
        reservation_id,
        seat_id,
      });

      await reservedSeat.save();

      res.status(201).json(reservedSeat);
    } catch (err: any) {
      // naruszenie unikalności (duplikat)
      if (err.code === 11000) {
        return res.status(409).json({
          error: "To miejsce jest już dodane do rezerwacji",
        });
      }

      res.status(500).json({ error: "Błąd dodawania miejsca" });
    }
  }

  // === REMOVE SEAT ===
  async remove(req: Request, res: Response) {
    try {
      const { reservation_id, seat_id } = req.body;

      const deleted = await ReservationSeat.findOneAndDelete({
        reservation_id,
        seat_id,
      });

      if (!deleted)
        return res
          .status(404)
          .json({ error: "Miejsce nie jest przypisane do rezerwacji" });

      res.json({ message: "Miejsce usunięte z rezerwacji" });
    } catch (err) {
      res.status(500).json({ error: "Błąd usuwania miejsca" });
    }
  }

  // === DELETE ALL SEATS FOR RESERVATION ===
  async deleteAllForReservation(req: Request, res: Response) {
    try {
      const { reservation_id } = req.params;

      await ReservationSeat.deleteMany({ reservation_id });

      res.json({ message: "Usunięto wszystkie miejsca rezerwacji" });
    } catch (err) {
      res.status(500).json({ error: "Błąd usuwania miejsc rezerwacji" });
    }
  }
}

export const reservationsSeatsController = new ReservationsSeatsController();
