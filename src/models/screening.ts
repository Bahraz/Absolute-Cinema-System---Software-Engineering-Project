import mongoose, { Schema, Document } from 'mongoose';

export interface IScreening extends Document {
  _id: mongoose.Types.ObjectId;
  movie_id: mongoose.Types.ObjectId;
  hall_id: mongoose.Types.ObjectId;
  start_at: Date;
}

const ScreeningSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  movie_id: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  hall_id: { type: Schema.Types.ObjectId, ref: 'Hall', required: true },
  start_at: { type: Date, required: true },
});

export const Screening = mongoose.model<IScreening>("Screening", ScreeningSchema);