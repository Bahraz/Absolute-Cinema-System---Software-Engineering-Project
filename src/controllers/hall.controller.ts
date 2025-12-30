import type { Request, Response } from "express";
import { hallRepository } from "@repositories/hall.repository";
import { seatRepository } from "@repositories/seat.repository";

export class HallController {
  /* ================= VIEW ================= */

  async panel(req: Request, res: Response) {
    const halls = await hallRepository.findAll();
    res.render("admin/halls", { halls });
  }

  async details(req: Request, res: Response) {
    const hall = await hallRepository.findById(req.params.id);

    if (!hall) {
      return res.status(404).send("Nie znaleziono sali");
    }

    const seats = await seatRepository.findByHall(hall._id.toString());

    res.render("admin/hall-details", {
      hall,
      seats,
    });
  }

  /* ================= API ================= */

  async show(req: Request, res: Response) {
    try {
      const halls = await hallRepository.findAll();
      res.status(200).json(halls);
    } catch (err) {
      res.status(500).json({
        error: "Błąd pobierania sal",
        details: err instanceof Error ? err.message : err,
      });
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const hall = await hallRepository.findById(id);

      if (!hall) {
        return res.status(404).json({
          error: "Nie znaleziono sali",
        });
      }

      res.status(200).json(hall);
    } catch (err) {
      res.status(500).json({
        error: "Błąd pobierania sali",
        details: err instanceof Error ? err.message : err,
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Nazwa sali jest wymagana",
        });
      }
      const existingHall = await hallRepository.findByName(name);
      if (existingHall) {
        return res.status(409).json({
          error: "Sala o takiej nazwie już istnieje",
        });
      }

      const hall = await hallRepository.create({ name });
      res.status(201).json(hall);
    } catch (err) {
      res.status(500).json({
        error: "Błąd dodawania sali",
        details: err instanceof Error ? err.message : err,
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Nazwa sali nie może być pusta",
        });
      }

      const updatedHall = await hallRepository.update(id, { name });

      if (!updatedHall) {
        return res.status(404).json({
          error: "Nie znaleziono sali",
        });
      }

      res.status(200).json(updatedHall);
    } catch (err) {
      res.status(500).json({
        error: "Błąd edycji sali",
        details: err instanceof Error ? err.message : err,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletedHall = await hallRepository.delete(id);

      if (!deletedHall) {
        return res.status(404).json({
          error: "Nie znaleziono sali",
        });
      }

      res.status(200).json({
        message: "Sala została usunięta",
      });
    } catch (err) {
      res.status(500).json({
        error: "Błąd usuwania sali",
        details: err instanceof Error ? err.message : err,
      });
    }
  }
}

export const hallController = new HallController();
