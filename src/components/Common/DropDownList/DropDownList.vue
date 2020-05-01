<template>
  <div class="list">
    <button @click="showList = !showList">
      <slot v-bind:selectedColumns="selectedColumns"></slot>
    </button>
    <div class="drop-down" v-show="showList">
      <ul>
        <li v-for="col in columns" :key="col.id">
          <Checkbox :name="col.name" :checked="col.show ? 'checked' : ''"
                    @change="col.show = !col.show">
            {{ col.title }}
          </Checkbox>
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
      let visibleCols = 0;
      this.columns.forEach((col) => {
        if (col.show) {
          visibleCols += 1;
        }
      });
      return visibleCols;
    },
  },
};
</script>

<style lang="scss" scoped>
  .list {
    position: relative;

    ul {
      padding: 0;
      margin: 0;

      li {
        display: block;
      }
    }

    .drop-down {
      padding: 20px 17px;
      position: absolute;
      background: #FFFFFF;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
      border-radius: 4px;
      max-height: 243px;
      overflow-y: auto;
    }
  }
</style>
