import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  _id: mongoose.Types.ObjectId;
  payment_id: mongoose.Types.ObjectId;
  status: "AKTYWNY" | "NIEAKTYWNY";
  amount: number;
  qr_code?: string; // Pole na wygenerowany kod QR (Base64)
  expires_at: Date;
}

const TicketSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    payment_id: { 
      type: Schema.Types.ObjectId, 
      ref: "Payment", 
      required: true 
    },
    status: {
      type: String,
      enum: ["AKTYWNY", "NIEAKTYWNY"],
      default: "NIEAKTYWNY",
    },
    amount: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    qr_code: { 
      type: String, 
      required: false // Opcjonalne, jeśli generujesz go chwilę po utworzeniu rekordu
    },
    expires_at: { 
      type: Date, 
      required: true 
    },
  },
  {
    versionKey: false,
    timestamps: true, // Dobra praktyka: automatyczne createdAt i updatedAt
  }
);

export const Ticket = mongoose.model<ITicket>("Ticket", TicketSchema);