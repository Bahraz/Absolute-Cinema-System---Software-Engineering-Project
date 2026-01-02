import {
  paymentRepository,
  PaymentStatus,
  PaymentProvider,
} from "@repositories/payment.repository";
import { ticketRepository } from "@repositories/ticket.repository";
import { ticketService } from "@services/ticket.service";
import { HttpError } from "@utils/httpError";

const ALLOWED_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  ZAINICJOWANA: ["W TRAKCIE", "NIEUDANA"],
  "W TRAKCIE": ["OPŁACONA", "NIEUDANA"],
  OPŁACONA: ["ZWRÓCONO"],
  NIEUDANA: [],
  ZWRÓCONO: [],
};

export class PaymentService {
  async getAll() {
    return paymentRepository.findAll();
  }

  async getById(id: string) {
    const payment = await paymentRepository.findById(id);
    if (!payment) {
      throw new HttpError(404, "Nie znaleziono płatności", "PAYMENT_NOT_FOUND");
    }
    return payment;
  }

  async createPayment(provider: PaymentProvider) {
    if (!provider) {
      throw new HttpError(400, "Provider jest wymagany", "MISSING_PROVIDER");
    }

    return paymentRepository.create(provider);
  }
  async changeStatus(paymentId: string, newStatus: PaymentStatus) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      throw new HttpError(404, "Nie znaleziono płatności", "PAYMENT_NOT_FOUND");
    }

    const allowed = ALLOWED_TRANSITIONS[payment.status] ?? [];
    if (!allowed.includes(newStatus)) {
      throw new HttpError(
        400,
        `Nieprawidłowa zmiana statusu: ${payment.status} → ${newStatus}`,
        "INVALID_STATUS_TRANSITION"
      );
    }

    const updatedPayment = await paymentRepository.updateStatus(
      paymentId,
      newStatus
    );

    const ticket = await ticketRepository.findByPayment(paymentId);

    if (ticket) {
      if (newStatus === "OPŁACONA") {
        await ticketService.activateTicket(ticket._id.toString());
      }

      if (newStatus === "ZWRÓCONO") {
        await ticketService.deactivateTicket(ticket._id.toString());
      }
    }

    return updatedPayment;
  }

  async delete(paymentId: string) {
    return paymentRepository.delete(paymentId);
  }
}

export const paymentService = new PaymentService();
