<template>
  <div class="success-shift-email">
    <simple-svg :filepath="'/static/img/success-forgot.svg'" />
  </div>
</template>

<script>
export default {
  name: 'ShiftEmailSuccess',
};
</script>

<style lang="stylus">
.success-shift-email
  height 100%
  display flex
  justify-content center
  align-items center

  .simple-svg-wrapper
    width 120px
</style>
