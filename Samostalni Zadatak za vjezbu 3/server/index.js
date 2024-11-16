import express from 'express';
import cors from 'cors';
import kosaraRouter from './routes/kosarica.js';
import proizvodRouter from './routes/proizvodi.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use("/narudzbe", kosaraRouter);
app.use("/proizvodi", proizvodRouter)

app.listen(PORT, (err) => {
  if (err) {
    console.log('Server ne radi', err);
  } else {
    console.log('Server radi na' + PORT);
  }
});
