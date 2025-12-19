import mongoose, { Schema, Document } from "mongoose";

export interface IActor extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  surname: string;
}

const ActorSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true, trim: true },
  surname: { type: String, required: true, trim: true },
});

export const Actor = mongoose.model<IActor>("Actor", ActorSchema);
