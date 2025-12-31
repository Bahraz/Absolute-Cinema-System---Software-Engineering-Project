import { userRepository } from "@repositories/user.repository";
import { employeesRepository } from "@repositories/employees.repository";
import { movieRepository } from "@repositories/movie.repository";
import { screeningRepository } from "@repositories/screening.repository";
import { reservationRepository } from "@repositories/reservation.repository";

export class AdminService {
  async dashboardStats() {
    const [
      usersCount,
      employeesCount,
      moviesCount,
      screeningsCount,
      reservationsCount,
      upcomingScreenings,
    ] = await Promise.all([
      userRepository.count(),
      employeesRepository.count(),
      movieRepository.count(),
      screeningRepository.count(),
      reservationRepository.count(),
      screeningRepository.findUpcoming(),
    ]);

    return {
      users: usersCount,
      employees: employeesCount,
      movies: moviesCount,
      screenings: screeningsCount,
      reservations: reservationsCount,
      upcomingScreenings,
    };
  }

  async getEmployees() {
    return employeesRepository.findAllWithUserNames();
  }
}

export const adminService = new AdminService();
