import { movies } from '../data/store.js';

export function ID_Film(req, res, next) {
  const filmID = parseInt(req.params.id);
  const film = movies.find((m) => m.id === filmID);
  if (!film) {
    return res.status(404).json({ error: 'Film nije pronađen' });
  }
  req.film = film;
  next();
}
