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
};
</script>
