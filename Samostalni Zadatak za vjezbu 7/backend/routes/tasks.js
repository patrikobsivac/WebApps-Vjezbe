import express from 'express';
import { connectToDatabase } from '../db.js';
import { ObjectId } from 'mongodb';

const router = express.Router();
const db = await connectToDatabase();
const getUserCollection = (userId) => db.collection(`tasks_${userId}`);

async function verifyJWT(token) {
  try {
    let decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error(`Error verifying JWT: ${err}`);
    return null;
  }
}

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const authHeader = req.headers.authorization;
  const decoded = await verifyJWT(token);
  const token = authHeader.split(' ')[1];

  if (!authHeader) {
    return res.status(401).send({ msg: 'Neovlašteno' });
  }

  if (!decoded) {
    return res.status(401).json({ msg: 'Neispravan token.' });
  }
  try {
    const korisnikID = decoded.id;
    const korisnikCollection = getUserCollection(userId);
    const rez = await korisnikCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { gotovo: true } }
    );

    if (rez.modifiedCount === 1) {
      res.status(200).json({ msg: 'Zadatak je završen' });
    } else {
      res.status(404).json({ msg: 'Zadatak nije pronađen' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Dogodila se greška.', err: error.message });
  }
});

router.get('/', async (req, res) => {
  const authHeader = req.headers.authorization;
  const decoded = await verifyJWT(token);
  const token = authHeader.split(' ')[1];
  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith('Nosilac ')) {
    return res.status(401).json({ greska: 'Neovlašteno' });
  }

  if (!decoded) {
    return res.status(401).json({ greska: 'Neispravan token.' });
  }

  try {
    const korisnikID = decoded.id;
    const korisnikCollection = getUserCollection(korisnikID);
    const tasks = await korisnikCollection.find({}).toArray();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({
      msg: 'Dogodila se greška prilikom dohvaćanja taskova.',
      err: error.message,
    });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const authHeader = req.headers.authorization;
  const decoded = await verifyJWT(token);
  const token = authHeader.split(' ')[1];

  if (!authHeader || !authHeader.startsWith('nosilac ')) {
    return res.status(401).json({ msg: 'Neovlašteno' });
  }

  if (!decoded) {
    return res.status(401).json({ greska: 'Neispravan token.' });
  }

  try {
    const korisnikID = decoded.id;
    const korisnikCollection = getUserCollection(korisnikID);
    const rez = await korisnikCollection.deleteOne({ _id: new ObjectId(id) });

    if (rez.deletedCount === 1) {
      res.status(200).json({ message: 'Zadatak obrisan' });
    } else {
      res.status(404).json({ message: 'Zadatak nije pronađen' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Dogodila se greška.', err: error.message });
  }
});

router.post('/', async (req, res) => {
  const data = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const decoded = await verifyJWT(token);

  if (!authHeader || !authHeader.startsWith('Nosilac ')) {
    return res.status(401).json({ msg: 'Neovlašteno' });
  }

  if (!decoded) {
    return res.status(401).json({ greska: 'Neispravan JWT token.' });
  }

  try {
    const korisnikID = decoded.id;
    const korisnikCollection = getUserCollection(korisnikID);

    const newZadatak = {
      ...data,
      tags: data.tags && Array.isArray(data.tags) ? data.tags : [],
      createdAt: new Date(),
    };
    const rez = await korisnikCollection.insertOne(newZadatak);

    res.status(201).json({
      message: 'Zadatak uspješno dodan.',
      insertedId: rez.insertedId,
    });
  } catch (err) {
    res.status(500).json({
      greska: 'Dogodila se greška prilikom dodavanja zadatka.',
      err: error.message,
    });
  }
});
export default router;
