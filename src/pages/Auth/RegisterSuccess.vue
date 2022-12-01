<template>
  <div class="success-register">
    <simple-svg :filepath="'/static/img/success-register.svg'" />
  </div>
</template>

<script>
export default {
  name: 'RegisterSuccess',
};
</script>

<style lang="stylus">
.success-register
  height 100%
  display flex
  justify-content center
  align-items center

  .simple-svg-wrapper
    width 130px
</style>
