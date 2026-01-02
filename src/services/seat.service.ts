import { seatRepository } from "@repositories/seat.repository";
import { hallRepository } from "@repositories/hall.repository";

export class SeatService {
  findAll() {
    return seatRepository.findAll();
  }

  findById(id: string) {
    return seatRepository.findById(id);
  }

  findByHall(hallId: string) {
    return seatRepository.findByHall(hallId);
  }

  async create(data: { hall_id: string; row: number; seat_number: number }) {
    if (
      !data.hall_id ||
      data.row === undefined ||
      data.seat_number === undefined
    ) {
      throw new Error("MISSING_FIELDS");
    }

    const hall = await hallRepository.findById(data.hall_id);
    if (!hall) throw new Error("HALL_NOT_FOUND");

    return seatRepository.create(data);
  }

  async update(
    id: string,
    data: { hall_id: string; row: number; seat_number: number }
  ) {
    if (
      !data.hall_id ||
      data.row === undefined ||
      data.seat_number === undefined
    ) {
      throw new Error("MISSING_FIELDS");
    }

    const hall = await hallRepository.findById(data.hall_id);
    if (!hall) throw new Error("HALL_NOT_FOUND");

    const updated = await seatRepository.update(id, data);
    if (!updated) throw new Error("SEAT_NOT_FOUND");

    return updated;
  }

  async delete(id: string) {
    const deleted = await seatRepository.delete(id);
    if (!deleted) throw new Error("SEAT_NOT_FOUND");
    return true;
  }
}

export const seatService = new SeatService();
