import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './db.js';
import { config } from 'dotenv';
config();

const app = express();
app.use(express.json());
app.use(cors());
const db = await connectToDatabase();
console.log(process.env.MONGO_URI);
console.log(process.env.MONGO_DB_NAME);

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
  } catch (error) {
    res.status(400).json({ error: error.errorResponse });
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
  const artiklPrimarniKljuc = ['naziv', 'kolicina', 'cijena'];
  const kupacPrimarniKljuc = ['ime', 'prezime', 'adresa', 'broj_telefona'];

  const nedostaciKljuca = primarniKljuc.filter(key => !(key in newNarudzba));
  if(nedostaciKljuca.length > 0){
    console.log('Narudžba obaveznog ključa nedostaje: ', nedostaciKljuca);
    return res.status(400).json({ error: `Narudžba obaveznog ključa nedostaje: ${nedostaciKljuca.join(', ')}` });
  }
  const nedostaciKupacKljuca = kupacPrimarniKljuc.filter(key => !(key in newNarudzba.kupac));
  if(nedostaciKupacKljuca.length > 0){
    console.log('Narudžba obaveznog ključa kupca nedostaje: ', nedostaciKupacKljuca);
    return res.status(400).json({ error: `Narudžba obaveznog ključa kupca nedostaje: ${nedostaciKupacKljuca.join(', ')}` });
  }
  const telefon = novaNarudzba.kupac.broj_telefona;

  try{
    const pizzaDostupna = await pizze_collection.find().toArray();
    const naziviDostupnosti = dostupno.map(pizza => pizza.naziv);
    for(const artikl of newNarudzba.narucena_pizza){
      const nedostaciArtiklKljuca = artiklPrimarniKljuc.filter(key => !(key in artikl));
    if(nedostaciArtiklKljuca.length > 0){
      console.log('U artikli narudžbe nedostaju obvezni ključevi: ', nedostaciArtiklKljuca, artikl);
      return res.status(400).json({ error: `U artikli narudžbe nedostaju obvezni ključevi: ${nedostaciArtiklKljuca.join(', ')}`
    });
}
if (!naziviDostupnosti.includes(artikl.naziv)) {
  return res.status(400).json({ error: `Pizza "${artikl.naziv}" nema u ponudi.` });
}
if (isNaN(artikl.kolicina) || artikl.kolicina <= 0) {
  return res.status(400).json({
      error: `Količina mora biti pozitivan broj za artikl: ${JSON.stringify(artikl)}`
  });
}
const rez = await narudzbe_collection.insertOne({ ...newNarudzba, datum: new Date()});
console.log('Narudžba je spremljena: ', rez);
res.status(201).json({ msg: 'Narudžba je uspješno spremljena', insertedId: rez.insertedId});
  } catch (error){
    console.error('Dogodila se greška pri obrade narudžbe: ', error);
    res.status(500).json({ error: 'Dogodila se greška na serveru prilikom obrade narudžbe' });
  }
});

app.patch('/narudzbe/:id', async (req, res)=>{
  let narudzbe_collection = db.collection('narudzbe');
  let id_param = req.params.id;
  let updateArtikl = req.body.artikl;
  if (!updateArtikl.every(artikl => Number.isInteger(artikl.kolicina) && artikl.kolicina > 0)) {
    return res.status(400).json({ error: 'Količina mora imati pozitivan broj' });
  }
  try{
    let rez = await narudzbe_collection.updateOne({ _id: new ObjectId(id_param) }, { $set: { narucene_pizze: azuriraneStavke } });
    if(rez.modifiedCount===0){
      return res.status(404).json({ error: 'Narudžba nije pronađen' });
    }
    res.status(200).json({modifiedCount: rez.modifiedCount });
  } catch (error) {
    console.log(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
})

app.patch('/pizze/:naziv', async(res,req)=>{
  let pizze_collection = db.collection('pizze');
  let naziv_param = req.params.naziv;
  let newCijena = req.body.cijena;

  if(newCijena <= 0){
    return res.status(400).json({ error: 'Cijena mora biti veći od nule'});
  }

  try{
    const rez = await pizze_collection.updateOne({ naziv: naziv_param }, { $set: { cijena: newCijena } });
    if(rez.modifiedCount===0){
      return res.status(400).json({ error: 'Pizza nije pronađen' });
    }
    res.status(200).json({ modifiedCount: rez.modifiedCount });
  }catch (error){
   console.log(error.errorResponse);
   res.status(400).json({ error: error.errorResponse });
  }
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
