import type { Request, Response } from "express";
import { userService } from "@services/user.service";

export class UserController {
  /* ================= VIEW ================= */

  async myProfilePanel(req: Request, res: Response) {
    const user = await userService.getProfile(req.user.id);
    const reservations = await userService.getMyReservations(req.user.id);

    res.render("user/my-profile", {
      user,
      reservations,
    });
  }

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

    if (!name && !surname && !email) {
      return res.status(400).json({
        error: "Brak danych do aktualizacji",
      });
    }

    const user = await userService.updateUser(req.params.id, {
      name,
      surname,
      email,
    });

    res.json(user);
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

  /* ================= UPDATE PROFILE ================= */

  async updateProfile(req: Request, res: Response) {
    const { name, surname, email } = req.body;
    if (!name && !surname && !email) {
      return res.status(400).json({
        error: "Brak danych do aktualizacji",
      });
    }

    const user = await userService.updateUser(req.user.id, {
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
        error: "Hasło musi mieć min. 6 znaków",
      });
    }

    await userService.updateUserPassword(req.user.id, password);

    res.json({ message: "Hasło zmienione" }); // ✅
  }
}

export const userController = new UserController();
