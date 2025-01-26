import express from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../db.js';
dotenv.config();

const router = express.Router();
const db = await connectToDatabase();
const JWT_SECRET = process.env.JWT_SECRET;
const usersCollection = db.collection('korisnici');

router.post('/prijava', async (req, res) => {
  try {
      const { username, password } = req.body;
      const db = await connectToDatabase();
      const usersCollection = db.collection('users');
      const user = await usersCollection.findOne({ username });
      if (!user) {
          return res.status(400).json({ error: 'Korisnik nije pronađen' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          return res.status(400).json({ error: 'Greška tijekom prijave' });
      }
      const token = jwt.sign(
          { userId: user._id.toString() },
          process.env.JWT_SECRET, 
          { expiresIn: '24h' }
      );
      res.json({ token });
  } catch (error) {
      res.status(500).json({ error: 'Greška tijekom prijave' });
  }
});

router.post('/registracija', async (req, res) => {
  try {
      const { username, password } = req.body;
    
      if (!username || !password) {
          return res.status(400).json({ error: 'Korisničko ime i lozinka su potrebni' });
      }
      const db = await connectToDatabase();
      const usersCollection = db.collection('users');
      const userExist = await usersCollection.findOne({ username });
      if (userExist) {
          return res.status(400).json({ error: 'Korisnik već postoji' });
      }
      const hashedPass = await bcrypt.hash(password, 10);
      const noviUser = {
          username,
          password: hashedPass,
          tasks: []
      };
      await usersCollection.insertOne(noviUser);
      res.status(201).json({ message: 'Uspješno registriran' });
  } catch (error) {
      res.status(500).json({ error: 'Greška tijekom registracije korisnika' });
  }
});
export default router;