import { Movie } from "@models/movie.model";
import { MovieActor } from "@models/movieActor.model";
import { MovieGenre } from "@models/movieGenre.model";

export class MovieRepository {
  findAll() {
    return Movie.find();
  }

  findById(id: string) {
    return Movie.findById(id);
  }

  create(data: {
    title: string;
    duration: number;
    release_year: number;
    description: string;
  }) {
    return Movie.create(data);
  }

  update(
    id: string,
    data: {
      title: string;
      duration: number;
      release_year: number;
      description: string;
    }
  ) {
    return Movie.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  delete(id: string) {
    return Movie.findByIdAndDelete(id);
  }

  findActors(movieId: string) {
    return MovieActor.find({ movie_id: movieId }).populate({
      path: "actor_id",
      select: "name surname",
    });
  }

  findGenres(movieId: string) {
    return MovieGenre.find({ movie_id: movieId }).populate({
      path: "genre_id",
      select: "name",
    });
  }

  addActor(movieId: string, actorId: string) {
    return MovieActor.create({ movie_id: movieId, actor_id: actorId });
  }

  hasActor(movieId: string, actorId: string) {
    return MovieActor.exists({
      movie_id: movieId,
      actor_id: actorId,
    });
  }

  removeActor(movieId: string, actorId: string) {
    return MovieActor.findOneAndDelete({
      movie_id: movieId,
      actor_id: actorId,
    });
  }

  removeAllActors(movieId: string) {
    return MovieActor.deleteMany({ movie_id: movieId });
  }

  addGenre(movieId: string, genreId: string) {
    return MovieGenre.create({ movie_id: movieId, genre_id: genreId });
  }

  hasGenre(movieId: string, genreId: string) {
    return MovieGenre.exists({
      movie_id: movieId,
      genre_id: genreId,
    });
  }

  removeGenre(movieId: string, genreId: string) {
    return MovieGenre.findOneAndDelete({
      movie_id: movieId,
      genre_id: genreId,
    });
  }

  removeAllGenres(movieId: string) {
    return MovieGenre.deleteMany({ movie_id: movieId });
  }
  count() {
    return Movie.countDocuments();
  }
}

export const movieRepository = new MovieRepository();
