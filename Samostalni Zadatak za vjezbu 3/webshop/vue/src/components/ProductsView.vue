<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
    <div
      v-for="artikl in artikli"
      :key="artikl.id"
      class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <router-link
        :to="{ name: 'ProductView', params: { id: artikl.id } }"
        class="font-medium text-gray-500 hover:text-gray-600"
      >
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {{ artikli.naziv }}
        </h1>
        <div class="mt-4 lg:row-span-3 lg:mt-0">
          <h2 class="sr-only">Informacije o proizvodu</h2>
          <p class="text-3xl tracking-tight text-gray-900">
            {{ artikli.cijena }}€
          </p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const artikli = ref([]);

onMounted(async () => {
  try {
    const odgovor = await axios.get('http://localhost:3000/proizvodi');
    artikli.value = odgovor.data;
  } catch (err) {
    console.error('Greška u dohvaćanju podataka: ', err);
  }
});
</script>
