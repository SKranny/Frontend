<template>
  <div class="profile inner-page" ref="page">
    <div class="inner-page__main">
      <div class="profile__info">
        <profile-info me="me" online="online" :info="getInfo" />
      </div>

      <div class="profile__news">
        <div class="profile__tabs profile__tab" @click="changeTab('')">Мои публикации</div>

        <div class="profile__tabs">
          <span
            class="profile__tab"
            @click="changeTab('POSTED')"
            :class="{ active: activeTab === 'POSTED' }"
          >
            Опубликованные ({{ getWallPagination.totalElements }})
          </span>

          <span
            class="profile__tab"
            @click="changeTab('QUEUED')"
            :class="{ active: activeTab === 'QUEUED' }"
            v-if="getWallQueuedLength > 0"
          >
            Отложенные ({{ getWallQueuedLength }})
          </span>
        </div>

        <div class="profile__add">
          <news-add />
        </div>

        <div class="profile__news-list">
          <error-block v-if="!loading && error" :message="errorMessage" />

          <news-block
            edit="edit"
            deleted="deleted"
            :deffered="activeTab === 'QUEUED'"
            v-for="news in getWall"
            :key="news.id"
            :info="news"
          />

          <div class="spinner-wrapper" v-if="loading">
            <spinner />
          </div>

          <auto-paginator
            :page="getWallPagination.page"
            :loading="loading"
            :totalPage="getWallPagination.total"
            :action="setMyWall"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileInfo from '@/components/Profile/Info';
import NewsAdd from '@/components/News/Add';
import NewsBlock from '@/components/News/Block';
import Spinner from '@/components/Spinner.vue';
import ErrorBlock from '@/components/ErrorBlock.vue';
import AutoPaginator from '@/components/AutoPaginator.vue';
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex';
export default {
  name: 'Profile',
  components: { ProfileInfo, NewsAdd, NewsBlock, Spinner, ErrorBlock, AutoPaginator },

  data: () => ({
    activeTab: 'POSTED',
  }),

  computed: {
    ...mapGetters('profile/info', ['getInfo']),
    ...mapGetters('users/info', ['getWall', 'getWallQueuedLength', 'getWallPagination']),
    ...mapState('global/status', ['loading', 'error', 'errorMessage']),
  },

  mounted() {
    window.scroll(0, 0);
  },

  async created() {
    this.clearWall();
    this.clearPagination();
    if (!this.getInfo) {
      await this.apiInfo();
    }

    if (!this.getWall.length) {
      this.setMyWall({ page: this.getWallPagination.page - 1 || 0 });
    }
  },

  methods: {
    ...mapActions('users/info', ['apiWall']),
    ...mapActions('profile/info', ['apiInfo']),
    ...mapMutations('users/info', ['clearWall', 'clearPagination']),

    setMyWall({ page }) {
      if (typeof this.getInfo?.id === 'undefined') return;
      return this.apiWall({
        accountIds: this.getInfo.id,
        author: this.getInfo,
        page,
      });
    },

    changeTab(tab) {
      this.activeTab = tab;
    },
  },
};
</script>
