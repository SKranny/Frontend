<template>
  <div class="form-layout__language" ref="language">
    <h4 class="form-layout__language-title">Выберите язык</h4>

    <div class="form-layout__language-search">
      <simple-svg :filepath="'/static/img/search.svg'" />

      <input
        class="form-layout__language-input"
        type="text"
        v-model="language"
        placeholder="Начните вводить название языка"
      />
    </div>

    <ul class="form-layout__language-list">
      <li
        class="form-layout__language-item"
        v-for="lang in filterLanguages"
        :key="lang.id"
        @click="setActiveHandler(lang)"
      >
        {{ lang.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
export default {
  name: 'FormLayoutLanguage',
  data: () => ({
    language: '',
  }),
  computed: {
    ...mapGetters('auth/languages', ['getLanguages']),
    filterLanguages() {
      return this.language.length > 0
        ? this.getLanguages.filter(
            (el) => el.text.toLowerCase().indexOf(this.language.toLowerCase()) >= 0
          )
        : this.getLanguages;
    },
  },

  // mounted() {
  //   if (this.getLanguages.length === 0) this.apiLanguages();
  // },

  methods: {
    ...mapMutations('auth/languages', ['setActiveLanguage', 'toggleLanguageBlock']),
    ...mapActions('auth/languages', ['apiLanguages']),
    setActiveHandler(lang) {
      this.toggleLanguageBlock();
      this.setActiveLanguage(lang);
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.form-layout__language
  height 0
  width 100%
  background #fff
  padding 35px 20px 20px 11.82%
  color charade
  transition all 0.2s

  &.active
    height auto

.form-layout__language-title
  font-family font-exo
  font-weight 200
  font-size 30px
  letter-spacing -0.01em
  color #000000
  margin-bottom 15px

.form-layout__language-search
  margin-bottom 30px
  max-width 345px
  position relative

  .simple-svg-wrapper
    width 16px
    height 16px
    position absolute
    left 0
    top 0

  .simple-svg
    stroke steel-gray
    fill transparent

.form-layout__language-input
  width 100%
  border-bottom 1px solid #BBBBC7
  padding 0 20px 5px
  cursor pointer
  font-weight 300
  font-size 15px
  color manatee

.form-layout__language-list
  display inline-flex
  flex-direction column
  flex-wrap wrap
  height auto
  max-height 350px

.form-layout__language-item
  font-weight 300
  font-size 13px
  line-height 25px
  color charade
  width 190px
  transition all 0.2s
  cursor pointer

  &:hover
    color eucalypt
</style>
