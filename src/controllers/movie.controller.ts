import type { Request, Response } from "express";
import { movieService } from "@services/movie.service";
import { genreRepository } from "@repositories/genre.repository";
import { actorRepository } from "@repositories/actor.repository";

export class MovieController {
  /* ================= VIEW ================= */
/* ===== PANEL ===== */
async panel(req: Request, res: Response) {
  const movies = await movieService.getAllMovies();
  res.render("admin/movies", { movies });
}

/* ===== DETAILS ===== */
async panelDetails(req: Request, res: Response) {
  const details = await movieService.getMovieDetails(req.params.id);

  if (!details) {
    return res.status(404).send("Nie znaleziono filmu");
  }

  res.render("admin/movie-details", {
    movie: details.movie,
    actors: details.actors,
    genres: details.genres,
    allActors: await actorRepository.findAll(),
    allGenres: await genreRepository.findAll(),
  });
}

  /* ================= API ================= */
  async show(req: Request, res: Response) {
    const movies = await movieService.getAllMovies();
    res.json(movies);
  }

  async details(req: Request, res: Response) {
    const details = await movieService.getMovieDetails(req.params.id);
    if (!details) {
      return res.status(404).json({ error: "Nie znaleziono filmu" });
    }
    res.json(details);
  }

  async create(req: Request, res: Response) {
    const movie = await movieService.createMovie(req.body);
    res.status(201).json(movie);
  }

  async update(req: Request, res: Response) {
    const movie = await movieService.updateMovie(req.params.id, req.body);
    if (!movie) {
      return res.status(404).json({ error: "Nie znaleziono filmu" });
    }
    res.json(movie);
  }

  async delete(req: Request, res: Response) {
    const deleted = await movieService.deleteMovie(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Nie znaleziono filmu" });
    }
    res.sendStatus(204);
  }

  async addActor(req: Request, res: Response) {
    try {
      await movieService.addActorToMovie(
        req.params.movieId,
        req.params.actorId
      );
      res.sendStatus(201);
    } catch (e) {
      if ((e as Error).message === "ACTOR_ALREADY_ASSIGNED") {
        return res.status(409).json({
          error: "Aktor jest już przypisany do filmu",
        });
      }
      res.status(500).json({ error: "Błąd serwera" });
    }
  }

  async removeActor(req: Request, res: Response) {
    await movieService.removeActorFromMovie(
      req.params.movieId,
      req.params.actorId
    );
    res.sendStatus(204);
  }

  async addGenre(req: Request, res: Response) {
    try {
      await movieService.addGenreToMovie(
        req.params.movieId,
        req.params.genreId
      );
      res.sendStatus(201);
    } catch (e) {
      if ((e as Error).message === "GENRE_ALREADY_ASSIGNED") {
        return res.status(409).json({
          error: "Gatunek jest już przypisany do filmu",
        });
      }
      res.status(500).json({ error: "Błąd serwera" });
    }
  }

  async removeGenre(req: Request, res: Response) {
    await movieService.removeGenreFromMovie(
      req.params.movieId,
      req.params.genreId
    );
    res.sendStatus(204);
  }
}

export const movieController = new MovieController();
