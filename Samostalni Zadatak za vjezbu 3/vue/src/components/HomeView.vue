<template>
  <div>
    <div class="header-container">
      <h1 class="text-3xl font-bold">Početna stranica</h1>
      <router-link to="/proizvodi">Pregledaj artikle</router-link>

      <div class="cart-info">
        Ukupno proizvoda u košarici: {{ ukupnoProizvoda }}
      </div>
    </div>

    <div
      v-if="narudzbaUspjesna"
      class="notification success my-4 bg-green-500 text-white rounded-md"
    >
      Uspješno je poslana narudžba!
    </div>

    <button
      @click="posalji"
      class="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      :disabled="broj_proizvoda === 0"
    >
      Naruči proizvode
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const uspjesnaNarudzba = ref(false);
const ukupnoProizvoda = ref(0);
const izracunaj = () => {
  const kosara = JSON.parse(localStorage.getItem('kosara')) || [];
  return kosara.reduce((ukupno, proizvod) => total + proizvod.kolicina, 0);
};

const posalji = async () => {
  const kosara = JSON.parse(localStorage.getItem('kosara')) || [];

  if (kosara.length > 0) {
    const podatke = { narucenihProizvoda: kosara };

    try {
      const response = await axios.post(
        'http://localhost:3000/narudzbe',
        podatke,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Narudžba poslana:', podatke);
      localStorage.removeItem('kosara');
      ukupnoProizvoda.value = 0;
      uspjesnaNarudzba.value = true;

      setTimeout(() => {
        uspjesnaNarudzba.value = false;
      }, 3000);
    } catch (err) {
      console.error('Došlo je do greške prilikom naručivanja:', err);
    }
  } else {
    console.log('Košara je prazna.');
  }
};

onMounted(() => {
  ukupnoProizvoda.value = izracunaj();
  console.log('Proizvodi učitani:', ukupnoProizvoda.value);
});
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.alert {
  animation: fadeIn 0.5s ease-in-out;
}

.cart-info {
  font-size: 1rem;
  font-weight: 500;
}

.notification {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 0.5rem;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
