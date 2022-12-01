<template>
  <div class="admin-users inner-page admin">
    <h2 class="admin__title">Люди</h2>

    <div class="admin__wrap">
      <div class="inner-page__main">
        <div class="admin__search">
          <admin-search v-model="search" @change-value="onChangeSearch" />
        </div>

        <div class="friends__list">
          <friends-block admin />
          <friends-block admin blocked />
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
import FriendsBlock from '@/components/Friends/Block';

export default {
  name: 'AdminUsers',
  components: { AdminSidebar, AdminSearch, FriendsBlock },

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
