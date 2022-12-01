<template>
  <div class="form-layout">
    <div class="form-layout__info" :style="styleInfo">
      <div class="form-layout__container">
        <form-layout-info />
        <form-layout-footer />
      </div>

      <form-layout-language ref="language" />
    </div>

    <div class="form-layout__form">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FormLayoutFooter from '@/components/FormLayout/Footer';
import FormLayoutInfo from '@/components/FormLayout/Info';
import FormLayoutLanguage from '@/components/FormLayout/Language';

export default {
  components: {
    FormLayoutInfo,
    FormLayoutFooter,
    FormLayoutLanguage,
  },

  computed: {
    ...mapGetters('auth/languages', ['getStatusOpenBlock']),
    ...mapGetters('auth/api', ['isAuthenticated']),

    styleInfo() {
      return this.getStatusOpenBlock
        ? {
            transform: `translateY(-${this.$refs.language.$refs.language.scrollHeight + 20}px)`,
          }
        : null;
    },

    routeName() {
      return this.isAuthenticated ? 'News' : 'Login';
    },
  },
};
</script>

<style lang="stylus">
@import '../assets/stylus/base/vars.styl'

.form-layout
  height 100%
  display flex
  overflow hidden

.form-layout__info
  width 100%
  max-width 66.15%
  background-color steel-gray
  color #fff
  flex none
  display flex
  flex-direction column
  transition all 0.2s

.form-layout__container
  padding 100px 20px 75px 11.82%
  display flex
  flex-direction column
  flex none
  height 100%

.form-layout__logo
  max-width 85px

.form-layout__form
  width 100%
  color #fff
  background-color eucalypt
  padding 50px 5.3%
  overflow-y auto
  height 100vh

  @media (max-width breakpoint-xxl)
    padding 50px 2.3%
</style>
