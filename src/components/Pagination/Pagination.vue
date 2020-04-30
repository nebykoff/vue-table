<template>
    <div class="pag">
      <button @click="$emit('prev')">prev</button>
      {{ interval }} of {{ total }}
      <button @click="$emit('next')">next</button>
    </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    interval: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
  .pag {
    display: flex;
  }
</style>
