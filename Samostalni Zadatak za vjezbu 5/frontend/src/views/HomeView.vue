<template>
  <div id="app">
    <div>
      <label for="filtrirajNaziv">Ime:</label>
      <input
        v-model="filter.naziv"
        type="text"
        id="filtrirajNaziv"
        placeholder="Pretraži po nazivu"
      />

      <label for="filtrirajSastojak">Sastojci:</label>
      <input
        v-model="filter.sastojak"
        type="text"
        id="filtrirajSastojak"
        placeholder="Pretraži po sastojku"
      />

      <label for="filtrirajCijenaMin">Filtriraj po cijeni (min):</label>
      <input
        v-model.number="filter.minCijena"
        type="number"
        id="filtrirajCijenaMin"
        placeholder="Min"
      />

      <label for="filtrirajCijenaMaks">Maksimalna cijena:</label>
      <input
        v-model.number="filter.maksCijena"
        type="number"
        id="filtrirajCijenaMaks"
        placeholder="Maks"
      />
    </div>

    <div class="grid">
      <div v-if="filteredPizze.length > 0">
        <div v-for="pizza in filteredPizze" :key="pizza._id" class="card">
          <strong>{{ pizza.naziv }}</strong>
          <p>{{ pizza.cijena }} EUR</p>
          <button @click="addNarudzba(pizza)">Naruči</button>
        </div>
      </div>
      <p v-else>Nema dostupnih pizza</p>
    </div>

    <h2>Narudžba</h2>
    <ul v-if="narudzba.length > 0">
      <li v-for="(index, item) in narudzba" :key="index">
        {{ item.naziv }} ({{ item.cijena }} EUR) x
        <input
          v-model.number="item.kolicina"
          type="number"
          min="1"
          @change="updateCijena"
        />
        = {{ item.kolicina * item.cijena }} EUR
        <button @click="ukloni(index)">Ukloni</button>
      </li>
      <p>
        <strong>Ukupna cijena: {{ ukupnaCijena }} EUR</strong>
      </p>
    </ul>
    <p v-else>Vaša košarica je prazna.</p>
    <h2>Unesi Podaci Narudžbe</h2>
    <form @submit.prevent="sendNarudzbu">
      <div>
        <label for="imeKupca">Ime Kupca:</label>
        <input v-model="kupac.ime" type="text" id="imeKupca" required />
      </div>
      <div>
        <label for="prezimeKupca">Prezime Kupca:</label>
        <input v-model="kupac.prezime" type="text" id="prezimeKupca" required />
      </div>
      <div>
        <label for="adresa">Adresa:</label>
        <input v-model="kupac.adresa" type="text" id="adresa" required />
      </div>
      <div>
        <label for="broj_telefona">Broj Telefona:</label>
        <input
          v-model="kupac.broj_telefona"
          type="text"
          id="broj_telefona"
          required
        />
      </div>
      <button type="submit" :disabled="narudzba.length === 0">Potvrdi</button>
    </form>
    <div v-if="errorPoruka" style="color: red; margin-top: 10px">
      {{ errorPoruka }}
    </div>
    <div v-if="successPoruka" style="color: green; margin-top: 10px">
      {{ successPoruka }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      pizze: [],
      filter: {
        naziv: '',
        sastojak: '',
        minCijena: 0,
        maksCijena: Infinity,
      },
      newPizza: {
        naziv: '',
        cijena: null,
        sastojci: [],
      },
      newSastojak: '',
      narudzba: [],
      ukupnaCijena: 0,
      errorPoruka: '',
      successPoruka: '',
      kupac: {
        ime: '',
        prezime: '',
        adresa: '',
        broj_telefona: '',
      },
    };
  },
  computed: {
    filtrirajPizze() {
      return this.pizze.filter((pizza) => {
        const matchesNaziv = pizza.naziv
          .toLowerCase()
          .includes(this.filter.naziv.toLowerCase());
        const matchesSastojak =
          this.filter.sastojak === '' ||
          (pizza.sastojci &&
            Array.isArray(pizza.sastojci) &&
            pizza.sastojci.some((sastojak) =>
              sastojak
                .toLowerCase()
                .includes(this.filter.sastojak.toLowerCase())
            ));
        const matchesCijena =
          pizza.cijena >= this.filter.minCijena &&
          pizza.cijena <= this.filter.maksCijena;
        return matchesNaziv && matchesSastojak && matchesCijena;
      });
    },
  },
  methods: {
    async fetchPizze() {
      try {
        const response = await axios.get('http://localhost:3000/pizze');
        this.pizze = response.data;
      } catch (err) {
        console.error('Pogreška pri prihvaćanju pizze:', err);
        alert('Ne mogu uzeti pizze. Provjerite poslužitelj!');
      }
    },
    async addPizzu() {
      console.log('Podaci prije provjere:', this.newPizza);
      if (
        !this.newPizza.naziv ||
        this.newPizza.cijena <= 0 ||
        !this.newPizza.sastojciText ||
        this.newPizza.sastojciText.trim() === ''
      ) {
        this.errorPoruka = 'Morate unijeti naziv, cijenu i sastojke!';
        this.successPoruka = 'Success!';
        console.log('Greška: Nedostaju obavezni podaci.');
        return;
      }
      const sastojci = this.newPizza.sastojciText
        .split(',')
        .map((sastojak) => sastojak.trim())
        .filter((sastojak) => sastojak !== '');
      if (sastojci.length === 0) {
        this.errorPoruka = 'Morate unijeti barem jedan sastojak!';
        this.successPoruka = 'Success!';
        return;
      }
      this.newPizza.sastojci = sastojci;
      console.log('Podaci se šalju u backend:', {
        naziv: this.newPizza.naziv,
        cijena: this.newPizza.cijena,
        sastojci: this.newPizza.sastojci,
      });
      try {
        const response = await axios.post('http://localhost:3000/pizze', {
          naziv: this.newPizza.naziv,
          cijena: this.newPizza.cijena,
          sastojci: this.newPizza.sastojci,
        });
        console.log('Odgovor sa backenda:', response.data);

        this.successPoruka = 'Pizza uspješno dodana!';
        this.errorPoruka = 'Pizza nije uspješno dodana';
        this.pizze.push(response.data);
        this.novaPizza = { naziv: '', cijena: null, sastojciText: '' };
      } catch (error) {
        if (error.response) {
          console.log('Greška prema odgovoru:', error.response.data);
          this.errorPoruka =
            error.response.data.error ||
            'Došlo je do pogreške prilikom dodavanja pizze!';
        } else {
          console.log('Greška u samom zahtjevu:', error.message);
          this.errorPoruka = 'Došlo je do pogreške prilikom dodavanja pizze!';
        }
        this.successPoruka = '';
      }
    },
    addNarudzbu(pizza) {
      if (!pizza || !pizza.naziv) {
        this.errorMessage = 'Ova odabrana pizza ne postoji!';
        this.successMessage = '';
        return;
      }
      const item = this.narudzba.find((p) => p.naziv === pizza.naziv);
      if (item) {
        item.kolicina += 1;
      } else {
        this.narudzba.push({ ...pizza, kolicina: 1 });
      }
      this.updateUkupnaCijena();
    },
    deleteNarudzbe(index) {
      this.narudzba.splice(index, 1);
      this.updateUkupnaCijena();
    },
    updateUkupnaCijena() {
      this.ukupnaCijena = this.narudzba.reduce(
        (total, item) => total + item.cijena * item.kolicina,
        0
      );
    },
    async sendNarudzbu() {
      if (!this.kupac.ime || !this.kupac.adresa || !this.kupac.broj_telefona) {
        this.errorPoruka = 'Sva polja za kupce mora biti popunjena!';
        return;
      }
      const narudzbaData = {
        narucene_pizze: this.narudzba,
        kupac: this.kupac,
      };
      try {
        const response = await axios.post(
          'http://localhost:3000/narudzbe',
          narudzbaData
        );
        this.successPoruka = 'Narudžba je uspješno poslana!';
        this.errorPoruka = 'Narudžba nije uspješno poslana!';
        this.narudzba = [];
        this.updateUkupnaCijena();
      } catch (err) {
        this.errorPoruka = 'Greška pri slanju narudžbe.';
        this.successPoruka = '';
      }
    },
  },
  watch: {
    successPoruka() {
      if (this.successPoruka) {
        setTimeout(() => {
          this.successPoruka = '';
        }, 3000);
      }
    },
    errorPoruka() {
      if (this.errorPoruka) {
        setTimeout(() => {
          this.errorPoruka = '';
        }, 3000);
      }
    },
  },
  created() {
    this.fetchPizze();
  },
};
</script>

<style>
body {
  font-family: 'Verdana', sans-serif;
  background-color: #e8eaf6;
  margin: 0;
  padding: 0;
  color: #424242;
}

#app {
  padding: 25px;
  text-align: left;
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-width: 1200px;
  margin: 20px auto;
}

h1,
h2 {
  color: #1e88e5;
  font-weight: 600;
}

ul {
  list-style: circle inside;
  padding: 10px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 5px;
}

li {
  background: #ffffff;
  margin: 15px 0;
  padding: 15px;
  max-width: 320px;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

li:hover {
  transform: translateY(-3px);
}

form {
  margin: 25px auto;
  max-width: 350px;
  background: #fafafa;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #cfd8dc;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1565c0;
}

input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #b0bec5;
  border-radius: 5px;
  background: #f9f9f9;
}

input:focus {
  border-color: #1e88e5;
  outline: none;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  margin-top: 30px;
}

.card {
  background: #fefefe;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: scale(1.07);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

button {
  padding: 12px 18px;
  background: #4caf50;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #388e3c;
}
</style>
