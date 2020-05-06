<template>
  <div class="list">
    <Button class="button--light button--list" @click="showList = !showList">
      <slot v-bind:selectedColumns="selectedColumns"></slot>
    </Button>
    <div class="drop-down" v-show="showList">
      <ul>
        <li>
          <Checkbox :checked="isAllColsSelected ? 'checked' : ''"
                    @change="changeAllColsVisibility($event.target.checked)">
            <strong>Select All</strong>
          </Checkbox>
        </li>
        <li v-for="col in columns" :key="col.id">
          <Checkbox :name="col.name" :checked="col.show ? 'checked' : ''"
                    @change="$emit('colShowChanged', col)">
            {{ col.title }}
          </Checkbox>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Checkbox from '@/components/Common/Checkbox/Checkbox.vue';
import Button from '@/components/Common/Button/Button.vue';

export default {
  name: 'DropDownList',
  components: {
    Checkbox,
    Button,
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
  methods: {
    changeAllColsVisibility(state) {
      this.columns.forEach((col) => {
        // eslint-disable-next-line
        col.show = state;
      });
      this.$emit('onSelectAll');
    },
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
    isAllColsSelected() {
      return this.columns.length === this.selectedColumns;
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
      margin-top: 15px;
      background: #FFFFFF;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
      border-radius: 4px;
      max-height: 243px;
      overflow-y: auto;
    }

    .checkbox {
      padding-left: 14px;
      margin-bottom: 17px;
    }
  }
</style>
