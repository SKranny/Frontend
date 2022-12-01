<template>
  <div class="search-all">
    <search-block title="Люди" id="users" all="all">
      <div class="friends__list">
        <friends-block v-for="user in users" :key="user.id" :info="user" subscribeButton />
      </div>
    </search-block>

    <search-block title="Новости" id="news" all="all">
      <news-block v-for="n in news" :key="n.id" :info="n" />
    </search-block>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SearchBlock from '@/components/Search/Block';
import FriendsBlock from '@/components/Friends/Block';
import NewsBlock from '@/components/News/Block';

export default {
  name: 'SearchAll',
  components: { SearchBlock, FriendsBlock, NewsBlock },

  computed: {
    ...mapGetters('global/search', ['getResultById']),

    news() {
      return this.getResultById('news');
    },

    users() {
      return this.getResultById('users');
    },
  },
};
</script>
