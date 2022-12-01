<template>
  <form class="admin-login" action="#" @submit.prevent="submitHandler">
    <h1 class="admin-login__title form__title">Вход в админ-панель</h1>

    <email-field id="admin-login-email" v-model="email" :v="$v.email" />
    <password-field id="admin-login-password" v-model="password" :v="$v.password" />

    <div class="admin-login__action">
      <button-hover tag="button" type="submit" variant="white">Войти</button-hover>
      <router-link class="admin-login__link" :to="{ name: 'Forgot' }"> Забыли пароль?</router-link>
    </div>
  </form>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators';
import PasswordField from '@/components/FormElements/PasswordField';
import EmailField from '@/components/FormElements/EmailField';

export default {
  name: 'AdminLogin',
  components: {
    PasswordField,
    EmailField,
  },

  data: () => ({
    email: '',
    password: '',
  }),

  methods: {
    submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
      }
    },
  },

  validations: {
    email: { required, email },
    password: { required, minLength: minLength(8) },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.admin-login
  width 100%;
  max-width 450px

.admin-login__title
  margin-bottom 50px

.admin-login__action
  margin-top 50px
  display flex
  align-items center

.admin-login__link
  display block
  margin-left 30px
  font-size 13px
  color rgba(255, 255, 255, 0.5)
  transition all 0.2s

  &:hover
    color #fff
</style>
