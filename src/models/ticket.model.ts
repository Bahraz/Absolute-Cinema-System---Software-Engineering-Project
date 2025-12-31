import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  _id: mongoose.Types.ObjectId;
  payment_id: mongoose.Types.ObjectId;
  status: "AKTYWNY" | "NIEAKTYWNY";
  amount: number;
  expires_at: Date;
}

const TicketSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    payment_id: { type: Schema.Types.ObjectId, ref: "Payment", required: true },
    status: {
      type: String,
      enum: ["AKTYWNY", "NIEAKTYWNY"],
      default: "NIEAKTYWNY",
    },
    amount: { type: Number, default: 0, min: 0 },
    expires_at: { type: Date, required: true },
  },
  {
    versionKey: false,
  }
);

export const Ticket = mongoose.model<ITicket>("Ticket", TicketSchema);
