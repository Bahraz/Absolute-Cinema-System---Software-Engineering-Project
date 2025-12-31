import { genreRepository } from "@repositories/genre.repository";

export class GenreService {
  findAll() {
    return genreRepository.findAll();
  }

  findById(id: string) {
    return genreRepository.findById(id);
  }

  async create(data: { name: string }) {
    const existing = await genreRepository.findByName(data.name);
    if (existing) throw new Error("GENRE_EXISTS");

    return genreRepository.create(data);
  }

  async update(id: string, data: { name: string }) {
    const existing = await genreRepository.findByName(data.name);
    if (existing && existing._id.toString() !== id)
      throw new Error("GENRE_EXISTS");

    const updated = await genreRepository.update(id, data);
    if (!updated) throw new Error("GENRE_NOT_FOUND");

    return updated;
  }

  async delete(id: string) {
    const deleted = await genreRepository.delete(id);
    if (!deleted) throw new Error("GENRE_NOT_FOUND");
    return true;
  }
}

export const genreService = new GenreService();
