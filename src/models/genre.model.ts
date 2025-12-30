import mongoose, { Schema, Document } from "mongoose";

export interface IGenre extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
}

const GenreSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, trim: true },
  },
  {
    versionKey: false,
  }
);

export const Genre = mongoose.model<IGenre>("Genre", GenreSchema);
