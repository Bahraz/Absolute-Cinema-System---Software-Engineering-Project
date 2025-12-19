import type { Request, Response } from "express";
import { MovieActor } from "@models/movieActorModel";
import { Actor } from "@models/actorModel";
import { Movie } from "@models/movieModel";

export class MoviesActorsController {
  // POST /movie-actors
  async add(req: Request, res: Response) {
    const { movie_id, actor_id } = req.body;

    if (!movie_id || !actor_id) {
      return res
        .status(400)
        .json({ error: "movie_id i actor_id są wymagane" });
    }

    try {
      // sprawdzamy czy istnieją
      const movieExists = await Movie.exists({ _id: movie_id });
      const actorExists = await Actor.exists({ _id: actor_id });

      if (!movieExists) return res.status(404).json({ error: "Film nie istnieje" });
      if (!actorExists) return res.status(404).json({ error: "Aktor nie istnieje" });

      // sprawdzanie duplikacji
      const alreadyLinked = await MovieActor.findOne({ movie_id, actor_id });
      if (alreadyLinked) {
        return res.status(409).json({ error: "To powiązanie już istnieje" });
      }

      const link = new MovieActor({ movie_id, actor_id });
      await link.save();

      res.status(201).json({ message: "Aktor dodany do filmu", link });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // GET /movie-actors/:movie_id
  async getActorsForMovie(req: Request, res: Response) {
    const { movie_id } = req.params;

    try {
      const actors = await MovieActor.find({ movie_id: movie_id})
        .populate("actor_id", "name surname");

      res.status(200).json(actors);
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // GET /actor-movies/:actor_id
  async getMoviesForActor(req: Request, res: Response) {
    const { actor_id } = req.params;

    try {
      const movies = await MovieActor.find({ actor_id })
        .populate("movie_id", "title year");

      res.status(200).json(movies);
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // DELETE /movie-actors
  async delete(req: Request, res: Response) {
    const { movie_id, actor_id } = req.body;

    if (!movie_id || !actor_id) {
      return res
        .status(400)
        .json({ error: "movie_id i actor_id są wymagane" });
    }

    try {
      const deleted = await MovieActor.findOneAndDelete({ movie_id, actor_id });

      if (!deleted) {
        return res.status(404).json({ error: "Powiązanie nie istnieje" });
      }

      res.status(200).json({ message: "Powiązanie usunięte" });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }
}

export const moviesActorsController = new MoviesActorsController();
