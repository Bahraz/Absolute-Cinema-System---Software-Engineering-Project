import { Hall } from "@models/hall.model";

export class HallRepository {
  findAll() {
    return Hall.find();
  }

  findById(id: string) {
    return Hall.findById(id);
  }

  findByName(name: string) {
    return Hall.findOne({ name });
  }

  create(data: { name: string }) {
    return Hall.create(data);
  }

  update(id: string, data: { name: string }) {
    return Hall.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  delete(id: string) {
    return Hall.findByIdAndDelete(id);
  }
}

export const hallRepository = new HallRepository();
