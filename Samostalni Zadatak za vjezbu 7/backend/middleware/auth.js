import jwt from 'jsonwebtoken';

const verifyJWT = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error(`Dogodila se greška prilikom projvere JWT tokena: ${err}`);
    return null;
  }
};

const authMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = await verifyJWT(token);

    if (!authorizationHeader) {
      return res.status(400).json({ err: 'Nevalja JWT token' });
    }

    if (!decoded) {
      return res.status(401).json({ err: 'Nevalja JWT token' });
    }
    req.korisnikID = decoded.korisnikID;
    next();
  } catch (err) {
    console.error('Dogodila se greška tijekom autentifikacije:', err);
    res.status(400).json({ err: 'Dogodila se greška tijekom autentifikacije' });
  }
};
export default authMiddleware;
