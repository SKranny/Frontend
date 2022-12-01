<template>
  <div class="login">
    <h2 class="login__title form__title">Войдите в аккаунт</h2>

    <form class="login__form" @submit.prevent="submitHandler">
      <email-field id="login-email" v-model="email" :v="$v.email" />

      <password-field id="login-password" v-model="password" :v="$v.password" />

      <div class="login__action">
        <button-hover type="submit" tag="button" variant="white"> Войти </button-hover>
        <router-link class="login__link" :to="{ name: 'Forgot' }"> Забыли пароль? </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { required, email, minLength } from 'vuelidate/lib/validators';
import PasswordField from '@/components/FormElements/PasswordField';
import EmailField from '@/components/FormElements/EmailField';

export default {
  name: 'Login',
  components: {
    PasswordField,
    EmailField,
  },

  data: () => ({
    email: '',
    password: '',
  }),

  computed: {
    redirectUrl() {
      return this.$route.query.redirect || 'News';
    },
  },

  methods: {
    ...mapActions('auth/api', ['login']),
    ...mapActions('profile/info', ['apiInfo']),

    submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      this.login({ email: this.email, password: this.password }).then(() => {
        this.apiInfo().then(() => {
          this.$router.push({ name: this.redirectUrl });
        });
      });
    },
  },

  validations: {
    email: { required, email },
    password: { required, minLength: minLength(8) },
  },
};
</script>

<style lang="stylus" scoped>
@import '../../assets/stylus/base/vars.styl'

.login
  height 100%
  display flex
  flex-direction column
  justify-content center

.login__title
  margin-bottom 50px

.login__action
  display flex
  align-items center
  margin-top 50px

.login__link
  font-size 13px
  color rgba(255, 255, 255, 0.5)
  margin-left 30px
  white-space nowrap
  transition all 0.2s

  &:hover
    color #fff
</style>
