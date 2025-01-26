import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.use('/tasks', tasksRouter);
app.get('/', (req, res) => {
  res.send('TaskManagerBackend');
});

app.listen(PORT, () => {
  console.log(`Poslužitelj sluša na http://localhost:${PORT}`);
});
