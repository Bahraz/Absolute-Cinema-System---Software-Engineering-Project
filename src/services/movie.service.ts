import { movieRepository } from "@repositories/movie.repository";
import { actorRepository } from "@repositories/actor.repository";
import { genreRepository } from "@repositories/genre.repository";

export class MovieService {
  async getAllMovies() {
    return movieRepository.findAll();
  }

  async getMovieDetails(movieId: string) {
    const movie = await movieRepository.findById(movieId);
    if (!movie) return null;

    const actors = await movieRepository.findActors(movieId);
    const genres = await movieRepository.findGenres(movieId);

    return {
      movie,
      actors: actors.map((a) => a.actor_id),
      genres: genres.map((g) => g.genre_id),
    };
  }

  async getAllActors() {
    return actorRepository.findAll();
  }

  async getAllGenres() {
    return genreRepository.findAll();
  }

  async createMovie(data: {
    title: string;
    duration: number;
    release_year: number;
    description: string;
  }) {
    return movieRepository.create(data);
  }

  async updateMovie(
    movieId: string,
    data: {
      title: string;
      duration: number;
      release_year: number;
      description: string;
    }
  ) {
    return movieRepository.update(movieId, data);
  }

  async deleteMovie(movieId: string) {
    // usuń relacje
    await movieRepository.removeAllActors(movieId);
    await movieRepository.removeAllGenres(movieId);

    // usuń film
    return movieRepository.delete(movieId);
  }

  async addActorToMovie(movieId: string, actorId: string) {
    const exists = await movieRepository.hasActor(movieId, actorId);
    if (exists) {
      throw new Error("ACTOR_ALREADY_ASSIGNED");
    }

    return movieRepository.addActor(movieId, actorId);
  }

  async removeActorFromMovie(movieId: string, actorId: string) {
    return movieRepository.removeActor(movieId, actorId);
  }

  async addGenreToMovie(movieId: string, genreId: string) {
    const exists = await movieRepository.hasGenre(movieId, genreId);
    if (exists) {
      throw new Error("GENRE_ALREADY_ASSIGNED");
    }

    return movieRepository.addGenre(movieId, genreId);
  }

  async removeGenreFromMovie(movieId: string, genreId: string) {
    return movieRepository.removeGenre(movieId, genreId);
  }
}

export const movieService = new MovieService();
