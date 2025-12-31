import { Seat } from "@models/seat.model";

export class SeatRepository {
  findAll() {
    return Seat.find().populate("hall_id");
  }

  findById(id: string) {
    return Seat.findById(id).populate("hall_id");
  }

  findByHall(hallId: string) {
    return Seat.find({ hall_id: hallId }).sort({ row: 1, seat_number: 1 });
  }

  create(data: { hall_id: string; row: number; seat_number: number }) {
    return Seat.create(data);
  }

  update(
    id: string,
    data: {
      hall_id: string;
      row: number;
      seat_number: number;
    }
  ) {
    return Seat.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  delete(id: string) {
    return Seat.findByIdAndDelete(id);
  }
  async deleteByHallId(hallId: string) {
  return Seat.deleteMany({ hall_id: hallId });
}
}

export const seatRepository = new SeatRepository();
