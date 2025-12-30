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

  findByHallAndTime(hallId: string, start: Date, end: Date) {
    return Screening.findOne({
      hall_id: hallId,
      start_at: { $gte: start, $lt: end },
    });
  }

  create(data: { movie_id: string; hall_id: string; start_at: Date }) {
    return Screening.create(data);
  }

  update(
    id: string,
    data: {
      movie_id: string;
      hall_id: string;
      start_at: Date;
    }
  ) {
    return Screening.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  delete(id: string) {
    return Screening.findByIdAndDelete(id);
  }
  count() {
    return Screening.countDocuments();
  }

  findUpcoming() {
    return Screening.find({ start_at: { $gte: new Date() } })
      .populate("movie_id")
      .populate("hall_id")
      .sort({ start_at: 1 })
      // .limit(limit);
  }

  async findAllWithReservationsCount() {
    const screenings = await Screening.find()
      .populate("movie_id")
      .populate("hall_id");

    const result = await Promise.all(
      screenings.map(async (s) => {
        const reservationsCount = await Reservation.countDocuments({
          screening_id: s._id,
        });

        return {
          ...s.toObject(),
          reservationsCount,
        };
      })
    );

    return result;
  }
}

export const screeningRepository = new ScreeningRepository();
