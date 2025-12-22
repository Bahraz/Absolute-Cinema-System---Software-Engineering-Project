import mongoose, { Schema, Document } from "mongoose";

export type EmployeeRole = "Pracownik" | "Kierownik";

export interface IEmployees extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  role: EmployeeRole;
}

const EmployeesSchema: Schema<IEmployees> = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },

    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 🔒 jeden user = jedno stanowisko
    },

    role: {
      type: String,
      enum: ["Pracownik", "Kierownik"], // ✅ TYLKO TE DWIE WARTOŚCI
      required: true,
    },
  },
  { timestamps: true }
);

export const Employees = mongoose.model<IEmployees>(
  "Employees",
  EmployeesSchema
);
