<template>
  <div>
    <h1>Pizzeria App</h1>
    <button @click="goBack">POČETAK</button>
    <button @click="addPizza">DODAJ PIZZU</button>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    goBack() {
      this.$router.go('/');
    },
    addPizza() {
      this.$router.push('/dodaj-pizzu');
    },
  },
};
</script>

<style scoped></style>
