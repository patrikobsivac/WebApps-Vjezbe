import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './db.js';
import { config } from 'dotenv';
config();

const app = express();
app.use(express.json());
app.use(cors());
const db = await connectToDatabase();

app.get('/', (req, res) => {
  res.send('Pizza app');
});

app.get('/korisnici', async (res, req) => {
  let korisnici_collection = db.collection('Korisnici');
  let sviKorisnici = await korisnici_collection.find().toArray();
  res.status(200).json(sviKorisnici);
});

app.get('/pizze', async (req, res) => {
  let pizze_collection = db.collection('pizze');
  let cijena = req.query.cijena;

  if (!cijena) {
    let pizze_rezultati = await pizze_collection.find().toArray();
    console.log(pizze_rezultati);
    return res.status(200).json(pizze_rezultati);
  }
  try {
    let pizze_rezultati = await pizze_collection
      .find({ cijena: Number(cijena) })
      .toArray();
    res.status(200).json(pizze_rezultati);
  } catch (err) {
    res.status(400).json({ err: err.errorResponse });
  }
});

// pizze/naziv
app.get('/pizze/:naziv', async (req, res) => {
  let pizze_collection = db.collection('pizze');
  let naziv_param = req.params.naziv;
  let pizza = await pizze_collection.find({ naziv: naziv_param }).toArray();
  console.log(pizza);
  res.status(200).json(pizza);
});

// narudzba
app.post('/narudzba', async (res, req) => {
  const pizze_collection = db.collection('pizze');
  const narudzbe_collection = db.collection('narudzbe');
  const newNarudzba = req.body;
  const primarniKljuc = ['kupac', 'narucena_pizza'];
  const stavkaPrimarniKljuc = ['naziv', 'kolicina', 'cijena'];
  const kupacPrimarniKljuc = ['ime', 'prezime', 'adresa', 'broj_telefona'];

  const nedostaciKljuca = primarniKljuc.filter(key => !(key in newNarudzba));
  if(nedostaciKljuca.length > 0){
    console.log('Narudžba obaveznog ključa nedostaje: ', nedostaciKljuca);
    return res.status(400).json({ err: 'Narudžba obaveznog ključa nedostaje: ${missingKeys.join(', ')}' });
  }
  const nedostaciKupacKljuca = kupacPrimarniKljuc.filter(key => !(key in newNarudzba.kupac));
  if(nedostaciKupacKljuca.length > 0){
    console.log('Narudžba obaveznog ključa kupca nedostaje: ', nedostaciKupacKljuca);
    return res.status(400).json({ err: 'Narudžba obaveznog ključa kupca nedostaje: ${nedostaciKupacKljuca.join(', ')}' });
  }
  const telefon = novaNarudzba.kupac.broj_telefona;

});

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    console.log('Greška prilikom pokretanja servera', error);
  }
  console.log(`Pizza poslužitelj dela na http://localhost:${PORT}`);
});

// npm install express
// npm install mongodb
