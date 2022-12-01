<template>
  <div class="profile inner-page" v-if="getUsersInfo">
    <div class="inner-page__main">
      <div class="profile__info">
        <profile-info
          :info="getUsersInfo"
          :blocked="getUsersInfo.isBlocked"
          :friend="getUsersInfo.isFriend"
          :online="getUsersInfo.isOnline"
        />
      </div>

      <div class="profile__news">
        <div class="profile__tabs">
          <span class="profile__tab active">
            Публикации {{ getUsersInfo.firstName }} ({{ getWallPagination.totalElements }})
          </span>
        </div>

        <div v-if="getWall && getWall.length > 0" class="profile__news-list">
          <error-block v-if="!loading && error" :message="errorMessage" />

          <news-block v-for="news in getWall" :key="news.id" :info="news" />

          <div class="spinner-wrapper" v-if="loading">
            <spinner />
          </div>

          <auto-paginator
            :page="getWallPagination.page"
            :loading="loading"
            :totalPage="getWallPagination.total"
            :action="setThisWall"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileInfo from '@/components/Profile/Info';
import NewsBlock from '@/components/News/Block';
import Spinner from '@/components/Spinner.vue';
import ErrorBlock from '@/components/ErrorBlock.vue';
import AutoPaginator from '@/components/AutoPaginator.vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

export default {
  name: 'ProfileId',
  components: { ProfileInfo, NewsBlock, Spinner, ErrorBlock, AutoPaginator },

  computed: {
    ...mapGetters('users/info', ['getUsersInfo', 'getWall', 'getWallPagination']),
    ...mapState('global/status', ['loading', 'error', 'errorMessage']),
  },

  mounted() {
    window.scroll(0, 0);
  },

  async created() {
    this.clearWall();
    this.clearPagination();
    await this.userInfoId(this.$route.params.id);
  },
  methods: {
    ...mapActions('users/info', ['userInfoId', 'apiWall']),
    ...mapMutations('users/info', ['clearWall', 'clearPagination']),

    setThisWall({ page }) {
      return this.apiWall({
        accountIds: this.getUsersInfo.id,
        author: this.getUsersInfo,
        page,
      });
    },
  },
};
</script>
