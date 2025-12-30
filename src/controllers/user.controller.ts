import type { Request, Response } from "express";
import { userService } from "@services/user.service";

export class UserController {
  /* ================= ADMIN VIEW ================= */
  async panel(req: Request, res: Response) {
    const users = await userService.getAllUsers();
    res.render("admin/users", { users });
  }

  /* ================= ADMIN API ================= */
  async getAll(req: Request, res: Response) {
    const users = await userService.getAllUsers();
    res.json(users);
  }

  async update(req: Request, res: Response) {
    const { name, surname, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name i email są wymagane" });
    }

    const user = await userService.updateUser(req.params.id, {
      name,
      surname,
      email,
    });

    res.json(user);
  }

  async updatePassword(req: Request, res: Response) {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        error: "Hasło min. 6 znaków",
      });
    }

    await userService.updateUserPassword(req.params.id, password);
    res.sendStatus(204);
  }

  async delete(req: Request, res: Response) {
    const ok = await userService.deactivateUser(req.params.id);

    if (!ok) {
      return res.status(404).json({ error: "Nie znaleziono użytkownika" });
    }

    res.sendStatus(204);
  }

  async getProfile(req: Request, res: Response) {
    try {
      const user = await userService.getProfile(req.user.id);

      if (!user) {
        return res.status(404).json({
          error: "Nie znaleziono użytkownika",
        });
      }

      res.status(200).json(user);
    } catch {
      res.status(500).json({
        error: "Błąd pobierania profilu",
      });
    }
  }

  async getScreenings(req: Request, res: Response) {
    try {
      const screenings = await userService.getScreenings();
      res.status(200).json(screenings);
    } catch {
      res.status(500).json({
        error: "Błąd pobierania seansów",
      });
    }
  }

  async getMyReservations(req: Request, res: Response) {
    try {
      const reservations = await userService.getMyReservations(req.user.id);
      res.status(200).json(reservations);
    } catch {
      res.status(500).json({
        error: "Błąd pobierania rezerwacji",
      });
    }
  }

  async createReservation(req: Request, res: Response) {
    try {
      const { screening_id, ticket_id, seats_id } = req.body;

      if (!screening_id || !seats_id) {
        return res.status(400).json({
          error: "screening_id oraz seats_id są wymagane",
        });
      }

      const reservation = await userService.createReservation({
        user_id: req.user.id,
        screening_id,
        ticket_id,
        seats_id,
      });

      res.status(201).json(reservation);
    } catch (err: any) {
      if (err instanceof Error && err.message === "SEAT_ALREADY_RESERVED") {
        return res.status(409).json({
          error: "Wybrane miejsce jest już zajęte",
        });
      }

      res.status(500).json({
        error: "Błąd tworzenia rezerwacji",
      });
    }
  }

  async cancelReservation(req: Request, res: Response) {
    try {
      await userService.cancelReservation(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      if (err instanceof Error && err.message === "RESERVATION_NOT_FOUND") {
        return res.status(404).json({
          error: "Nie znaleziono rezerwacji",
        });
      }

      res.status(500).json({
        error: "Błąd anulowania rezerwacji",
      });
    }
  }
  async toggleActive(req: Request, res: Response) {
    const user = await userService.toggleUserActive(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "Nie znaleziono użytkownika",
      });
    }

    res.json({
      is_active: user.is_active,
    });
  }
}

export const userController = new UserController();
