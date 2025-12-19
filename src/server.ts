import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from '@config/database';

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Serwer działa na porcie ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Błąd podczas uruchamiania serwera:', err);
  });
