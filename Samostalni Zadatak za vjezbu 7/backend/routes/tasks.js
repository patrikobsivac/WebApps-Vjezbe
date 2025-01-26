import express from 'express';
import { connectToDatabase } from '../db.js';
import { ObjectId } from 'mongodb';

const router = express.Router();
const db = await connectToDatabase();

let tasks = [
  {
    id: 1,
    naslov: 'Kupiti kruh',
    opis: 'Idi kupiti kruh danas',
    zavrsen: false,
  },
  {
    id: 2,
    naslov: 'Naučiti Vue.js',
    opis: 'Prouči malo Vue.js dokumentaciju',
    zavrsen: false,
  },
  {
    id: 3,
    naslov: 'Riješi zadaću iz UPP-a',
    opis: 'Please natjeraj se riješiti zadaću iz UPP-a, moraš i taj kolegij proći!',
    zavrsen: false,
  },
];

router.patch('/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const rez = await db
      .collection('tasks')
      .updateOne({ _id: new ObjectId(taskId) }, { $set: { gotovo: true } });

    if (rez.modifiedCount === 1) {
      res.status(200).json({ message: 'zadatak gotov' });
    } else {
      res.status(404).json({ message: 'Nema zadataka' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error ', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    console.log('Zahtjev primljen na GET /tasks');
    const tasks = await db.collection('tasks').find().toArray();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server Error:', err: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const result = await db
      .collection('tasks')
      .deleteOne({ _id: new ObjectId(taskId) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Zadatak obrisan' });
    } else {
      res.status(404).json({ message: 'Nema zadataka' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error', err: error.message });
  }
});

router.post('/', async (req, res) => {
  console.log('Zahtjev primljen na POST /tasks');
  let podaci = req.body;
  console.log('Podaci u body-u zahtjeva:', JSON.stringify(podaci, null, 2));

  if (!podaci || (Array.isArray(podaci) && podaci.length === 0)) {
    console.warn('Prazno tijelo zahtjeva je primljen.');
    return res
      .status(400)
      .json({ error: 'Tijelo zahtjeva ne smije biti prazan.' });
  }
  try {
    console.time('Vrijeme izvršenja upisa u bazu podataka');
    if (Array.isArray(podaci)) {
      const podaciTag = podaci.map((task) => ({
        ...task,
        tags: task.tags && Array.isArray(task.tags) ? task.tags : [],
      }));
      console.log('Primljeno polje podataka s oznakama');
      console.log('okrećem insertMany...');
      let rez = await db.collection('tasks').insertMany(podaciTag);

      console.log(`Uspješno su dodani ${rez.insertedCount} dokumenti.`);
      res.status(201).json({
        msg: 'Uspješno dodano još više dokumenti.',
        insertedCount: rez.insertedCount,
        insertedIds: rez.insertedIds,
      });
    } else {
      const newZadatak = {
        ...podaci,
        tags: podaci.tags && Array.isArray(podaci.tags) ? podaci.tags : [],
      };
      console.log('Jedan objekt s tagovima je primljen');
      console.log('pokrećem insertOne...');

      let rez = await db.collection('tasks').insertOne(newZadatak);
      console.log(`Uspješno je dodan dokument sa ID: ${rez.insertedId}.`);
      res.status(201).json({
        msg: 'Uspješno dodan dokument.',
        insertedId: rez.insertedId,
      });
    }
    console.timeEnd('Vrijeme izvršavanja upisa u bazu');
  } catch (err) {
    console.error('Greška prilikom unosa u bazu podataka:', err.message);
    console.debug('Pojedinosti o pogrešci:', err);

    res.status(500).json({
      greska: 'Došlo je do greške prilikom unosa podataka u bazu.',
      detalji: error.message,
    });
  } finally {
    console.log('Obrada zahtjeva POST /tasks završena.');
  }
});
export default router;
