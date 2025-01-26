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

async function hashPassword(plainPassword, saltRounds) {
  try {
    let hash = await bcrypt.hash(plainPassword, saltRounds);
    return hash;
  } catch (err) {
    console.error(`Došlo je do greške prilikom hashiranja lozinke: ${err}`);
    return null;
  }
}

async function checkPassword(plainPassword, hashedPassword) {
  try {
    let result = await bcrypt.compare(plainPassword, hashedPassword);
    return result;
  } catch (err) {
    console.error(
      `Došlo je do greške prilikom usporedbe hash vrijednosti: ${err}`
    );
    return false;
  }
}

async function generateJWT(payload) {
  try {
    let token = jwt.sign(payload, JWT_SECRET);
    return token;
  } catch (err) {
    console.error(`Došlo je do greške prilikom generiranja JWT tokena: ${err}`);
    return null;
  }
}

async function verifyJWT(token) {
  try {
    let decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error(
      `Došlo je do greške prilikom verifikacije JWT tokena: ${err}`
    );
    return null;
  }
}

router.post('/login', async (res, req) => {
  const { username, password } = req.body;

  const korisnik = await usersCollection.findOne({ username });
  if (!korisnik) {
    return res.status(401).send('Autentifikacija nije uspjela!');
  }

  const isPasswordValjan = await checkPassword(password, korisnik.password);
  if (!isPasswordValjan) {
    return res.status(401).send('Autentifikacija nije uspjela!');
  }

  let token = await generateJWT({
    id: korisnik._id,
    korisnik: korisnik.username,
  });
  if (!token) {
    return res.status(500).json({ msg: 'Error generiranje tokena' });
  }
  return res.status(200).json({ jwt_token: token });
});

router.post('/registracija', async (res, req) => {
  const { username, password } = req.body;
});

if (!username || !password) {
  return res
    .status(400)
    .json({ message: 'Korisničko ime i lozinka su obavezni!' });
}

const postojeciKorisnik = await usersCollection.findOne({ korisnik });
if (postojeciKorisnik) {
  return res.status(409).json({ msg: 'Korisničko ime već postoji!' });
}

const hashed_lozinka = await hashPassword(password, 10);
if (!hashed_lozinka) {
  return res.status(500).send('Error hashiranje lozinke!');
}
const noviKorisnik = { username, password: hashed_lozinka };

try {
  const rez = await usersCollection.insertOne(noviKorisnik);
  return res.status(201).json({
    message: 'Korisnik se uspješno registrirao',
    user: { id: rez.insertedId, username: noviKorisnik.username },
  });
} catch (err) {
  console.error(`Error ubacivanje korisnika u bazu podataka: ${err}`);
  return res.status(500).json({ message: 'Interna greška poslužitelja' });
}

export default router;
export { hashPassword, checkPassword, generateJWT, verifyJWT };
