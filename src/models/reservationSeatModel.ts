import mongoose, { Schema, Document, Types } from "mongoose";
import { Seat } from "@models/seatModel";

export interface IReservationSeat extends Document {
  reservation_id: Types.ObjectId;
  seat_id: Types.ObjectId;
}

const ReservationSeatSchema: Schema = new Schema({
  reservation_id: { type: Schema.Types.ObjectId, ref: "Reservation", required: true },
  seat_id: { type: Schema.Types.ObjectId, ref: "Seat", required: true },
});

export const ReservationSeat = mongoose.model<IReservationSeat>(
  "ReservationSeat",
  ReservationSeatSchema,
  "reservation_seats" // <-- nazwa kolekcji w Mongo
);


