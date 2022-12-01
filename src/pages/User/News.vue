<template>
  <div class="news inner-page">
    <div class="inner-page__main">
      <div class="news__add">
        <news-add user="user" />
      </div>

      <template v-if="feeds">
        <div class="news__list" v-if="getInfo">
          <news-block
            v-for="feed in feeds"
            :key="feed.id"
            :info="feed"
            :edit="getInfo.id === feed.author.id"
            :deleted="getInfo.id === feed.author.id"
          />
        </div>
      </template>

      <error-block v-if="!loading && error" :message="errorMessage" />

      <div class="spinner-wrapper" v-if="loading">
        <spinner />
      </div>

      <auto-paginator
        :page="feedsPagination.page || 0"
        :loading="loading"
        :totalPage="feedsPagination.total"
        :action="apiFeeds"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import NewsBlock from '@/components/News/Block';
import NewsAdd from '@/components/News/Add';
import Spinner from '@/components/Spinner.vue';
import ErrorBlock from '@/components/ErrorBlock.vue';
import AutoPaginator from '@/components/AutoPaginator.vue';

export default {
  name: 'News',
  components: { NewsBlock, NewsAdd, Spinner, ErrorBlock, AutoPaginator },

  computed: {
    ...mapState('global/status', ['loading', 'error', 'errorMessage']),
    ...mapGetters('profile/info', ['getInfo']),
    ...mapState('profile/feeds', ['feeds', 'feedsPagination']),
  },

  methods: {
    ...mapActions('profile/feeds', ['apiFeeds']),
    ...mapMutations('profile/feeds', ['setFeeds']),
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.news__add
  margin-bottom 30px

.news__list
  margin-bottom 30px
</style>

<style lang="stylus" scoped>
.spinner-wrapper
  width 100px
  height 100px
  margin 0 auto
  padding 50px
</style>
