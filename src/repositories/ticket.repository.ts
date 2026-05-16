import { Ticket } from "@models/ticket.model";

export type TicketStatus = "AKTYWNY" | "NIEAKTYWNY";

export class TicketRepository {
  /**
   * Pobiera wszystkie bilety wraz z danymi płatności.
   */
  findAll() {
    return Ticket.find().populate("payment_id");
  }

  /**
   * Znajduje bilet po jego identyfikatorze.
   */
  findById(id: string) {
    return Ticket.findById(id).populate("payment_id");
  }

  /**
   * Znajduje bilet przypisany do konkretnej płatności.
   */
  findByPayment(paymentId: string) {
    return Ticket.findOne({ payment_id: paymentId }).populate("payment_id");
  }

  /**
   * Tworzy nowy bilet. 
   * @param data Zawiera payment_id, kwotę, datę wygaśnięcia oraz opcjonalnie kod QR.
   */
  create(data: { 
    payment_id: string; 
    amount: number; 
    expires_at: Date; 
    qr_code?: string 
  }) {
    return Ticket.create({
      ...data,
      status: "NIEAKTYWNY", // Domyślny status dla nowego biletu
    });
  }

  /**
   * Usuwa bilet z bazy danych.
   */
  delete(id: string) {
    return Ticket.findByIdAndDelete(id);
  }

  /**
   * Aktualizuje status biletu (np. na AKTYWNY po udanej płatności).
   */
  updateStatus(id: string, status: TicketStatus) {
    return Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  /**
   * Opcjonalna metoda do aktualizacji samego kodu QR, 
   * jeśli byłby generowany asynchronicznie po utworzeniu biletu.
   */
  updateQrCode(id: string, qrCode: string) {
    return Ticket.findByIdAndUpdate(
      id,
      { qr_code: qrCode },
      { new: true }
    );
  }
}

export const ticketRepository = new TicketRepository();