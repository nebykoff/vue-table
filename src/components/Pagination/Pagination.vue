<template>
    <div class="pag">
      <button class="pag__prev" :disabled="first" @click="$emit('prev')"></button>
      <div class="pag__text">
        <strong>{{ interval}}</strong> of <strong>{{ total }}</strong>
      </div>
      <button class="pag__next" :disabled="last" @click="$emit('next')"></button>
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
    first: {
      type: Boolean,
      required: true,
    },
    last: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
  .pag {
    white-space: pre-wrap;
    display: flex;
    align-items: center;

    &__text {
      margin: 0 8px;
    }

    button {
      cursor: pointer;
      outline: none;
      border: 1px solid $clr_border;
      border-radius: 2px;
      height: 32px;
      width: 32px;
      background: url("~@/assets/img/galka.svg") center center;

      &:disabled {
        opacity: 0.5;
      }
    }

    &__prev {
      transform: rotate(90deg);
    }

    &__next {
      transform: rotate(270deg);
    }
  }
</style>
