<template>
  <div id="app">
    <component :is="layout" v-if="$route.meta.layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    FormLayout: () => import('@/layouts/FormLayout'),
    MainLayout: () => import('@/layouts/MainLayout'),
    EmptyLayout: () => import('@/layouts/EmptyLayout'),
  },
  computed: {
    ...mapGetters('global/alert', ['getState']),
    alert() {
      return this.$store.state.global.alert;
    },
    layout() {
      return this.$route.meta.layout + '-layout';
    },
  },

  watch: {
    'alert.show'(value) {
      if (!value) {
        return;
      }

      if (this.$store.state.global.alert.status === 'success') {
        this.$vToastify.success(this.$store.state.global.alert.text);
        return;
      }

      if (this.$store.state.global.alert.status === 'response') {
        this.$vToastify.success(this.$store.state.global.alert.text, 'Ответ запроса');
        return;
      }

      if (this.$store.state.global.alert.status === 'action') {
        this.$vToastify.success(this.$store.state.global.alert.text, 'Действие невозможно');
        return;
      }

      if (this.$store.state.global.alert.status === 'validation') {
        this.$vToastify.success(this.$store.state.global.alert.text, 'Неверные параметры');
        return;
      }

      this.$vToastify.error(this.$store.state.global.alert.text, 'Ошибка');
      return;
    },
  },
};
</script>
<style lang="stylus">

@import './assets/stylus/main.styl'

.v-snack__wrapper
  &.success
    background-coloreucalypt

  &.error
    background-colorwild-watermelon
</style>

<style lang="css">
@import '../public/css/style.min.css';

::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-track {
  background-color: darkgrey;
}

::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
}
</style>
