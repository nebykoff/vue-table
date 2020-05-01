<template>
  <div class="list">
    <button @click="showList = !showList">
      <slot v-bind:selectedColumns="selectedColumns"></slot>
    </button>
    <div class="drop-down" v-show="showList">
      <ul>
        <li v-for="col in columns" :key="col.id">
          <Checkbox :name="col.name">{{ col.title }}</Checkbox>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Checkbox from '@/components/Common/Checkbox/Checkbox.vue';

export default {
  name: 'DropDownList',
  components: {
    Checkbox,
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showList: false,
    };
  },
  computed: {
    selectedColumns() {
      return this.columns.length;
    },
  },
};
</script>

<style lang="scss" scoped>
  .list {
    position: relative;

    .drop-down {
      position: absolute;
      border: 1px solid magenta;
    }
  }
</style>
