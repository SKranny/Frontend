<template>
  <div class="shift-email">
    <form class="shift-email__form" @submit.prevent="submitHandler">
      <div class="form__block">
        <h4 class="form__subtitle">Смена почтового ящика</h4>

        <email-field
          id="shift-email"
          v-model="email"
          :v="$v.email"
          :class="{ checked: $v.email.required && $v.email.email }"
          placeholder="Новый почтовый ящик"
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

      <div class="shift-email__action">
        <button-hover tag="button" type="submit" variant="white">Сменить</button-hover>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { required, email } from 'vuelidate/lib/validators';
import EmailField from '@/components/FormElements/EmailField';
import CodeField from '@/components/FormElements/CodeField';

export default {
  name: 'ShiftEmail',
  components: {
    EmailField,
    CodeField,
  },

  data: () => ({
    email: '',
    imgCode: '',
    code: '',
    isCode: true,
    temp: '',
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
    ...mapActions('profile/account', ['changeEmail']),
    ...mapActions('auth/captcha', ['fetchCaptcha']),
    ...mapMutations('auth/info', ['setBtn']),

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

      this.changeEmail({
        email: this.email,
        code: this.code,
        temp: this.temp,
      }).then(() => {
        const emailDomain = 'https://' + this.email.split('@').pop();
        this.setBtn({
          pageId: 'shift-email-success',
          btnId: 'href',
          btnIdValue: emailDomain,
        });
        this.$router.push({ name: 'ShiftEmailSuccess' });
      });
    },
  },

  validations: {
    email: { required, email },
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
.shift-email
  display flex
  justify-content center
  flex-direction column
  height 100%

.shift-email__title
  margin-bottom 20px

.shift-email__action
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
