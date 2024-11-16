<template>
  <div v-if="artikl">
    <nav>
      <a href="#" class="text-blue-600 font-semibold hover:underline">{{
        artikl.naziv
      }}</a>
    </nav>
    <h1 class="text-3xl font-extrabold text-gray-800 mt-2">
      {{ artikl.naziv }}
    </h1>
    <div class="mt-3">
      <p class="text-4xl text-green-600">{{ artikl.cijena }}€</p>
    </div>

    <div class="flex space-x-2 mt-4">
      <button
        v-for="velicina in artikl.velicine"
        :key="velicina"
        @click="odabir_velicina = velicina"
        :class="[
          'py-2 px-5 rounded-lg transition-all duration-200',
          {
            'bg-blue-500 text-white': odabir_velicina === velicina,
            'bg-gray-200 text-gray-700': odabir_velicina !== velicina,
          },
        ]"
      >
        {{ velicina }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div class="hidden md:block">
        <img :src="artikl.slike[0]" alt="" class="rounded-lg shadow-lg" />
      </div>
      <div class="grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-2">
        <img :src="artikl.slike[0]" alt="" class="rounded-lg shadow-lg" />
        <img :src="artikl.slike[1]" alt="" class="rounded-lg shadow-lg" />
      </div>
      <div>
        <img :src="artikl.slike[1]" alt="" class="rounded-lg shadow-lg" />
      </div>
    </div>

    <div class="mt-4">
      <p class="text-lg text-gray-800">Opis: {{ artikl.opis }}</p>
    </div>

    <div class="mt-4">
      <span class="font-medium">Dostupne boje:</span>
      <div class="flex space-x-2 mt-2">
        <button
          v-for="boje in artikl.dostupna_boja"
          :key="boje"
          @click="odabrana_boja = boje"
          :class="[
            'py-2 px-5 rounded-lg transition-all duration-200',
            {
              'bg-blue-500 text-white': odabrana_boja === boja,
              'bg-gray-200 text-gray-700': odabrana_boja !== boja,
            },
          ]"
        >
          {{ boje }}
        </button>
      </div>
    </div>

    <div class="mt-4">
      <p class="text-lg text-gray-800">
        Karakteristike: {{ proizvod.karakteristike }}
      </p>
    </div>

    <div class="mt-4">
      <label for="quantity" class="text-sm font-semibold text-gray-700"
        >Količina:</label
      >
      <input
        type="number"
        id="quantity"
        v-model="kolicina"
        min="1"
        class="mt-2 w-20 p-2 border border-gray-300 rounded-md"
      />
    </div>

    <button
      type="submit"
      @click="dodaj"
      class="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Dodaj u košaru
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const proizvod = ref(null);
const route = useRoute();
const router = useRouter();
const odabir_velicina = ref(null);
const odabrana_boja = ref(null);
const naruceno = ref(1);

const dodaj = async () => {
  if (odabir_velicina.value && odabrana_boja.value && kolicina.value > 0) {
    const podatke = {
      id: artikl.value.id,
      velicina: odabir_velicina.value,
      boja: odabrana_boja.value,
      narucen_artikl: naruceno.value,
    };
    let kosarica = JSON.parse(localStorage.getItem('kosarica')) || [];
    kosarica.push(podatke);
    localStorage.setItem('kosarica', JSON.stringify(kosarica));
    router.push('/');
  } else {
    console.log('Odabrate količinu, veličinu i boju.');
  }
};

onMounted(async () => {
  const id = route.params.id;
  try {
    const odgovor = await axios.get(`http://localhost:3000/proizvodi/${id}`);
    artikl.value = odgovor.data;
  } catch (err) {
    console.error('Greška u dohvaćanju podataka: ', err);
  }
});
</script>
