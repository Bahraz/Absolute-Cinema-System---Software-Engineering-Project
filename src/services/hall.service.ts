import { HttpError } from "@utils/httpError";
import { hallRepository } from "@repositories/hall.repository";
import { seatRepository } from "@repositories/seat.repository";

export class HallService {
  findAll() {
    return hallRepository.findAll();
  }

  findById(id: string) {
    return hallRepository.findById(id);
  }

  async create(data: { name: string }) {
    const existing = await hallRepository.findByName(data.name);
    if (existing) throw new Error("HALL_EXISTS");

    return hallRepository.create(data);
  }

  async update(id: string, data: { name: string }) {
    const existing = await hallRepository.findByName(data.name);
    if (existing && existing._id.toString() !== id)
      throw new Error("HALL_EXISTS");

    const updated = await hallRepository.update(id, data);
    if (!updated) throw new Error("HALL_NOT_FOUND");

    return updated;
  }

  async delete(id: string) {
    const hall = await hallRepository.findById(id);
    if (!hall) {
      throw new HttpError(404, "Nie znaleziono sali", "HALL_NOT_FOUND");
    }

    await seatRepository.deleteByHallId(id);

    await hallRepository.delete(id);

    return true;
  }

  findSeats(hallId: string) {
    return seatRepository.findByHall(hallId);
  }
}

export const hallService = new HallService();
