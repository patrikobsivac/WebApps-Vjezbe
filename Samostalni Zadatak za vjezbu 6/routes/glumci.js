import express from 'express';
import { check, validationResult, param } from 'express-validator';
import { glumci } from '../middleware/findActorById.js';
import { actors } from '../data/store.js';

const router = express.Router();

router.get(
  '/:id',
  [param('id').isInt().withMessage('ID mora biti integer')],
  input,
  glumci,
  (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }
    res.json(req.actor);
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
    const filterGlumci = actors.filter((actor) =>
      actor.name.toLowerCase().includes(name.toLowerCase())
    );
    res.json(filterGlumci);
  }
);

router.patch(
  '/:id',
  glumci,
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
    const { name, birthYear, movies } = req.body;
    if (name) req.actor.name = name;
    if (birthYear) req.actor.birthYear = birthYear;
    if (movies) req.actor.movies = movies;
    res.json({ msg: 'Actor ažuriran', actor: req.actor });
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
