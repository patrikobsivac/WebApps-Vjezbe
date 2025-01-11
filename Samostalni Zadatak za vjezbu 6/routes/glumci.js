import express from 'express';
import { check, validationResult, param } from 'express-validator';
import { ID_Glumac } from '../middleware/idglumci.js';
import { actors } from '../data/store.js';

const router = express.Router();

router.get(
  '/:id',
  [param('id').isInt().withMessage('ID mora biti integer')],
  input,
  ID_Glumac,
  (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }
    res.json(req.glumac);
  }
);

router.get(
  '/:name',
  [param('name').isString().withMessage('Name mora biti string')],
  input,
  (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }
    const { name } = req.params;
    const filterGlumci = actors.filter((glumac) =>
      glumac.name.toLowerCase().includes(name.toLowerCase())
    );
    res.json(filterGlumci);
  }
);

router.patch(
  '/:id',
  ID_Glumac,
  [
    check('name').optional().isString().withMessage('Name mora biti string'),
    check('birthYear')
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage(
        'BirthYear mora biti važeći cijeli broj između 1900. i tekuće godine'
      ),
  ],
  input,
  (req, res) => {
    if (!req.body.name && !req.body.birthYear) {
      return res.status(400).json({
        error: 'Za ažuriranje potrebno je barem jedno ime ili godina rođenja',
      });
    }
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }
    const { ime, god_rodenja, filmovi } = req.body;
    if (ime) req.glumac.name = ime;
    if (god_rodenja) req.glumac.birthYear = god_rodenja;
    if (filmovi) req.glumac.movies = filmovi;
    res.json({ msg: 'Actor ažuriran', actor: req.actor });
  }
);

router.post(
  '/',
  [
    check('name')
      .notEmpty()
      .withMessage('Name je obavezan')
      .isString()
      .withMessage('Name mora biti string'),
    check('birthYear')
      .notEmpty()
      .withMessage('BirthYear je obavezan')
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage(
        'BirthYear mora biti važeći cijeli broj između 1900. i tekuće godine'
      ),
  ],
  input,
  (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }
    const { id, name, birthYear, movies } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Nedostaje obavezno polje: id' });
    }
    actors.push({ id, name, birthYear, movies: movies || [] });
    res.status(201).json({
      message: 'Actor dodan',
      actor: { id, name, birthYear, movies: movies || [] },
    });
  }
);

const input = (req, res, next) => {
  if (req.params.name) {
    req.params.name = req.params.name.trim();
  }
  if (req.body.name) {
    req.body.name = req.body.name
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  next();
};
export default router;
