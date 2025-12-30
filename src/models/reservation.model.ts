import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  screening_id: mongoose.Types.ObjectId;
  ticket_id: mongoose.Types.ObjectId;
  seats_id: mongoose.Types.ObjectId;
}

const ReservationSchema: Schema<IReservation> = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },

  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },

  screening_id: {
    type: Schema.Types.ObjectId,
    ref: "Screening",
    required: false,
  },

  ticket_id: {
    type: Schema.Types.ObjectId,
    ref: "Ticket",
    required: false,
  },

  seats_id: {
    type: Schema.Types.ObjectId,
    ref: "Seat",
    required: false,
  },
});

ReservationSchema.index({ screening_id: 1, seats_id: 1 }, { unique: true });

export const Reservation = mongoose.model<IReservation>(
  "Reservation",
  ReservationSchema
);
