import { userRepository } from "@repositories/user.repository";
import { screeningRepository } from "@repositories/screening.repository";
import { reservationRepository } from "@repositories/reservation.repository";
import { reservationService } from "@services/reservation.service";

export class UserService {
  async getProfile(userId: string) {
    return userRepository.findById(userId);
  }

  async getAllUsers() {
    return userRepository.findAll();
  }

  async getScreenings() {
    return screeningRepository.findAll();
  }

  async getMyReservations(userId: string) {
    return reservationRepository.findByUserId(userId);
  }

  async deactivateUser(id: string) {
    return userRepository.softDelete(id);
  }

  async updateUser(
    userId: string,
    data: { name: string; surname: string; email: string }
  ) {
    const user = await userRepository.findById(userId);
    if (!user) return null;

    user.name = data.name;
    user.surname = data.surname;
    user.email = data.email;

    await user.save(); // 🔥 TEGO BRAKOWAŁO

    return user;
  }

  async updateUserPassword(id: string, password: string) {
    return userRepository.updatePassword(id, password);
  }

  async createReservation(data: {
    user_id: string;
    screening_id: string;
    ticket_id?: string;
    seats_id: string;
  }) {
    return reservationService.createReservation(data);
  }

  async cancelReservation(reservationId: string) {
    return reservationService.cancelReservation(reservationId);
  }

  async toggleUserActive(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) return null;

    user.is_active = !user.is_active;
    await user.save();

    return user;
  }
}

export const userService = new UserService();
