import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';
import authRouter from './routes/auth.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import {
  hashPassword,
  checkPassword,
  generateJWT,
  verifyJWT,
} from './routes/auth.js';
dotenv.config();

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/tasks', tasksRouter);
app.get('/', (req, res) => {
  res.send('TaskManagerBackend');
});

app.listen(PORT, () => {
  console.log(`Poslužitelj sluša na http://localhost:${PORT}`);
});
