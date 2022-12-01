<template>
  <div class="success-forgot">
    <simple-svg :filepath="'/static/img/success-forgot.svg'" />
  </div>
</template>

<script>
export default {
  name: 'ForgotSuccess',
};
</script>

<style lang="stylus">
.success-forgot
  height 100%
  display flex
  justify-content center
  align-items center

  .simple-svg-wrapper
    width 120px
</style>
