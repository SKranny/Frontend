<template>
  <div class="admin-posts inner-page admin">
    <h2 class="admin__title">Публикации</h2>

    <div class="admin__wrap">
      <div class="inner-page__main">
        <div class="admin__search">
          <admin-search v-model="search" @change-value="onChangeSearch" />
        </div>

        <div class="admin-posts__list">
          <news-block admin />
          <news-block admin blocked />
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
import NewsBlock from '@/components/News/Block';
export default {
  name: 'AdminPosts',
  components: { AdminSidebar, AdminSearch, NewsBlock },

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
