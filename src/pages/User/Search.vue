<template>
  <div class="search">
    <div class="search__tabs">
      <search-tabs />
      <component :is="`search-filter-${tabSelect}`" v-if="tabSelect !== 'all'" />
    </div>

    <div class="search__main" :class="{ high: tabSelect !== 'all' }">
      <component :is="`search-${tabSelect}`" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import SearchTabs from '@/components/Search/Tabs';
import SearchAll from '@/components/Search/All';
import SearchUsers from '@/components/Search/Users';
import SearchNews from '@/components/Search/News';
import SearchFilterUsers from '@/components/Search/Filter/Users';
import SearchFilterNews from '@/components/Search/Filter/News';

export default {
  name: 'Search',
  components: {
    SearchTabs,
    SearchAll,
    SearchUsers,
    SearchNews,
    SearchFilterUsers,
    SearchFilterNews,
  },

  data: () => ({
    hasSearchText: true,
  }),

  computed: {
    ...mapGetters('global/search', ['searchText', 'tabSelect']),
  },

  watch: {
    searchText() {
      this.routePushWithQuery(this.tabSelect);
    },
  },

  mounted() {
    if (this.$route.query.tab) this.setTabSelect(this.$route.query.tab);
    if (this.$route.query.text || this.$route.query.text == '')
      this.searchAll(this.$route.query.text);
    else this.hasSearchText = false;
    document.body.onkeydown = (e) => {
      if (e.which === 13) this.hasSearchText = true;
    };
  },
  beforeDestroy() {
    this.clearSearch();
  },

  methods: {
    ...mapMutations('global/search', ['setTabSelect', 'routePushWithQuery']),
    ...mapActions('global/search', ['searchAll', 'clearSearch']),
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.search__tabs
  background #fff
  box-shadow standart-boxshadow
  position fixed
  top header-height
  left sidebar-width
  right 0
  padding 0 20px
  z-index 10

  @media (max-width breakpoint-xxl)
    left sidebar-width-xl

.search__main
  padding 100px 40px 50px
  height 100%
  overflow-y auto

  &.high
    padding-top 250px

@media (max-width 1024px)
  .search__tabs
    left 120px
</style>
