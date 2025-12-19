import mongoose, { Schema, Document } from "mongoose";

export interface IUserRole extends Document {
  user_id: mongoose.Types.ObjectId;
  role_id: mongoose.Types.ObjectId;
}

const UserRoleSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role_id: { type: Schema.Types.ObjectId, ref: "Role", required: true },
});

UserRoleSchema.index({ user_id: 1, role_id: 1 }, { unique: true });

export const UserRole = mongoose.model<IUserRole>(
  "UserRole",
  UserRoleSchema,
  "users_roles" // <-- nazwa kolekcji w Mongo
);
