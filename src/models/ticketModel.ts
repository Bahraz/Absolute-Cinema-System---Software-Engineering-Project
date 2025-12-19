import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  _id: mongoose.Types.ObjectId;
  screening_id: mongoose.Types.ObjectId;
  reservation_id: mongoose.Types.ObjectId;
  seat_id: mongoose.Types.ObjectId;
  qr_payload_hash: Buffer;
  issued_at: Date;
}

const TicketSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  screening_id: {
    type: Schema.Types.ObjectId,
    ref: "Screening",
    required: true,
  },
  reservation_id: {
    type: Schema.Types.ObjectId,
    ref: "Reservation",
    required: true,
  },
  seat_id: { type: Schema.Types.ObjectId, ref: "Seat", required: true },
  qr_payload_hash: { type: Buffer, required: true },
  issued_at: { type: Date, default: Date.now },
});

TicketSchema.index({ screening_id: 1, seat_id: 1 }, { unique: true });

export const Ticket = mongoose.model<ITicket>("Ticket", TicketSchema);
