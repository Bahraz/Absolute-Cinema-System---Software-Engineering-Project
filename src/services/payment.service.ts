import {
  paymentRepository,
  PaymentStatus,
  PaymentProvider,
} from "@repositories/payment.repository";

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
    return paymentRepository.findById(id);
  }

  async createPayment(provider: PaymentProvider) {
    return paymentRepository.create(provider);
  }

  async changeStatus(paymentId: string, newStatus: PaymentStatus) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error("PAYMENT_NOT_FOUND");
    }

    const allowed = ALLOWED_TRANSITIONS[payment.status];
    if (!allowed.includes(newStatus)) {
      throw new Error(
        `INVALID_STATUS_TRANSITION: ${payment.status} → ${newStatus}`
      );
    }

    return paymentRepository.updateStatus(paymentId, newStatus);
  }

  async delete(paymentId: string) {
    return paymentRepository.delete(paymentId);
  }
}

export const paymentService = new PaymentService();
