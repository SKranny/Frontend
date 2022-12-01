<template>
  <div class="error">
    <span class="error__title">Ошибка: </span>
    <span class="error__message">
      {{ message }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="stylus">
.error
  padding 50px
  font-size 20px
  &__title
    font-weight bold
  &__message
    color #FF5573
</style>
