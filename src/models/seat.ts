import mongoose, { Schema, Document } from "mongoose";

export interface ISeat extends Document {
  _id: mongoose.Types.ObjectId;
  hall_id: mongoose.Types.ObjectId;
  row: number;
  seat_number: number;
}

const SeatSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  hall_id: { type: Schema.Types.ObjectId, ref: "Hall", required: true },
  row: { type: Number, required: true },
  seat_number: { type: Number, required: true },
});

export const Seat = mongoose.model<ISeat>("Seat", SeatSchema);
