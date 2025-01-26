<template>
  <span :class="tagStyles[tag]" class="tag">{{ tag }}</span>
</template>

<script setup>
defineProps({
  tag: String,
});

const tagStyles = {
  hitno: 'bg-red-600 text-white font-bold',
  pomalo: 'bg-green-600 text-white font-light',
  faks: 'bg-blue-600 text-white font-semibold',
};
</script>

<style scoped>
.tag {
  padding: 0.6rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0.25rem 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
