<template>
  <div class="search-block">
    <div class="search-block__header">
      <h2 class="search-block__title">{{ title }}</h2>

      <a class="search-block__more" href="#" @click.prevent="changeTab(id)" v-if="all">
        Смотреть всех
      </a>
    </div>

    <div class="search-block__list">
      <slot />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'SearchBlock',
  props: {
    title: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    all: Boolean,
  },
  methods: {
    ...mapActions('global/search', ['changeTab']),
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.search-block
  max-width 1060px

  &+&
    margin-top 70px

.search-block__header
  display flex
  align-items center
  justify-content space-between
  margin-bottom 25px

.search-block__title
  font-family font-exo
  font-weight 200
  font-size 30px
  color #000000

.search-block__more
  font-size 13px
  text-align right
  color #21A45D
</style>
