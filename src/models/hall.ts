import mongoose, { Schema, Document } from "mongoose";

export interface IHall extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
}

const HallSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true, trim: true },
});

export const Hall = mongoose.model<IHall>("Hall", HallSchema);
