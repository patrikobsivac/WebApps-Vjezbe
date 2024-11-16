import { createRouter, createWebHistory } from 'vue-router';
import ProizvodView from './views/ProizvodView.vue';
import ProductsView from './components/ProductsView.vue';
import HomeView from './components/HomeView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/proizvodi/:id', component: ProductsView, name: 'ProductView' },
  { path: '/proizvodi', component: ProizvodView, name: 'ProductsView' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
