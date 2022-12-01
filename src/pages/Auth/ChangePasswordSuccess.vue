<template>
  <div class="change-password-success">
    <simple-svg :filepath="'/static/img/success-change-password.svg'" />
  </div>
</template>

<script>
export default {
  name: 'ChangePasswordSuccess',
};
</script>

<style lang="stylus">
.change-password-success
  height 100%
  display flex
  justify-content center
  align-items center

  .simple-svg-wrapper
    width 90px
</style>
