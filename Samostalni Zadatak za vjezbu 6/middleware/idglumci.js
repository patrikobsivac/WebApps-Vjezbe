import { actors } from '../data/store.js';

export function ID_Glumac(req, res, next) {
  const glumacID = parseInt(req.params.id);
  const glumac = actors.find((a) => a.id === glumacID);
  if (!glumac) {
    return res.status(404).json({ error: 'Glumac nije pronađen' });
  }
  req.glumac = glumac;
  next();
}
