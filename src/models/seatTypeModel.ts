import mongoose, { Schema, Document } from "mongoose";

export interface ISeatType extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
}

const SeatTypeSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true, unique: true },
});

export const SeatType = mongoose.model<ISeatType>(
  "SeatType",
  SeatTypeSchema,
  "seat_types" // <-- nazwa kolekcji w Mongo
);
