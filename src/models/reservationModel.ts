import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  screening_id: mongoose.Types.ObjectId;
  status: "PENDING" | "PAID" | "CANCELLED" | "EXPIRED";
  total_amount: number;
  expires_at: Date;
}

const ReservationSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    screening_id: {
      type: Schema.Types.ObjectId,
      ref: "Screening",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "CANCELLED", "EXPIRED"],
      default: "PENDING",
    },
    total_amount: { type: Number, default: 0, min: 0 },
    expires_at: { type: Date, required: true },
  },
  { timestamps: { createdAt: "created_at" } }
);

export const Reservation = mongoose.model<IReservation>(
  "Reservation",
  ReservationSchema
);
