<template>
  <div class="forgot">
    <h2 class="forgot__title form__title">Напишите ваш e&#8209;mail</h2>

    <form class="forgot__form" @submit.prevent="submitHandler">
      <email-field id="forgot-email" v-model="email" :v="$v.email" />

      <div class="forgot__action">
        <button-hover tag="button" type="submit" variant="white">Отправить</button-hover>
      </div>
    </form>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators';
import EmailField from '@/components/FormElements/EmailField';
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'Forgot',
  components: {
    EmailField,
  },

  data: () => ({
    email: '',
  }),

  methods: {
    ...mapActions('profile/account', ['passwordRecovery']),
    ...mapMutations('auth/info', ['setBtn']),

    submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      this.passwordRecovery({ email: this.email }).then(() => {
        const emailDomain = 'https://' + this.email.split('@').pop();
        this.setBtn({
          pageId: 'forgot-success',
          btnId: 'href',
          btnIdValue: emailDomain,
        });

        this.$router.push({ name: 'ForgotSuccess' });
      });
    },
  },
  validations: {
    email: { required, email },
  },
};
</script>

<style lang="stylus">
.forgot
  display flex
  justify-content center
  flex-direction column
  height 100%

.forgot__title
  margin-bottom 60px

.forgot__action
  margin-top 90px
</style>
