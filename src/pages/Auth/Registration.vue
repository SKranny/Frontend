<template>
  <div class="registration">
    <form class="registration__form" @submit.prevent="submitHandler">
      <div class="form__block">
        <h4 class="form__subtitle">Аккаунт</h4>

        <email-field
          id="register-email"
          v-model="email"
          :v="$v.email"
          :class="{ checked: $v.email.required && $v.email.email }"
        />

        <password-field
          id="register-password"
          v-model="password1"
          :v="$v.password1"
          info
          registration
          :class="{
            checked: $v.password1.required && $v.password2.sameAsPassword && $v.password1.minLength,
          }"
        />

        <password-repeat-field
          id="register-repeat-password"
          v-model="password2"
          :v="$v.password2"
          :class="{
            checked: $v.password1.required && $v.password2.sameAsPassword && $v.password2.minLength,
          }"
        />
      </div>
      <div class="form__block">
        <h4 class="form__subtitle">Личные данные</h4>

        <name-field id="register-firstName" v-model="firstName" :v="$v.firstName" />

        <name-field id="register-lastName" v-model="lastName" :v="$v.lastName" label="Фамилия" />
      </div>
      <div class="form__block">
        <h4 class="form__subtitle">Введите символы, которые вы видите на экране</h4>

        <button class="btn__update bold" @click.prevent="updateCatcha">Обновить</button>

        <div class="img_captcha">
          <img :src="imgCode" :alt="'image'" />
        </div>

        <code-field
          id="register-code"
          v-model="code"
          :v="$v.code"
          :class="{ checked: $v.code.required && $v.code.isCode }"
        />

        <confirm-field id="register-confirm" v-model="confirm" :v="$v.confirm" />
      </div>

      <div class="registration__action">
        <button-hover tag="button" type="submit" variant="white">Зарегистрироваться</button-hover>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';
import PasswordField from '@/components/FormElements/PasswordField';
import PasswordRepeatField from '@/components/FormElements/PasswordRepeatField';
import EmailField from '@/components/FormElements/EmailField';
import NameField from '@/components/FormElements/NameField';
import CodeField from '@/components/FormElements/CodeField';
import ConfirmField from '@/components/FormElements/ConfirmField';

export default {
  name: 'Registration',
  components: {
    PasswordField,
    EmailField,
    NameField,
    CodeField,
    ConfirmField,
    PasswordRepeatField,
  },

  data: () => ({
    email: '',
    password1: '',
    password2: '',
    firstName: '',
    lastName: '',
    imgCode: '',
    code: '',
    token: '',
    confirm: false,
    isCode: false,
  }),

  computed: {
    ...mapGetters('auth/captcha', ['getCaptcha']),
  },
  watch: {
    code() {
      if (this.isCode === false) {
        this.isCode = true;
      }
    },
  },

  beforeMount() {
    this.updateCatcha();
  },

  mounted() {
    // this.code = this.getCode;
  },

  methods: {
    ...mapActions('auth/api', ['register']),
    ...mapActions('auth/captcha', ['fetchCaptcha']),

    updateCatcha() {
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
      const { email, password1, password2, firstName, lastName, code, token } = this;
      this.register({
        email,
        password1,
        password2,
        firstName,
        lastName,
        code,
        token,
      })
        .then(() => {
          this.$router.push({ name: 'RegisterSuccess' });
        })
        .catch((error) => {
          const errorMessage = error.response.data.error_description[0] || '';
          if (errorMessage === 'Неверный код авторизации') {
            this.isCode = false;
          }
        });
    },
  },

  validations: {
    confirm: { sameAs: sameAs(() => true) },
    email: { required, email },
    password1: { required, minLength: minLength(8) },
    password2: {
      required,
      minLength: minLength(8),
      sameAsPassword: sameAs('password1'),
    },
    firstName: { required, minLength: minLength(3) },
    lastName: { required, minLength: minLength(3) },
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
@import '../../assets/stylus/base/vars.styl'

.registration
  min-height 100%
  display flex
  flex-direction column
  justify-content center

.registration__action
  margin-top 40px

  @media (max-width breakpoint-xxl)
    margin-top 20px

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
