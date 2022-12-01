<template>
  <div class="shift-password">
    <form class="shift-password__form" @submit.prevent="submitHandler">
      <div class="success-shift-emaill">
        <simple-svg :filepath="'/static/img/success-forgot.svg'" />
      </div>

      <div class="form__block">
        <h4 class="form__subtitle">Для подтверждения новой почты нажимайте на кнопку.</h4>
      </div>

      <div class="shift-btn__action">
        <button-hover tag="button" type="submit" variant="white">Подтвердить</button-hover>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ShiftEmailSuccess',

  data: () => ({}),
  computed: {},

  mounted() {
    this.temp = this.$route.query.temp || '';
  },

  methods: {
    submitHandler() {
      axios({
        url: '/auth/confirm-email ',
        data: { temp: this.temp },
        method: 'PUT',
      }).then((response) => {
        console.log(response);
        alert('Почта удачно подтвеждена!');
      });
    },
  },
};
</script>

<style lang="stylus">
.shift-password
  display flex
  justify-content center
  flex-direction column
  height 70%

.shift-btn__action
  margin-top 40px
  display flex
  justify-content center
  align-items center

.success-shift-email
  height 100%
  display flex
  justify-content center
  align-items center

  .simple-svg-wrapper
    width 120px
</style>
