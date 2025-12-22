import mongoose, { Schema, Document } from "mongoose";
console.log("PAYMENT REGISTERED IN:", mongoose.connection.id);

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  status: "ZAINICJOWANA" | "W TRAKCIE" | "OPŁACONA" | "NIEUDANA" | "ZWRÓCONO";
  provider: "KARTA" | "PRZELEW" | "BLIK" | "GOTÓWKA";
}

const PaymentSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  status: {
    type: String,
    enum: ["ZAINICJOWANA", "W TRAKCIE", "OPŁACONA", "NIEUDANA", "ZWRÓCONO"],
    default: "ZAINICJOWANA",
    required: true,
  },
  provider: { type: String, enum: ["KARTA", "PRZELEW", "BLIK", "GOTÓWKA"] },
});

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
