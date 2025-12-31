import { actorRepository } from "@repositories/actor.repository";

export class ActorService {
  findAll() {
    return actorRepository.findAll();
  }

  findById(id: string) {
    return actorRepository.findById(id);
  }

  create(data: { name: string; surname: string }) {
    return actorRepository.create(data);
  }

  update(id: string, data: { name: string; surname: string }) {
    return actorRepository.update(id, data);
  }

  delete(id: string) {
    return actorRepository.delete(id);
  }
}

export const actorService = new ActorService();
