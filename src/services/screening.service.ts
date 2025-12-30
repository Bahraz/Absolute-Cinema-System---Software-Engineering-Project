import { screeningRepository } from "@repositories/screening.repository";
import { Reservation } from "@models/reservation.model";
import { Movie } from "@models/movie.model";

const CLEANUP_BUFFER_MINUTES = 15;

export class ScreeningService {
  async getAll() {
    return screeningRepository.findAll();
  }

  async getById(id: string) {
    return screeningRepository.findById(id);
  }

  async createScreening(data: {
    movie_id: string;
    hall_id: string;
    start_at: Date;
  }) {
    const movie = await Movie.findById(data.movie_id);
    if (!movie) {
      throw new Error("MOVIE_NOT_FOUND");
    }

    const start = data.start_at;
    const durationMinutes = movie.duration + CLEANUP_BUFFER_MINUTES;

    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    const collision = await screeningRepository.findByHallAndTime(
      data.hall_id,
      start,
      end
    );

    if (collision) {
      throw new Error("SCREENING_TIME_CONFLICT");
    }

    return screeningRepository.create(data);
  }

  async updateScreening(
    id: string,
    data: {
      movie_id: string;
      hall_id: string;
      start_at: Date;
    }
  ) {
    const reservationsCount = await Reservation.countDocuments({
      screening_id: id,
    });

    if (reservationsCount > 0) {
      throw new Error("SCREENING_HAS_RESERVATIONS");
    }

    const movie = await Movie.findById(data.movie_id);
    if (!movie) {
      throw new Error("MOVIE_NOT_FOUND");
    }

    const start = data.start_at;
    const durationMinutes = movie.duration + CLEANUP_BUFFER_MINUTES;

    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    const collision = await screeningRepository.findByHallAndTime(
      data.hall_id,
      start,
      end
    );

    if (collision && collision._id.toString() !== id) {
      throw new Error("SCREENING_TIME_CONFLICT");
    }

    return screeningRepository.update(id, data);
  }

  async deleteScreening(id: string) {
    const reservationsCount = await Reservation.countDocuments({
      screening_id: id,
    });

    if (reservationsCount > 0) {
      throw new Error("SCREENING_HAS_RESERVATIONS");
    }

    return screeningRepository.delete(id);
  }
}

export const screeningService = new ScreeningService();
