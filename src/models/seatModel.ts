import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISeat extends Document {
  hall_id: Types.ObjectId;
  row_label: string;
  seat_number: number;
  seat_type_id: Types.ObjectId;
}

const SeatSchema = new Schema<ISeat>({
  hall_id: { type: Schema.Types.ObjectId, ref: "Hall", required: true },
  row_label: { type: String, required: true },
  seat_number: { type: Number, required: true },
  seat_type_id: {
    type: Schema.Types.ObjectId,
    ref: "SeatType",
    required: true,
  },
});

// opcjonalny indeks unikalności np. w ramach sali i rzędu
SeatSchema.index(
  { hall_id: 1, row_label: 1, seat_number: 1 },
  { unique: true }
);

export const Seat = mongoose.model<ISeat>("Seat", SeatSchema, "seats"); // <-- nazwa kolekcji w Mongo
