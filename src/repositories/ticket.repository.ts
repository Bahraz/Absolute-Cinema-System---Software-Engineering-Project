import { Ticket } from "@models/ticket.model";

export type TicketStatus = "AKTYWNY" | "NIEAKTYWNY";

export class TicketRepository {
  findAll() {
    return Ticket.find().populate("payment_id");
  }

  findById(id: string) {
    return Ticket.findById(id).populate("payment_id");
  }

  findByPayment(paymentId: string) {
    return Ticket.findOne({ payment_id: paymentId }).populate("payment_id");
  }

  create(data: { payment_id: string; amount: number; expires_at: Date }) {
    return Ticket.create({
      ...data,
      status: "NIEAKTYWNY",
    });
  }

  delete(id: string) {
    return Ticket.findByIdAndDelete(id);
  }

  updateStatus(id: string, status: TicketStatus) {
    return Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }
}

export const ticketRepository = new TicketRepository();
