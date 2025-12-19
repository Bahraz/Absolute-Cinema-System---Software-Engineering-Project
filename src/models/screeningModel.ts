import mongoose, { Schema, Document } from 'mongoose';

export interface IScreening extends Document {
  movie_id: mongoose.Types.ObjectId;
  hall_id: mongoose.Types.ObjectId;
  start_at: Date;
  base_price: number;
}

const ScreeningSchema: Schema = new Schema({
  movie_id: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  hall_id: { type: Schema.Types.ObjectId, ref: 'Hall', required: true },
  start_at: { type: Date, required: true },
  base_price: { type: Number, default: 0, min: 0 }
});

ScreeningSchema.index({ hall_id: 1, start_at: 1 }, { unique: true });

export const Screening = mongoose.model<IScreening>("Screening", ScreeningSchema);