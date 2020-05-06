<template>
  <div id="app">
    <TableUI/>
  </div>
</template>

<script>
import TableUI from './components/TableUI/TableUI.vue';

export default {
  name: 'App',
  components: {
    TableUI,
  },
};
</script>

<style lang="scss">
#app {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 14px;
  line-height: 24px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 32px 16px;
  max-width: 1140px;
  margin: 0 auto;
}
</style>
