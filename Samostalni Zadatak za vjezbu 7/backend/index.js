import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';
import authRouter from './routes/auth.js';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
config();

const PORT = 8000;
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: 'GET, POST, PUT, PATCH, HEAD, DELETE',
  allowedHeaders: 'Content-Type, Authorization'
}));

app.use('/api/auth', authRouter);
app.use('/api', tasksRouter);
app.get('/', (req, res) => {
  res.send('TaskManagerBackend');
});

app.listen(PORT, () => {
  console.log(`Poslužitelj sluša na http://localhost:${PORT}`);
});
