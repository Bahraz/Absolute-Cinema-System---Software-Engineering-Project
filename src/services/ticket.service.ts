import {
  ticketRepository,
  TicketStatus,
} from "@repositories/ticket.repository";
import { paymentRepository } from "@repositories/payment.repository";

export class TicketService {
  async getAll() {
    return ticketRepository.findAll();
  }

  async getById(id: string) {
    return ticketRepository.findById(id);
  }

  async getByPayment(paymentId: string) {
    return ticketRepository.findByPayment(paymentId);
  }

  async createTicket(data: {
    payment_id: string;
    amount: number;
    expires_at: Date;
  }) {
    const payment = await paymentRepository.findById(data.payment_id);
    if (!payment) {
      throw new Error("PAYMENT_NOT_FOUND");
    }

    return ticketRepository.create(data);
  }

  async activateTicket(ticketId: string) {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new Error("TICKET_NOT_FOUND");
    }

    if (ticket.status === "AKTYWNY") {
      return ticket;
    }

    return ticketRepository.updateStatus(ticketId, "AKTYWNY");
  }

  async expireTicket(ticketId: string) {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new Error("TICKET_NOT_FOUND");
    }

    return ticketRepository.updateStatus(ticketId, "NIEAKTYWNY");
  }

  async delete(ticketId: string) {
    return ticketRepository.delete(ticketId);
  }

  async expireIfNeeded(ticketId: string) {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) return null;

    if (ticket.expires_at < new Date()) {
      return ticketRepository.updateStatus(ticketId, "NIEAKTYWNY");
    }

    return ticket;
  }

  async deactivateTicket(ticketId: string) {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) throw new Error("TICKET_NOT_FOUND");

    return ticketRepository.updateStatus(ticketId, "NIEAKTYWNY");
  }
}

export const ticketService = new TicketService();
