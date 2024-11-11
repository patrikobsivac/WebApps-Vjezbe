import express from 'express';
const router = express.Router();

let ponude = [
    { id: 1, nekretninaId: 1, ime: 'Ivan', prezime: 'Ivić', ponudjenaCijena: 118000, brojTelefona: '0981234567' }
];

router.post('/', (req, res) => {
    const { nekretninaId } = req.body;
    const nekretnina = nekretnine.find(n => n.id === nekretninaId);

    if (nekretnina) {
        const novaPonuda = { id: ponude.length + 1, ...req.body };
        ponude.push(novaPonuda);
        res.status(201).json(novaPonuda);
    } else {
        res.status(404).json({ poruka: 'Nekretnina nije pronađena' });
    }
});

export default router;
