<template>
  <div class="search-users">
    <search-block title="Люди" id="users">
      <div class="friends__list">
        <friends-block v-for="user in users" :key="user.id" :info="user" subscribe-button />
      </div>

      <pagination :count="total" v-model="page" :per-page="size" />
    </search-block>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import SearchBlock from '@/components/Search/Block';
import FriendsBlock from '@/components/Friends/Block';
import Pagination from '@/components/Pagination.vue';

export default {
  name: 'SearchUsers',
  components: { SearchBlock, FriendsBlock, Pagination },
  data() {
    return {
      page: 1,
      size: 5,
      total: 20,
    };
  },

  computed: {
    ...mapGetters('global/search', ['getResultById', 'getUsersQueryParams', 'getUsersPagination']),
    users() {
      return this.getResultById('users');
    },
  },

  watch: {
    page() {
      let searchQuery = Object.assign({}, this.getUsersQueryParams, {
        page: this.page - 1,
        size: this.size,
      });
      this.searchUsers(searchQuery);
    },
    getUsersPagination() {
      this.total = this.getUsersPagination.total;
    },
  },

  mounted() {
    let searchQuery = Object.assign({}, this.getUsersQueryParams, {
      page: this.page - 1,
      size: this.size,
    });
    if (this.users.length === 0) {
      this.searchUsers(searchQuery);
    }
  },

  methods: {
    ...mapActions('global/search', ['searchUsers']),
    ...mapMutations('global/search', ['setUsersPagination']),
  },
};
</script>
