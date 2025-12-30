import { Reservation } from "@models/reservation.model";
import { Ticket } from "@models/ticket.model";
import { Screening } from "@models/screening.model";
import { Seat } from "@models/seat.model";
import { User } from "@models/user.model";

export class ReservationRepository {
  findById(id: string) {
    return Reservation.findById(id)
      .populate("user_id")
      .populate({
        path: "screening_id",
        populate: [{ path: "movie_id" }, { path: "hall_id" }],
      })
      .populate({
        path: "ticket_id",
        populate: { path: "payment_id" },
      })
      .populate("seats_id");
  }

  findByUserId(userId: string) {
    return Reservation.find({
      user_id: userId,
      is_active: true,
    })
      .populate({
        path: "screening_id",
        populate: [{ path: "movie_id" }, { path: "hall_id" }],
      })
      .populate({
        path: "ticket_id",
        populate: { path: "payment_id" },
      })
      .populate("seats_id");
  }

  findAll() {
    return Reservation.find()
      .populate("user_id")
      .populate({
        path: "screening_id",
        populate: [{ path: "movie_id" }, { path: "hall_id" }],
      })
      .populate({
        path: "ticket_id",
        populate: { path: "payment_id" },
      })
      .populate("seats_id");
  }

  findByScreeningAndSeat(screeningId: string, seatId: string) {
    return Reservation.findOne({
      screening_id: screeningId,
      seats_id: seatId,
    });
  }

  create(data: {
    user_id: string;
    screening_id: string;
    seats_id: string;
    ticket_id: string;
  }) {
    return Reservation.create(data);
  }
  delete(id: string) {
    return Reservation.findByIdAndDelete(id);
  }
  count() {
    return Reservation.countDocuments();
  }
  findByScreening(screeningId: string) {
    return Reservation.find({ screening_id: screeningId });
  }
}

export const reservationRepository = new ReservationRepository();
