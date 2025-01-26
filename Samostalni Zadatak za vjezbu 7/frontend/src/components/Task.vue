<template>
  <div class="bg-gray-50 p-6 shadow-lg rounded-lg mb-8">
    <div class="mb-5">
      <label class="block text-gray-800 font-semibold mb-2" for="naslov">
        Unesite Naslov:
      </label>
      <input
        id="naslov"
        type="text"
        v-model="naslovZadatka"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
        placeholder="Primjer: 'Kupiti namirnice'"
      />
    </div>
    <div class="mb-5">
      <label class="block text-gray-800 font-semibold mb-2" for="opis">
        Unesite Opis:
      </label>
      <textarea
        id="opis"
        v-model="opisZadatka"
        rows="4"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
        placeholder="Detaljniji opis zadatka..."
      ></textarea>
    </div>
    <div class="mb-5">
      <label class="block text-gray-800 font-semibold mb-2" for="tagovi">
        Dodajte Tagove:
      </label>
      <input
        id="tagovi"
        type="text"
        v-model="tagoviZadatka"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
        placeholder="Primjer: 'hitno, škola, kućni poslovi'"
      />
    </div>

    <div v-if="prikazTagova.length" class="mb-5 flex flex-wrap gap-3">
      <TaskTag
        v-for="(tagObj, index) in prikazTagova"
        :key="index"
        :tag="tagObj.tag"
        :className="tagObj.colorClass"
      />
    </div>
    <div class="flex justify-end space-x-3">
      <button
        class="bg-indigo-500 text-white px-5 py-2 rounded-lg hover:bg-indigo-600 transition-all"
        @click="saveZadatak"
      >
        Spremi
      </button>
      <button
        class="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition-all"
        @click="$emit('cancel')"
      >
        Odustani
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import TaskTag from './TaskTag.vue';

defineProps({
  id: String,
  naslov: String,
  opis: String,
  gotovo: Boolean,
  tags: Array,
});

const emit = defineEmits(['saveTask', 'cancel']);
const naslovZadatka = ref('');
const opisZadatka = ref('');
const tagoviZadatka = ref('');
const prikazTagova = computed(() => {
  return tagoviZadatka.value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag)
    .map((tag) => {
      return {
        tag: tag,
        colorClass: getTagColor(tag),
      };
    });
});

function getTagColor(tag) {
  switch (tag.toLowerCase()) {
    case 'hitno':
      return 'bg-red-600 text-white font-bold';
    case 'pomalo':
      return 'bg-green-600 text-white font-light';
    case 'faks':
      return 'bg-blue-600 text-white font-semibold';
    default:
      return 'bg-gray-300 text-gray-800';
  }
}
async function saveZadatak() {
  if (naslovZadatka.value.trim() && opisZadatka.value.trim()) {
    const tagovi = prikazTagova.value;
    const newZadatak = {
      naslov: naslovZadatka.value,
      opis: opisZadatka.value,
      tags: tagovi,
    };

    try {
      const response = await axios.post(
        'http://localhost:3000/tasks',
        newZadatak
      );
      console.log('Zadatak uspješno spremljen:', response.data);
      emit('saveTask', newZadatak);
      naslovZadatka.value = '';
      opisZadatka.value = '';
      tagoviZadatka.value = '';
    } catch (err) {
      console.error(
        'Greška tijekom spremanja zadatka:',
        err.response?.data || err.message
      );
    }
  } else {
    console.warn('Naslov i opis su obavezni!');
  }
}
</script>
