import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  screening_id: mongoose.Types.ObjectId;
  ticket_id: mongoose.Types.ObjectId;
  seats_id: mongoose.Types.ObjectId;
  is_active: boolean;
}

const ReservationSchema: Schema<IReservation> = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },

    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    screening_id: {
      type: Schema.Types.ObjectId,
      ref: "Screening",
      required: true,
    },

    ticket_id: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },

    seats_id: {
      type: Schema.Types.ObjectId,
      ref: "Seat",
      required: true,
    },

    // 🔥 SOFT DELETE
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// 🔒 blokada duplikatów tylko dla aktywnych
ReservationSchema.index(
  { screening_id: 1, seats_id: 1 },
  { unique: true, partialFilterExpression: { is_active: true } }
);

export const Reservation = mongoose.model<IReservation>(
  "Reservation",
  ReservationSchema
);
