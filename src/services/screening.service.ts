import { screeningRepository } from "@repositories/screening.repository";
import { reservationRepository } from "@repositories/reservation.repository";
import { movieRepository } from "@repositories/movie.repository";
import { hallRepository } from "@repositories/hall.repository";

const CLEANUP_BUFFER_MINUTES = 15;

function addMinutes(time: string, minutes: number): string {
  const [date, hm] = time.split("T");
  const [h, m] = hm.split(":").map(Number);

  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60);
  const nm = total % 60;

  return `${date}T${String(nh).padStart(2, "0")}:${String(nm).padStart(
    2,
    "0"
  )}`;
}

export class ScreeningService {
  async getAll() {
    return screeningRepository.findAll();
  }

  async getPanelData() {
    const screenings = await screeningRepository.findAllWithReservationsCount();
    const movies = await movieRepository.findAll();
    const halls = await hallRepository.findAll();
    return { screenings, movies, halls };
  }

  async getUserPanelData() {
    const screenings = await screeningRepository.findUpcoming();
    const movies = await movieRepository.findAll();
    const halls = await hallRepository.findAll();
    return { screenings, movies, halls };
  }

  async getById(id: string) {
    return screeningRepository.findById(id);
  }

  async createScreening(data: {
    movie_id: string;
    hall_id: string;
    start_at: string; // ⬅️ STRING
  }) {
    const movie = await movieRepository.findById(data.movie_id);
    if (!movie) throw new Error("MOVIE_NOT_FOUND");

    const start = data.start_at;
    const end = addMinutes(start, movie.duration + CLEANUP_BUFFER_MINUTES);

    const collision = await screeningRepository.findByHallAndTime(
      data.hall_id,
      start,
      end
    );

    if (collision) throw new Error("SCREENING_TIME_CONFLICT");

    return screeningRepository.create(data);
  }

  async updateScreening(
    id: string,
    data: { movie_id: string; hall_id: string; start_at: string }
  ) {
    const reservationsCount = await reservationRepository.countByScreening(id);
    if (reservationsCount > 0) throw new Error("SCREENING_HAS_RESERVATIONS");

    const movie = await movieRepository.findById(data.movie_id);
    if (!movie) throw new Error("MOVIE_NOT_FOUND");

    const start = data.start_at;
    const end = addMinutes(start, movie.duration + CLEANUP_BUFFER_MINUTES);

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
    const reservationsCount = await reservationRepository.countByScreening(id);
    if (reservationsCount > 0) throw new Error("SCREENING_HAS_RESERVATIONS");
    return screeningRepository.delete(id);
  }
}

export const screeningService = new ScreeningService();
