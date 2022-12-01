<template>
  <div class="admin-comments inner-page admin">
    <h2 class="admin__title">Комментарии</h2>

    <div class="admin__wrap">
      <div class="inner-page__main">
        <div class="admin__search">
          <admin-search v-model="search" @change-value="onChangeSearch" />
        </div>

        <div class="admin-comments__list">
          <comments-block admin />
          <comments-block admin blocked />
        </div>
      </div>

      <div class="inner-page__aside">
        <admin-sidebar v-model="filter" @change-filter="onChangeFilter" />
      </div>
    </div>
  </div>
</template>

<script>
import AdminSearch from '@/components/Admin/Search';
import AdminSidebar from '@/components/Admin/Sidebar';
import CommentsBlock from '@/components/Comments/Block';

export default {
  name: 'AdminComments',
  components: { AdminSidebar, AdminSearch, CommentsBlock },

  data: () => ({
    filter: 'all',
    search: '',
  }),

  methods: {
    onChangeFilter(id) {
      this.filter = id;
    },

    onChangeSearch(value) {
      this.search = value;
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.admin-comments
  .comment-block
    background #FFFFFF
    box-shadow standart-boxshadow
    padding 25px 40px

  .comment-block + .comment-block
    margin-top 20px
</style>
