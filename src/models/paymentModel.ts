import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  reservation_id: mongoose.Types.ObjectId;
  provider: string;
  provider_tx_id?: string;
  status: "INITIATED" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED";
  amount: number;
}

const PaymentSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    reservation_id: {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
    },
    provider: { type: String, required: true },
    provider_tx_id: { type: String },
    status: {
      type: String,
      enum: ["INITIATED", "AUTHORIZED", "CAPTURED", "FAILED", "REFUNDED"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
