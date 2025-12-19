import mongoose, { Schema, Document } from "mongoose";

export interface IRole extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
}

const RoleSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true, unique: true, trim: true },
});

export const Role = mongoose.model<IRole>("Role", RoleSchema);
