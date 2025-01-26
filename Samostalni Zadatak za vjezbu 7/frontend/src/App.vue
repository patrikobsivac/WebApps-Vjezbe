<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Task from './components/Task.vue';

const tasks = ref([]);
const editing = ref(false);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/tasks');
    tasks.value = response.data;
    console.log('Dohvaćeno:', response.data);
  } catch (error) {
    console.error('Error tijekom dohvaćanja:', error);
  }
});

function addZadatak(task) {
  tasks.value.unshift(task);
  editing.value = false;
  fetchTasks();
}

async function fetchTasks() {
  try {
    const response = await axios.get('http://localhost:3000/tasks');
    tasks.value = response.data;
    console.log('zadaci osvježeno:', response.data);
  } catch (err) {
    console.error('Error tijekom dohvaćanja:', err);
  }
}

async function oznacikaoDovrseno(taskId) {
  try {
    await axios.patch(`http://localhost:3000/tasks/${taskId}`);
    const task = tasks.value.find((task) => task._id === taskId);
    if (task) {
      task.gotov = true;
    }
  } catch (err) {
    console.error('Error tijekom označavanja:', err);
    alert('Nisam ga označio.');
  }
}

async function deleteTask(taskId) {
  const potvrdeno = window.confirm('Are you sure about that?');

  if (potvrdeno) {
    try {
      await axios.delete(`http://localhost:3000/tasks/${taskId}`);
      tasks.value = tasks.value.filter((task) => task._id !== taskId);
    } catch (err) {
      console.error('Error tijekom brisanja:', err);
      alert('Nisam ga obrisao.');
    }
  }
}
</script>

<template>
  <div class="container mx-auto py-6 px-4">
    <header
      class="flex justify-between items-center bg-gray-800 text-white py-4 px-6 rounded-lg mb-6"
    >
      <h1 class="text-3xl font-semibold">Upravljanje Zadaćama</h1>
      <button
        class="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-5 rounded-lg transition-all"
        @click="editing = true"
      >
        Nova Zadaća
      </button>
    </header>

    <Task v-if="editing" @saveTask="addZadatak" @cancel="editing = false" />

    <section class="bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-700 mb-5">Popis Zadaća</h2>
      <ul class="divide-y divide-gray-300">
        <li
          v-for="(task, index) in tasks"
          :key="task._id"
          :class="{ 'bg-teal-100': task.gotov }"
          class="flex justify-between items-center py-4 px-4 rounded-lg transition-all"
        >
          <div>
            <h3 class="text-lg font-semibold text-gray-800">
              {{ task.naslov }}
            </h3>
            <p class="text-sm text-gray-600 mt-1">{{ task.opis }}</p>
            <div
              v-if="task.tags && task.tags.length"
              class="mt-2 flex flex-wrap"
            >
              <span
                v-for="(tag, i) in task.tags"
                :key="i"
                class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs mr-2 mb-2"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <div class="flex space-x-3">
            <button
              v-if="!task.gotov"
              class="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded-lg transition-all"
              @click="oznacikaoDovrseno(task._id)"
            >
              Oznaci
            </button>
            <button
              class="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-lg transition-all"
              @click="deleteTask(task._id)"
            >
              Obriši
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
