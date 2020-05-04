<template>
  <div class="confirm" :style="`top: ${top}px; left: ${left}px`" ref="confirm">
    <div class="confirm__text">
      <slot></slot>
    </div>
    <button @click="params.show = false">Cancel</button>
    <button @click="onConfirm">Confirm</button>
  </div>
</template>

<script>
export default {
  name: 'ConfirmBox',
  props: ['params'],
  methods: {
    onConfirm() {
      this.params.show = false;
      this.$emit('onDeleteConfirmed');
    },
  },
  computed: {
    top() {
      if (this.params.show) {
        return this.params.parentRect.top + window.pageYOffset
           + this.params.parentRect.height;
      }
      return 0;
    },
    left() {
      if (this.params.show) {
        const confirmWidth = this.$refs.confirm.getBoundingClientRect().width;
        // Центровка относительно родителя
        return (this.params.parentRect.left + window.pageXOffset
        - confirmWidth / 2 + this.params.parentRect.width / 2
        );
      }
      return 0;
    },
  },
};
</script>

<style scoped>
  .confirm {
    position: absolute;
    border: 1px solid magenta;
    display: inline-block;
    background-color: #FFFFFF;
  }
</style>
