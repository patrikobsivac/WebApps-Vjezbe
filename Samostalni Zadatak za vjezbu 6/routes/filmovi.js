import express from 'express';
import { param, check, validationResult, query } from 'express-validator';
import { movies } from '../data/store.js';
import { filmovi } from '../middleware/findMovieById.js';

const router = express.Router();
router.use(input);

router.get(
  '/:id',
  [param('id').isInt().withMessage('ID mora biti integer')],
  filmovi,
  (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }
    res.json(req.movie);
  }
);

router.patch(
  '/:id',
  findMovieById,
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
    if (title) req.movie.title = title;
    if (year) req.movie.year = year;
    if (genre) req.movie.genre = genre;
    if (director) req.movie.director = director;
    res.json({ message: 'Movie ažuriran', movie: req.movie });
  }
);

router.get(
  '/',
  [
    query('min_year')
      .optional()
      .isInt()
      .withMessage('min_year mora biti integer'),
    query('max_year')
      .optional()
      .isInt()
      .withMessage('max_year mora biti integer'),
    query('min_year')
      .optional()
      .custom((value, { req }) => {
        if (
          req.query.max_year &&
          parseInt(value) >= parseInt(req.query.max_year)
        ) {
          throw new Error('min_year mora biti manje nego max_year');
        }
        return true;
      }),
    query('max_year')
      .optional()
      .custom((value, { req }) => {
        if (
          req.query.min_year &&
          parseInt(value) <= parseInt(req.query.min_year)
        ) {
          throw new Error('max_year mora biti veći od min_year');
        }
        return true;
      }),
  ],
  (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: err.array() });
    }
    const { min_year, max_year } = req.query;
    let filterFilmovi = movies;
    if (min_year && max_year) {
      filterFilmovi = movies.filter(
        (movie) => movie.year >= min_year && movie.year <= max_year
      );
    } else if (min_year) {
      filterFilmovi = movies.filter((movie) => movie.year >= min_year);
    } else if (max_year) {
      filterFilmovi = movies.filter((movie) => movie.year <= max_year);
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
    res.status(201).json({ msg: 'Movie dodan', movie: noviMovie });
  }
);
export default router;
