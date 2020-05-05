<template>
  <label class="checkbox">
    <span>
      <slot></slot>
    </span>
    <input type="checkbox" v-bind="$attrs" @change="$emit('change', $event)"/>
    <span class="checkmark"></span>
  </label>
</template>

<script>
export default {
  name: 'Checkbox',
  inheritAttrs: false,
};
</script>

<style lang="scss">
/* Customize the label (the custom-checkbox) */
.checkbox {
  display: inline-block;
  position: relative;
  user-select: none;
  cursor: pointer;

  span{
    display: block;
    line-height: 24px;
    padding-left: 13px;
    white-space: nowrap;
  }

  /* Hide the browser's default checkbox */
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmark{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    height: 14px;
    width: 14px;
    /*border-radius: 8px;*/
    border: solid 1px $clr_accent;
    box-sizing: border-box;

  /* Create the custom-checkbox__checkmark/indicator (hidden when not checked) */
  &:after {
     content: "";
     position: absolute;
     display: none;
     left: 4px;
     top: 5px;
     width: 7px;
     height: 3px;
     border: solid white;
     border-width: 1px 1px 0 0;
     transform: rotate(135deg);
     box-sizing: border-box;
   }
  }

  /* When the checkbox is checked, add a blue background */
  input:checked ~ .checkmark {
    background-color: $clr_accent;
    border: none;
  }

  /* Show the custom-checkbox__checkmark when checked */
  input:checked ~ .checkmark:after {
    display: block;
  }
}
</style>
