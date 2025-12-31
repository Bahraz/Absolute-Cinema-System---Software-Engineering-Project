import type { Request, Response, NextFunction } from "express";
import { movieService } from "@services/movie.service";
import { HttpError } from "@utils/httpError";

export class MovieController {
  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const movies = await movieService.getAllMovies();
      res.json(movies);
    } catch (err) {
      next(err);
    }
  }

  async details(req: Request, res: Response, next: NextFunction) {
    try {
      const details = await movieService.getMovieDetails(req.params.id);

      if (!details) {
        throw new HttpError(404, "Nie znaleziono filmu", "MOVIE_NOT_FOUND");
      }

      res.json(details);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const movie = await movieService.createMovie(req.body);
      res.status(201).json(movie);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const movie = await movieService.updateMovie(
        req.params.id,
        req.body
      );

      if (!movie) {
        throw new HttpError(404, "Nie znaleziono filmu", "MOVIE_NOT_FOUND");
      }

      res.json(movie);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await movieService.deleteMovie(req.params.id);

      if (!deleted) {
        throw new HttpError(404, "Nie znaleziono filmu", "MOVIE_NOT_FOUND");
      }

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }

  async addActor(req: Request, res: Response, next: NextFunction) {
    try {
      await movieService.addActorToMovie(
        req.params.movieId,
        req.params.actorId
      );
      res.sendStatus(201);
    } catch (err) {
      next(err);
    }
  }

  async removeActor(req: Request, res: Response, next: NextFunction) {
    try {
      await movieService.removeActorFromMovie(
        req.params.movieId,
        req.params.actorId
      );
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }

  async addGenre(req: Request, res: Response, next: NextFunction) {
    try {
      await movieService.addGenreToMovie(
        req.params.movieId,
        req.params.genreId
      );
      res.sendStatus(201);
    } catch (err) {
      next(err);
    }
  }

  async removeGenre(req: Request, res: Response, next: NextFunction) {
    try {
      await movieService.removeGenreFromMovie(
        req.params.movieId,
        req.params.genreId
      );
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}

export const movieController = new MovieController();
