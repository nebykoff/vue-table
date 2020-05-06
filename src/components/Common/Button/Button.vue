<template>
  <button class="button" @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
};
</script>

<style lang="scss">
  .button {
    cursor: pointer;
    outline: none;
    border: none;
    background-color: $clr_accent;
    color: #FFFFFF;
    border-radius: 2px;
    padding: 8px 16px;

    &:disabled {
      border: 1px solid #C6CBD4;
      background-color: #FFFFFF;
      color: #5B5E77;
      opacity: 0.3;
    }

    &--del {
      display: flex;
      color: #5B5E77;
      background-color: transparent;
      padding: 0;

      img {
        margin-right: 5px;
      }
    }

    &--light {
      border: 1px solid #C6CBD4;
      background-color: #FFFFFF;
      color: #5B5E77;
    }
  }
</style>
