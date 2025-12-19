import { Actor } from "@models/actorModel";
import type { Request, Response } from "express";

export class ViewController {
  home(req: Request, res: Response) {
    res.render("home");
  }

  admin(req: Request, res: Response) {
    res.render("admin");
  }

  user(req: Request, res: Response) {
    res.render("user");
  }

  async view(req: Request, res: Response) {
    try {
      const actors = await Actor.find();
      res.render("actors", { actors });
    } catch (err: unknown) {
      res
        .status(500)
        .json({ error: err instanceof Error ? err.message : "Nieznany błąd" });
    }
  }
}

export const viewController = new ViewController();
