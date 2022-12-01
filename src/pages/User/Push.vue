<template>
  <div class="page-push inner-page">
    <div class="inner-page__main" v-if="getNotifications.length > 0">
      <push-block v-for="info in filterNotifications" :key="info.id" :info="info" />
    </div>

    <div class="inner-page__aside">
      <push-sidebar v-model="activeFilter" @change-push-sidebar="onChangeFilter" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PushSidebar from '@/components/Push/Sidebar';
import PushBlock from '@/components/Push/Block';
export default {
  name: 'PagePush',
  components: { PushSidebar, PushBlock },

  data: () => ({
    activeFilter: 'Все',
  }),

  computed: {
    ...mapGetters('profile/notifications', ['getNotifications']),
    filterNotifications() {
      switch (this.activeFilter) {
        case 'Все':
          return this.getNotifications;
        case 'Комментарии':
          return this.getNotifications.filter(
            (el) =>
              el.notification_type === 'POST_COMMENT' || el.notification_type === 'COMMENT_COMMENT'
          );
        case 'Друзья':
          return this.getNotifications.filter((el) => el.notification_type === 'FRIEND_REQUEST');
      }
      return this.getNotifications;
    },
  },
  mounted() {
    this.fetchNotifications();
  },

  methods: {
    ...mapActions('profile/notifications', ['fetchNotifications']),
    onChangeFilter(item) {
      this.activeFilter = item;
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.page-push
  flex-direction column

  .inner-page__aside
    display block
    max-width 100%
    order -1

    .aside-filter__item
      text-align center

  .inner-page__main
    margin-right 0
    position fixed
    top 230px
    max-height 75vh
    overflow-y scroll
</style>
