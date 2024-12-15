import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PizzaView from '../views/PizzaView.vue';
const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/addPizza',
    name: 'PizzaView',
    component: PizzaView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
