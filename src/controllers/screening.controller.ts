import type { Request, Response } from "express";
import { screeningService } from "@services/screening.service";
import { screeningRepository } from "@repositories/screening.repository";
import { movieRepository } from "@repositories/movie.repository";
import { hallRepository } from "@repositories/hall.repository";

export class ScreeningController {
  /* ================= USER VIEW ================= */
  async userPanel(req: Request, res: Response) {
    const screenings = await screeningRepository.findUpcoming();
    const movies = await movieRepository.findAll();
    const halls = await hallRepository.findAll();

    res.render("user/dashboard", {
      screenings,
      movies,
      halls,
    });
  }
  /* ================= ADMIN VIEW ================= */
  async panel(req: Request, res: Response) {
    const screenings = await screeningRepository.findAllWithReservationsCount();

    const movies = await movieRepository.findAll();
    const halls = await hallRepository.findAll();

    res.render("admin/screenings", {
      screenings,
      movies,
      halls,
    });
  }

  /* ================= API ================= */
  async show(req: Request, res: Response) {
    try {
      const screenings = await screeningService.getAll();
      res.status(200).json(screenings);
    } catch {
      res.status(500).json({ error: "Błąd pobierania seansów" });
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const screening = await screeningService.getById(req.params.id);

      if (!screening) {
        return res.status(404).json({ error: "Nie znaleziono seansu" });
      }

      res.status(200).json(screening);
    } catch {
      res.status(500).json({ error: "Błąd pobierania seansu" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { movie_id, hall_id, start_at } = req.body;

      const screening = await screeningService.createScreening({
        movie_id,
        hall_id,
        start_at: new Date(start_at),
      });

      res.status(201).json(screening);
    } catch (err) {
      if (err instanceof Error && err.message === "MOVIE_NOT_FOUND") {
        return res.status(404).json({ error: "Nie znaleziono filmu" });
      }

      if (err instanceof Error && err.message === "SCREENING_TIME_CONFLICT") {
        return res
          .status(409)
          .json({ error: "Kolizja seansów w tej samej sali" });
      }

      res.status(500).json({ error: "Błąd tworzenia seansu" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await screeningService.updateScreening(req.params.id, {
        movie_id: req.body.movie_id,
        hall_id: req.body.hall_id,
        start_at: new Date(req.body.start_at),
      });

      res.status(200).json(updated);
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "SCREENING_HAS_RESERVATIONS"
      ) {
        return res
          .status(409)
          .json({ error: "Nie można edytować seansu z rezerwacjami" });
      }

      if (err instanceof Error && err.message === "SCREENING_TIME_CONFLICT") {
        return res.status(409).json({ error: "Kolizja seansów" });
      }

      res.status(500).json({ error: "Błąd edycji seansu" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await screeningService.deleteScreening(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "SCREENING_HAS_RESERVATIONS"
      ) {
        return res
          .status(409)
          .json({ error: "Nie można usunąć seansu z rezerwacjami" });
      }

      res.status(500).json({ error: "Błąd usuwania seansu" });
    }
  }
}

export const screeningController = new ScreeningController();
