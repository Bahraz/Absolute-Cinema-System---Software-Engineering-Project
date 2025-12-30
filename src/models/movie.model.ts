import mongoose, { Schema, Document } from "mongoose";

export interface IMovie extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  duration: number;
  release_year: number;
  description: string;
}

const MovieSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true, trim: true },
    duration: { type: Number, required: true },
    release_year: { type: Number, required: true },
    description: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export const Movie = mongoose.model<IMovie>("Movie", MovieSchema);
