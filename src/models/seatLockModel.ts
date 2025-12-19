import mongoose, { Schema, Document, Types } from "mongoose";
import { Seat } from "@models/seatModel";

export interface ISeatLock extends Document {
  screening_id: Types.ObjectId;
  seat_id: Types.ObjectId;
  status: "AKTYWNY" | "WYGASŁY" | "RELEASED";
  locked_at: Date;
}

const SeatLockSchema: Schema = new Schema<ISeatLock>({
  screening_id: { type: Schema.Types.ObjectId, ref: "Screening", required: true },
  seat_id: { type: Schema.Types.ObjectId, ref: "Seat", required: true },
  status: {
    type: String,
    enum: ["AKTYWNY", "WYGASŁY", "RELEASED"], // uwzględnione Twoje statusy
    default: "AKTYWNY",
  },
  locked_at: { type: Date, default: Date.now },
});

// Opcjonalnie, możesz mieć indeks unikalny dla aktywnych blokad
SeatLockSchema.index(
  { screening_id: 1, seat_id: 1 },
  { unique: true, partialFilterExpression: { status: "AKTYWNY" } }
);

export const SeatLock = mongoose.model<ISeatLock>(
  "SeatLock",
  SeatLockSchema,
  "seat_locks" // nazwa kolekcji w Mongo
);