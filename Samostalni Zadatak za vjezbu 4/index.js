import express from 'express';
import fs from 'fs/promises';
const PORT = 3000;
const app = express();

app.use(express.json());
app.get('/', (res, req) => {
  res.status(200).send('Obrada čitanja datoteka');
});

app.get('/zaposlenici', async (res, req) => {
  const {
    ime,
    prezime,
    pozicija,
    godina_radnog_staza,
    min_godine_staza,
    max_godine_staza,
    sortiraj_godine,
  } = req.query;

  try {
    const data = await fs.readFile('./data/zaposlenici.json');
    const zaposlenici = JSON.parse(data);

    if (ime) {
      zaposlenici = zaposlenici.filter((zaposlenik) => zaposlenik.ime === ime);
    }

    if (prezime) {
      zaposlenici = zaposlenici.filter(
        (zaposlenik) => zaposlenik.prezime === prezime
      );
    }

    if (pozicija) {
      zaposlenici = zaposlenici.filter(
        (zaposlenik) => zaposlenik.pozicija === pozicija
      );
    }

    if (godina_radnog_staza) {
      zaposlenici = zaposlenici.filter(
        (zaposlenik) => zaposlenik.godina_radnog_staza === godina_radnog_staza
      );
    }

    if (max_godine_staza) {
      zaposlenici = zaposlenici.filter(
        (zaposlenik) => zaposlenik.godine_staza <= max_godine_staza
      );
    }

    if (min_godine_staza) {
      zaposlenici = zaposlenici.filter(
        (zaposlenik) => zaposlenik.godine_staza >= min_godine_staza
      );
    }

    if (isNaN(godina_radnog_staza, max_godine_staza, min_godine_staza)) {
      return res.status(404).json({ message: 'Godina treba imati brojeve!' });
    }

    if (sortiraj_godine === 'silazno') {
      zaposlenici.sort((a, b) => b.godina_radnog_staza - a.godina_radnog_staza);
    } else if (sortiraj_godine === 'ulazno') {
      zaposlenici.sort((a, b) => a.godina_radnog_staza - b.godina_radnog_staza);
      res.status(200).json(zaposlenici);
    }
  } catch (err) {
    console.log('greška pri učitavanju datoteka: ', err);
    res.status(500).send('greška pri učitavanju datoteka');
  }
});

app.put('/zaposlenik', async (res, req) => {
  const { ime, prezime, pozicija, godina_radnog_staza } = req.body;

  if (typeof ime !== 'string') {
    return res.status(404).json({ message: 'Ime treba biti string' });
  }

  if (typeof prezime !== 'string') {
    return res.status(404).json({ message: 'Prezime treba biti string' });
  }

  if (typeof pozicija !== 'string') {
    return res.status(404).json({ message: 'Pozicija treba biti string' });
  }

  if (typeof godina_radnog_staza !== 'string') {
    return res.status(404).json({ message: 'Godina treba biti string' });
  }

  if (!ime || !prezime || !pozicija || !godina_radnog_staza) {
    return res.status(400).send('Nedostaju podaci.');
  }
  try {
    const data = await fs.readFile('./data/zaposlenici.json');
    const zaposlenici = JSON.parse(data);
    const novi_zaposlenik = {
      id: zaposlenici.length ? zaposlenici[zaposlenici.length - 1].id + 1 : 1,
      ime,
      prezime,
      pozicija,
      godina_radnog_staza,
    };
    zaposlenici.push(novi_zaposlenik);
    await fs.writeFile(
      './data/zaposlenici.json',
      JSON.stringify(zaposlenici, null, 2)
    );
    console.log('Podaci su uspješno spremljeni!');
    res.status(200).json(novi_zaposlenik);
  } catch (err) {
    console.log('greška pri pohranjivanju datoteka: ', err);
    res.status(500).send('greška pri pohranjivanju datoteka');
  }
});

app.get('/zaposlenici/:id', async (res, req) => {
  let id_dohvati = req.params.id;

  try {
    const data = await fs.readFile('./data/zaposlenici.json');
    const zaposlenici = JSON.parse(data);
    const filtriraj = zaposlenici.find(
      (zaposlenik) => zaposlenik.id === id_dohvati
    );

    if (!filtriraj) {
      return res.status(404).json({ message: 'Zaposlenik nije pronađen...' });
    }

    if (isNaN(id_dohvati)) {
      return res.status(404).json({ message: 'ID nije broj.' });
    }
    return res.status(200).json(filtriraj);
  } catch (err) {
    console.log('greška pri učitavanju datoteka: ', err);
    res.status(500).send('greška pri učitavanju datoteka');
  }
});

app.listen(PORT, (err) => {
  if (err) {
    console.log('Server ne radi', err);
  } else {
    console.log(`Server radi na http://localhost:${PORT}`);
  }
});
