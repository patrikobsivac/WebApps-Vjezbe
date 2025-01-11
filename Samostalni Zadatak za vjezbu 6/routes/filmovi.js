import express from 'express';
import { param, check, validationResult, query } from 'express-validator';
import { movies } from '../data/store.js';
import { ID_Film } from '../middleware/idfilmovi.js';

const router = express.Router();
router.use(input);

router.get(
  '/:id',
  [param('id').isInt().withMessage('ID mora biti integer')],
  ID_Film,
  (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }
    res.json(req.film);
  }
);

router.patch(
  '/:id',
  ID_Film,
  [
    check('title').optional().isString().withMessage('Title mora biti string'),
    check('year')
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage(
        'Year mora biti važeći cijeli broj između 1900. i tekuće godine'
      ),
    check('genre').optional().isString().withMessage('Genre mora biti string'),
    check('director')
      .optional()
      .isString()
      .withMessage('Director mora biti string'),
  ],
  (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }
    const { title, year, genre, director } = req.body;
    if (title) req.film.title = title;
    if (year) req.film.year = year;
    if (genre) req.film.genre = genre;
    if (director) req.film.director = director;
    res.json({ msg: 'Movie ažuriran', film: req.film });
  }
);

router.get(
  '/',
  [
    query('min_god')
      .optional()
      .isInt()
      .withMessage('min_god mora biti integer'),
    query('max_god')
      .optional()
      .isInt()
      .withMessage('max_god mora biti integer'),
    query('min_god')
      .optional()
      .custom((value, { req }) => {
        if (
          req.query.max_god &&
          parseInt(value) >= parseInt(req.query.max_god)
        ) {
          throw new Error('min_god mora biti manje nego max_god');
        }
        return true;
      }),
    query('max_god')
      .optional()
      .custom((value, { req }) => {
        if (
          req.query.min_god &&
          parseInt(value) <= parseInt(req.query.min_god)
        ) {
          throw new Error('max_god mora biti veći od min_god');
        }
        return true;
      }),
  ],
  (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }
    const { min_god, max_god } = req.query;
    let filterFilmovi = movies;
    if (min_god && max_god) {
      filterFilmovi = movies.filter(
        (film) => film.god >= min_god && movie.god <= max_god
      );
    } else if (min_god) {
      filterFilmovi = movies.filter((film) => film.god >= min_god);
    } else if (max_god) {
      filterFilmovi = movies.filter((film) => film.god <= max_god);
    }
    res.json(filterFilmovi);
  }
);

router.post(
  '/',
  [
    check('title').notEmpty().withMessage('Title je obavezan'),
    check('year')
      .isInt({ min: 1800, max: new Date().getFullYear() })
      .withMessage('Year mora biti važeći broj'),
    check('genre').notEmpty().withMessage('Genre je obavezan'),
    check('director').notEmpty().withMessage('Director je obavezan'),
  ],
  (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }
    const { id, title, year, genre, director } = req.body;
    const noviMovie = { id, title, year, genre, director };
    movies.push(noviMovie);
    res.status(201).json({ msg: 'Movie dodan', film: noviMovie });
  }
);
export default router;
