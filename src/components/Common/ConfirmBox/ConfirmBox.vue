<template>
  <div class="confirm" :style="`top: ${top}px; left: ${left}px`" ref="confirm">
    <div class="confirm__text">
      <slot></slot>
    </div>
    <Button class="button--light" @click="params.show = false">Cancel</Button>
    <Button @click="onConfirm">Confirm</Button>
  </div>
</template>

<script>
import Button from '@/components/Common/Button/Button.vue';

export default {
  name: 'ConfirmBox',
  props: ['params'],
  components: {
    Button,
  },
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

<style lang="scss" scoped>
  .confirm {
    padding: 16px;
    position: absolute;
    display: inline-block;
    background-color: #FFFFFF;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
    border-radius: 4px;
    text-align: center;

    &__text {
      margin-bottom: 8px;
    }

    .button {
      margin: 0 8px;
      border-radius: 4px;
    }
  }
</style>
