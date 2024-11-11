import express from 'express';
const router = express.Router();

let nekretnine = [
    { id: 1, naziv: 'Stan u centru', opis: 'Dvosoban stan...', cijena: 120000, lokacija: 'Centar', brojSoba: 2, povrsina: 75 }
];

router.get('/', (req, res) => {
    res.status(200).json(nekretnine);
});

router.get('/:id', (req, res) => {
    const nekretnina = nekretnine.find(n => n.id == req.params.id);
    if (nekretnina) {
        res.status(200).json(nekretnina);
    } else {
        res.status(404).json({ poruka: 'Nekretnina nije pronađena' });
    }
});

router.post('/', (req, res) => {
    const novaNekretnina = { id: nekretnine.length + 1, ...req.body };
    nekretnine.push(novaNekretnina);
    res.status(201).json(novaNekretnina);
});

router.put('/:id', (req, res) => {
    const index = nekretnine.findIndex(n => n.id == req.params.id);
    if (index !== -1) {
        nekretnine[index] = { id: Number(req.params.id), ...req.body };
        res.status(200).json(nekretnine[index]);
    } else {
        res.status(404).json({ poruka: 'Nekretnina nije pronađena' });
    }
});

router.patch('/:id', (req, res) => {
    const nekretnina = nekretnine.find(n => n.id == req.params.id);
    if (nekretnina) {
        Object.assign(nekretnina, req.body);
        res.status(200).json(nekretnina);
    } else {
        res.status(404).json({ poruka: 'Nekretnina nije pronađena' });
    }
});

router.delete('/:id', (req, res) => {
    const index = nekretnine.findIndex(n => n.id == req.params.id);
    if (index !== -1) {
        nekretnine.splice(index, 1);
        res.status(200).json({ poruka: 'Nekretnina obrisana' });
    } else {
        res.status(404).json({ poruka: 'Nekretnina nije pronađena' });
    }
});

export default router;
