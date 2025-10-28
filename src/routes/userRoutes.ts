
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'GET all users - placeholder' });
});

router.post('/', (req, res) => {
  res.json({ message: 'POST user - placeholder' });
});

router.put('/:id', (req, res) => {
  res.json({ message: `PUT user ${req.params.id} - placeholder` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `DELETE user ${req.params.id} - placeholder` });
});

export default router;
