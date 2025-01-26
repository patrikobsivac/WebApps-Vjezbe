import express from 'express';
import { connectToDatabase } from '../db.js';
import { ObjectId } from 'mongodb';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get("/tasks", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        const korisnik = await usersCollection.findOne({ _id: new ObjectId(req.korisnikID) });
        res.status(200).json(korisnik.tasks);
    } catch (err) {
        console.error('Greška tijekom dohvaćivanja zadataka:', err);
        res.status(500).json({ error: 'Greška tijekom dohvaćivanja zadataka.'});
    }
});

router.post('/tasks', async (req, res) => {
    try {
        const {opis, naslov, tagovi } = req.body;

        if (!naslov || !opis) {
            return res.status(400).json({ error: 'Nedostaju sva polja.' });
        }
        const noviTask = {
            id: new ObjectId().toString(),
            naslov,
            opis,
            zavrsen: false,
            tagovi: tagovi || [],
        };
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        const rez = await usersCollection.updateOne(
            { _id: new ObjectId(req.userId) },
            { $push: { tasks: newTask } }
        );

        if (rez.matchedCount === 0) {
            return res.status(404).json({ error: 'Korisnik nije pronađen' });
        }
        res.status(201).json(noviTask);
    } catch (err) {
        console.error('Greška prilikom dodavanja taska:', err);
        res.status(500).json({ error: 'Greška prilikom dodavanja taska' });
    }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const db  = await connectToDatabase();
      const usersCollection = db.collection('users');
      const rez = await usersCollection.updateOne(
          { _id: new ObjectId(req.userId) },
          { $pull: { tasks: { id: id } } }
      );
      if (rez.deletedCount === 0) {
          return res.status(404).json({ error: 'Zadatak nije pronađen'});
      }
      res.status(200).json({ message: 'Zadatak je uspješno obrisan'});
  } catch (err) {
      console.error('Greška tijekom brisanja zadataka:', err);
      res.status(500).json({ error: 'Greška tijekom brisanja zadataka'});
  }
});

router.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        const rez = await usersCollection.updateOne(
            { 
                _id: new ObjectId(req.userId),
                'tasks.id': id
            },
            { $set: { 'tasks.$.zavrsen': true } }
        );
        if (rez.matchedCount === 0) {
            return res.status(404).json({ error: 'Zadatak nije pronađen' });
        }
        res.status(200).json({ message: 'Zadatak je ispunjen' });
    } catch (err) {
        console.error('Greška tijekom označivanja taska:', err);
        res.status(500).json({ error: 'Greška tijekom označivanja taska'});
    }
});
export default router;
