import express from 'express';
import fs from 'fs/promises';
const PORT = 3000;
const app = express();

app.use(express.json());
app.get('/', (res, req) => {
  res.status(200).send('Obrada čitanja datoteka');
});

app.listen(PORT, (err) => {
  if (err) {
    console.log('Server ne radi', err);
  } else {
    console.log('Server radi na' + PORT);
  }
});
