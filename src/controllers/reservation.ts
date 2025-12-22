import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Reservation } from "@models/reservation";
import { Screening } from "@models/screening";
import { Payment } from "@models/payment";
// ReservationSeat model does not exist in this project; reservation stores `seats_id` directly
import { Ticket } from "@models/ticket";
import { Seat } from "@models/seat";

export class ReservationsController {
  /*...*/

  // === CREATE (PENDING) ===
  async create(req: Request, res: Response) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const {
        user_id,
        screening_id,
        seat_ids,
        payment_provider,
        payment_status,
      } = req.body;
      if (!payment_provider || !payment_status) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          error: "Wymagane: metoda i status płatności",
        });
      }
      if (
        !user_id ||
        !screening_id ||
        !seat_ids ||
        !Array.isArray(seat_ids) ||
        seat_ids.length === 0
      ) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          error: "Wymagane: user_id, screening_id, seat_ids (tablica)",
        });
      }

      // Sprawdź seans
      const screening = await Screening.findById(screening_id).session(session);
      if (!screening) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ error: "Seans nie istnieje" });
      }

      // Sprawdź czy miejsca już zajęte (bilet istnieje)
      for (const sid of seat_ids) {
        const existingTicket = await Ticket.findOne({
          screening_id,
          seat_id: sid,
        })
          .session(session)
          .lean();
        if (existingTicket) {
          await session.abortTransaction();
          session.endSession();
          return res.status(409).json({
            error: `Miejsce ${sid} jest już zarezerwowane dla tego seansu`,
          });
        }
      }

      // Oblicz kwotę całkowitą (base_price + typ miejsca.price jeśli dostępny)
      let total_amount = 0;
      for (const sid of seat_ids) {
        const seat = await Seat.findById(sid)
          .populate("hall_id")
          .session(session);
        if (!seat) {
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({ error: `Miejsce ${sid} nie istnieje` });
        }
        const seatTypePrice = (seat as any).seat_type_id?.price ?? 0;
        const base = (screening as any).base_price ?? 0;
        total_amount += base + seatTypePrice;
      }

      const expires_at = new Date(Date.now() + 15 * 60 * 1000);

      // Stwórz rezerwację
      const reservation = new Reservation({
        user_id,
        screening_id,
        total_amount,
        status: "PENDING",
        expires_at,
      });
      await reservation.save({ session });

      // Projekt zawiera `Reservation.seats_id` i `Reservation.ticket_id` (pojedyncze miejsce)
      const seat_id = Array.isArray(seat_ids) ? seat_ids[0] : seat_ids;

      // Sprawdź czy miejsce istnieje
      const seat = await Seat.findById(seat_id).session(session);
      if (!seat) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ error: `Miejsce ${seat_id} nie istnieje` });
      }

      // Upewnij się, że miejsce należy do tej samej sali co seans
      const seatHallId = (seat as any).hall_id?.toString();
      const screeningHallId = (screening as any).hall_id?.toString();
      if (seatHallId && screeningHallId && seatHallId !== screeningHallId) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ error: "Wybrane miejsce nie należy do sali seansu" });
      }

      // Sprawdź czy miejsce już zarezerwowane na ten seans
      const existingRes = await Reservation.findOne({
        screening_id,
        seats_id: seat_id,
      }).session(session);
      if (existingRes) {
        await session.abortTransaction();
        session.endSession();
        return res.status(409).json({
          error: `Miejsce ${seat_id} jest już zarezerwowane dla tego seansu`,
        });
      }

      // Stwórz płatność (schemat Payment w repo nie posiada pól amount/reservation_id)
      const payment = new Payment({
        status: payment_status,
        provider: payment_provider,
      });
      await payment.save({ session });

      // Stwórz bilet powiązany z płatnością
      const ticketExpires = new Date(Date.now() + 15 * 60 * 1000);
      const ticket = new Ticket({
        payment_id: payment._id,
        amount: total_amount || 0,
        expires_at: ticketExpires,
        status: "WYGASŁY",
      });
      await ticket.save({ session });

      // Przypisz miejsce i bilet do rezerwacji
      reservation.seats_id = seat_id;
      reservation.ticket_id = ticket._id;
      await reservation.save({ session });

      await session.commitTransaction();
      session.endSession();

      // Zwróć utworzone obiekty
      res.status(201).json({ reservation, payment, ticket });
    } catch (err: any) {
      await session.abortTransaction();
      session.endSession();
      if (err.code === 11000) {
        return res.status(409).json({ error: "Konflikt (duplikat)" });
      }
      res
        .status(500)
        .json({ error: err instanceof Error ? err.message : "Nieznany błąd" });
    }
  }

  // === SHOW (LIST) ===
  async show(req: Request, res: Response) {
    try {
      const reservations = await Reservation.find()
        .populate("user_id")
        .populate({
          path: "screening_id",
          populate: [{ path: "movie_id" }, { path: "hall_id" }],
        })
        .populate("seats_id")
        .populate({
          path: "ticket_id",
          populate: {
            path: "payment_id", // 👈 TO JEST KLUCZ
            model: "Payment",
          },
        })
        .lean();

      res.json(reservations);
    } catch (err: any) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }
  async showOne(req: Request, res: Response) {
    try {
      const reservation = await Reservation.findById(req.params.id)
        .populate("user_id")
        .populate({
          path: "screening_id",
          populate: [{ path: "movie_id" }, { path: "hall_id" }],
        })
        .populate("seats_id")
        .populate({
          path: "ticket_id",
          populate: { path: "payment_id" },
        })
        .lean();

      if (!reservation) {
        return res.status(404).json({ error: "Rezerwacja nie znaleziona" });
      }

      res.json(reservation);
    } catch (err: any) {
      res.status(500).json({ error: "Błąd pobierania rezerwacji" });
    }
  }

  // === UPDATE ===
  async update(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const reservation = await Reservation.findById(id);
      if (!reservation) {
        return res.status(404).json({ error: "Rezerwacja nie znaleziona" });
      }

      const {
        user_id,
        screening_id,
        seats_id,
        payment_status,
        payment_provider,
      } = req.body;

      // 🔹 user
      if (user_id) reservation.user_id = user_id;

      // 🔹 screening
      if (screening_id) reservation.screening_id = screening_id;

      // 🔹 seat (z konfliktem)
      if (seats_id) {
        const seat = await Seat.findById(seats_id);
        if (!seat) {
          return res.status(404).json({ error: "Miejsce nie istnieje" });
        }

        const conflict = await Reservation.findOne({
          screening_id: screening_id ?? reservation.screening_id,
          seats_id,
          _id: { $ne: reservation._id },
        });

        if (conflict) {
          return res.status(409).json({
            error: "Miejsce już zarezerwowane dla tego seansu",
          });
        }

        reservation.seats_id = seats_id;
      }

      await reservation.save();

      // 🔹 payment
      if (payment_status || payment_provider) {
        const ticket = await Ticket.findById(reservation.ticket_id);
        if (ticket) {
          const payment = await Payment.findById(ticket.payment_id);
          if (payment) {
            if (payment_status) payment.status = payment_status;
            if (payment_provider) payment.provider = payment_provider;
            await payment.save();
          }
        }
      }

      const out = await Reservation.findById(reservation._id)
        .populate("user_id")
        .populate("screening_id")
        .populate("seats_id")
        .populate({
          path: "ticket_id",
          populate: { path: "payment_id" },
        })
        .lean();

      res.json(out);
    } catch (err: any) {
      res.status(500).json({ error: "Błąd aktualizacji rezerwacji" });
    }
  }

  // === DELETE ===
  async delete(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const reservation = await Reservation.findById(id);
      if (!reservation)
        return res.status(404).json({ error: "Rezerwacja nie znaleziona" });

      // usuń powiązany bilet i płatność jeśli istnieją
      const ticketId = (reservation as any).ticket_id;
      if (ticketId) {
        const ticket = await Ticket.findById(ticketId);
        if (ticket) {
          const paymentId = (ticket as any).payment_id;
          if (paymentId) await Payment.findByIdAndDelete(paymentId);
          await Ticket.findByIdAndDelete(ticketId);
        }
      }

      await Reservation.findByIdAndDelete(id);
      res.json({ ok: true });
    } catch (err: any) {
      res
        .status(500)
        .json({ error: err instanceof Error ? err.message : "Nieznany błąd" });
    }
  }

  async getAvailableSeats(req: Request, res: Response) {
    try {
      const { screeningId } = req.params;

      // 1️⃣ sprawdź seans
      const screening = await Screening.findById(screeningId);
      if (!screening) {
        return res.status(404).json({ error: "Seans nie istnieje" });
      }

      // 2️⃣ pobierz zajęte miejsca dla tego seansu
      const reservations = await Reservation.find({
        screening_id: screeningId,
      }).select("seats_id");

      const reservedSeatIds = reservations
        .map((r) => r.seats_id?.toString())
        .filter(Boolean);

      // 3️⃣ pobierz wolne miejsca z tej samej sali
      const seats = await Seat.find({
        hall_id: screening.hall_id,
        _id: { $nin: reservedSeatIds },
      });

      res.json(seats);
    } catch (err) {
      console.error("❌ getAvailableSeats error:", err);
      res.status(500).json({ error: "Błąd pobierania miejsc" });
    }
  }
  /*...*/
}

export const reservationsController = new ReservationsController();
// ...existing code...
