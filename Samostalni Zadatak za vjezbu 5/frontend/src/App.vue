<template>
  <div>
    <h1>Pizzeria App</h1>
    <button @click="goBack">Home</button>
    <button @click="addPizza">Dodaj pizzu</button>
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
      this.$router.push('/addPizza');
    },
  },
};
</script>

<style scoped></style>
