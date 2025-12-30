import { Genre } from "@models/genre.model";

export class GenreRepository {
  findAll() {
    return Genre.find();
  }

  findById(id: string) {
    return Genre.findById(id);
  }

  findByName(name: string) {
    return Genre.findOne({ name });
  }

  create(data: { name: string }) {
    return Genre.create(data);
  }

  update(id: string, data: { name: string }) {
    return Genre.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  delete(id: string) {
    return Genre.findByIdAndDelete(id);
  }
}

export const genreRepository = new GenreRepository();
