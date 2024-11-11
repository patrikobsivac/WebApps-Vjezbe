import express from 'express';
import nekretnineRouter from './routes/nekretnine.js';
import ponudeRouter from './routes/ponude.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/nekretnine', nekretnineRouter);
app.use('/ponude', ponudeRouter);

app.listen(port, () => console.log(`Poslužitelj pokrenut na http://localhost:${port}`));
