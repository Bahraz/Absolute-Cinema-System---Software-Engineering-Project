import { Hall } from "@models/hall.model";
import { Movie } from "@models/movie.model";
import { Screening } from "@models/screening.model";
import { Reservation } from "@models/reservation.model";

export class ScreeningRepository {
  findAll() {
    return Screening.find().populate("movie_id").populate("hall_id");
  }

  findById(id: string) {
    return Screening.findById(id).populate("movie_id").populate("hall_id");
  }

  findByHallAndTime(hallId: string, start: string, end: string) {
    return Screening.findOne({
      hall_id: hallId,
      start_at: { $gte: start, $lt: end },
    });
  }

  create(data: { movie_id: string; hall_id: string; start_at: string }) {
    return Screening.create(data);
  }

  update(
    id: string,
    data: { movie_id: string; hall_id: string; start_at: string }
  ) {
    return Screening.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  delete(id: string) {
    return Screening.findByIdAndDelete(id);
  }

  findUpcoming() {
    const now = new Date().toISOString().slice(0, 16);
    return Screening.find({ start_at: { $gte: now } })
      .populate("movie_id")
      .populate("hall_id")
      .sort({ start_at: 1 });
  }

  async findAllWithReservationsCount() {
    const screenings = await Screening.find()
      .populate("movie_id")
      .populate("hall_id");

    return Promise.all(
      screenings.map(async (s) => ({
        ...s.toObject(),
        reservationsCount: await Reservation.countDocuments({
          screening_id: s._id,
        }),
      }))
    );
  }
  count() {
    return Screening.countDocuments();
  }
}

export const screeningRepository = new ScreeningRepository();
