import { Payment } from "@models/payment.model";

export type PaymentStatus =
  | "ZAINICJOWANA"
  | "W TRAKCIE"
  | "OPŁACONA"
  | "NIEUDANA"
  | "ZWRÓCONO";

export type PaymentProvider = "KARTA" | "PRZELEW" | "BLIK" | "GOTÓWKA";

export class PaymentRepository {
  findAll() {
    return Payment.find();
  }

  findById(id: string) {
    return Payment.findById(id);
  }

  create(provider: PaymentProvider) {
    return Payment.create({
      provider,
      status: "ZAINICJOWANA",
    });
  }

  delete(id: string) {
    return Payment.findByIdAndDelete(id);
  }

  updateStatus(id: string, status: PaymentStatus) {
    return Payment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }
}

export const paymentRepository = new PaymentRepository();
