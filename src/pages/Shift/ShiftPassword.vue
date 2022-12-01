<template>
  <div class="shift-password">
    <form class="shift-password__form" @submit.prevent="submitHandler">
      <div class="form__block">
        <h4 class="form__subtitle">Смена пароля</h4>

        <password-field
          id="shift-password"
          v-model="password"
          :v="$v.password"
          info
          registration
          :class="{ checked: $v.password.required && $v.passwordTwo.sameAsPassword }"
        />

        <password-repeat-field
          id="shift-repeat-password"
          v-model="passwordTwo"
          :v="$v.passwordTwo"
          :class="{ checked: $v.password.required && $v.passwordTwo.sameAsPassword }"
        />
      </div>

      <div class="form__block">
        <h4 class="form__subtitle">Введите символы, которые вы видите на экране</h4>

        <button class="btn__update bold" @click.prevent="updateCaptcha">Обновить</button>

        <div class="img_captcha">
          <img :src="imgCode" :alt="'image'" />
        </div>

        <code-field
          id="register-code"
          v-model="code"
          :v="$v.code"
          :class="{ checked: $v.code.required && $v.code.isCode }"
        />
      </div>

      <div class="shift-password__action">
        <button-hover tag="button" type="submit" variant="white">Сменить</button-hover>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { required, sameAs, minLength } from 'vuelidate/lib/validators';

import PasswordField from '@/components/FormElements/PasswordField';
import PasswordRepeatField from '@/components/FormElements/PasswordRepeatField';
import CodeField from '@/components/FormElements/CodeField';

export default {
  name: 'ShiftPasssword',
  components: {
    PasswordField,
    PasswordRepeatField,
    CodeField,
  },

  data: () => ({
    password: '',
    passwordTwo: '',
    code: '',
    isCode: true,
    imgCode: '',
  }),

  computed: {
    ...mapGetters('auth/captcha', ['getCaptcha']),
  },

  beforeMount() {
    this.updateCaptcha();
  },

  mounted() {
    this.temp = this.$route.query.temp || '';
  },

  methods: {
    ...mapActions('profile/account', ['changePassword']),
    ...mapActions('auth/captcha', ['fetchCaptcha']),

    updateCaptcha() {
      this.fetchCaptcha().then(() => {
        this.imgCode = this.getCaptcha.imgCode;
        this.token = this.getCaptcha.secret;
      });
    },

    submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      this.changePassword({
        password: this.password,
        code: this.code,
        temp: this.temp,
      }).then(() => {
        this.$router.push({ name: 'change-password-success' });
      });
    },
  },

  validations: {
    password: { required, minLength: minLength(8) },
    passwordTwo: {
      required,
      sameAsPassword: sameAs('password'),
      minLength: minLength(8),
    },

    code: {
      required,
      isCode() {
        return this.isCode;
      },
    },
  },
};
</script>

<style lang="stylus">
.shift-password
  display flex
  justify-content center
  flex-direction column
  height 100%

.shift-password__title
  margin-bottom 20px

.shift-password__action
  margin-top 40px

.img_captcha
  margin-bottom 15px

.btn__update
  margin-bottom 15px
  width 90px
  height 30px
  padding 1px
  background-color white
  color #21a45d
</style>
