import { Actor } from "@models/actor.model";

export class ActorRepository {
  findAll() {
    return Actor.find();
  }
  
  findById(id: string) {
    return Actor.findById(id);
  }

  create(data: { name: string; surname: string }) {
    return Actor.create(data);
  }

  update(id: string, data: { name: string; surname: string }) {
    return Actor.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  delete(id: string) {
    return Actor.findByIdAndDelete(id);
  }
}

export const actorRepository = new ActorRepository();
