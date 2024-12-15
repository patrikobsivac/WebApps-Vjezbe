<template>
  <div>
    <h2>Dodaj novu pizzu</h2>
    <form @submit.prevent="dodajPizzu" enctype="multipart/form-data">
      <div>
        <label for="naziv">Naziv:</label>
        <input v-model="newPizza.naziv" type="text" id="naziv" required />
      </div>
      <div>
        <label for="cijena">Cijena:</label>
        <input v-model="newPizza.cijena" type="number" id="cijena" required />
      </div>
      <div>
        <label for="sastojci">Sastojci:</label>
        <input
          v-model="newPizza.sastojciText"
          type="text"
          id="sastojci"
          placeholder="Unesite sastojke"
        />
      </div>
      <div></div>
      <button type="submit">Dodaj pizzu</button>
    </form>
    <div v-if="errorPoruka" class="error-message">
      {{ errorPoruka }}
    </div>
    <div v-if="successPoruka" class="success-message">
      {{ successPoruka }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'PizzaView',
  data() {
    return {
      newPizza: {
        naziv: '',
        cijena: null,
        sastojciText: '',
      },
      errorPoruka: '',
      successPoruka: '',
    };
  },
  methods: {
    async Pizza() {
      if (
        !this.newPizza.naziv ||
        this.newPizza.cijena <= 0 ||
        !this.newPizza.sastojciText ||
        this.newPizza.sastojciText.trim() === ''
      ) {
        this.errorPoruka = 'Morate unijeti naziv, cijenu i sastojke!';
        this.successPoruka = '';
        return;
      }
      const sastojci = this.newPizza.sastojciText
        .split(',')
        .map((sastojak) => sastojak.trim())
        .filter((sastojak) => sastojak !== '');
      if (sastojci.length === 0) {
        this.errorPoruka = 'Morate unijeti barem jedan sastojak!';
        this.successPoruka = '';
        return;
      }
      const podaci = {
        naziv: this.novaPizza.naziv,
        cijena: this.novaPizza.cijena,
        sastojci: sastojci,
      };
      console.log('Podaci za slanje:', podaci);
      try {
        const response = await axios.post(
          'http://localhost:3000/pizze',
          podaci,
          { headers: { 'Content-Type': 'application/json' } }
        );
        this.successPoruka = 'Pizza uspješno dodana!';
        this.errorPoruka = '';
        this.newPizza = { naziv: '', cijena: null, sastojciText: '' };
      } catch (error) {
        this.errorPoruka = 'Došlo je do greške prilikom dodavanja pizze!';
        this.successPoruka = '';
        console.error('Greška:', error.response?.data || error.message);
      }
    },
  },
};
</script>

<style scoped>
form {
  margin: 20px auto;
  max-width: 400px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

button {
  padding: 12px 20px;
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

button:hover {
  background: #218838;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.success-message {
  color: green;
  margin-top: 10px;
}
</style>
