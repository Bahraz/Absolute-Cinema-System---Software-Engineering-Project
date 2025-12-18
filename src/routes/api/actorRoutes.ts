import express from 'express';
import { actorController } from '@controllers/actorController';

const router = express.Router();

// Endpoints for managing actors.
router.get('/show', (req, res) => actorController.showActors(req, res)); // select
router.post('/', (req, res) => actorController.addActor(req, res)); // insert
router.put("/:id", (req, res) => actorController.updateActorById(req, res)); // update
router.delete('/:id', (req, res) => actorController.deleteActorById(req, res)); // delete

export default router;