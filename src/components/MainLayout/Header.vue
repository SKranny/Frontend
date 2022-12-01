<template>
  <header class="main-layout__header" :class="{ admin: isAdminPage }">
    <template v-if="!isAdminPage">
      <form class="main-layout__search" action="#" @submit.prevent="onSearch">
        <button class="main-layout__search-btn">
          <search-icon />
        </button>

        <input
          class="main-layout__search-input"
          type="text"
          placeholder="Поиск"
          :value="searchText"
          @input="setSearchText($event.target.value)"
        />
      </form>

      <div class="main-layout__push" @click="togglePush">
        <push-icon :isNotEmpty="getNotificationsLength > 0" />

        <push :isOpen="isOpenPush" @close-push="togglePush" />
      </div>
    </template>

    <router-link class="main-layout__user" v-if="getInfo" :to="{ name: 'Profile' }">
      <div class="main-layout__user-pic" style="background-color: #8bc49e">
        <img
          v-if="getInfo.photo"
          :src="getInfo.photo"
          :alt="getInfo.firstName[0] + ' ' + getInfo.lastName[0]"
        />

        <div v-else>
          {{ getInfo.firstName[0] + ' ' + getInfo.lastName[0] }}
        </div>
      </div>

      <span class="main-layout__user-name">{{ getInfo.fullName }}</span>

      <span class="main-layout__user-post" v-if="isAdminPage">- администратор</span>
    </router-link>
  </header>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import SearchIcon from '../../Icons/SearchIcon.vue';
import PushIcon from '../../Icons/PushIcon.vue';
import Push from '@/components/MainLayout/Push';
export default {
  name: 'MainLayoutHeader',
  components: { Push, SearchIcon, PushIcon },

  data: () => ({
    isOpenPush: false,
  }),

  computed: {
    ...mapState('profile/dialogs', ['dialogs', 'newMessage']),
    ...mapGetters('global/search', ['searchText']),
    ...mapGetters('profile/info', ['getInfo']),
    ...mapGetters('profile/notifications', ['getNotificationsLength']),
    isAdminPage() {
      return this.$route.path.indexOf('admin') !== -1;
    },
    activeDialogId() {
      return this.$route.params.activeDialogId;
    },
  },

  watch: {
    dialogs(value) {
      let unreadCount = 0;
      value.forEach((item) => {
        unreadCount += item.unreadCount;
      });
      this.setUnreadedMessages(unreadCount);
    },
  },

  created() {
    if (this.$route.name !== 'Im' && this.$route.name !== 'ImChat') this.fetchDialogs();
  },

  async mounted() {
    this.apiGeo();
    if (!this.getInfo) this.apiInfo();
    await this.$socket.connect();
    this.$socket.subscribe('socket event', (messagePayload) => {
      if (messagePayload.type === 'NOTIFICATION') {
        //unification
        messagePayload.data.sentTime = messagePayload.data.timestamp;
        this.addNotification(messagePayload.data);
        if (this.$route.name !== 'Push') {
          this.addNotificationsLength(messagePayload.data);
        }
      }

      if (messagePayload.type === 'MESSAGE') {
        if (
          this.$route.name === 'ImChat' &&
          +this.activeDialogId === +messagePayload.data.authorId
        ) {
          this.setNewMessage(messagePayload.data);
        } else {
          const result = [];
          this.dialogs.forEach((d) => {
            let dialod = Object.assign({}, d);
            if (
              +dialod.id !== +this.activeDialogId &&
              +dialod.id === +messagePayload.data.authorId
            ) {
              dialod.unread_count += 1;
            }
            result.push(dialod);
          });
          this.setDialogs(result);
        }
      }
    });
  },

  methods: {
    ...mapMutations('global/search', ['setSearchText']),
    ...mapActions('profile/dialogs', ['fetchDialogs']),
    ...mapMutations('profile/notifications', ['addNotification', 'addNotificationsLength']),
    ...mapMutations('profile/dialogs', ['setUnreadedMessages', 'setDialogs', 'setNewMessage']),
    ...mapActions('profile/info', ['apiInfo']),
    ...mapActions('global/search', ['searchAll']),
    ...mapActions('global/geo', ['apiGeo']),

    onSearch() {
      this.searchAll(this.searchText).then(() => {
        this.$router.push({ name: 'Search', query: { text: this.searchText } });
      });
    },

    togglePush() {
      this.isOpenPush = !this.isOpenPush;
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.main-layout__header
  background eucalypt
  box-shadow standart-boxshadow
  height header-height
  position fixed
  top 0
  left sidebar-width
  right 0
  display flex
  align-items center
  padding 0 40px
  z-index 10
  color #FFFFFF

  &.admin
    background #fff
    color steel-gray
    justify-content flex-end

  @media (max-width breakpoint-xxl)
    left sidebar-width-xl

.main-layout__search
  display flex
  align-items center
  width 100%
  max-width 350px
  margin-right auto

.main-layout__search-btn
  margin-right 10px
  background-color transparent
  color: #fff
  outline none

  & svg
    transition transform 200ms linear

  &:hover svg
    transform scale(1.2)

.main-layout__search-input
  font-size 15px
  width 100%
  background transparent
  padding 5px
  border-bottom 2px solid rgba(255, 255, 255, 0.12)
  color #fff
  transition all 0.2s

  &::placeholder
    color rgba(255, 255, 255, 0.3)

  &:focus
    border-bottom-color #fff

.main-layout__push
  margin-right 30px
  width 60px
  height 60px
  display flex
  align-items center
  justify-content center
  cursor pointer

  svg
    transition: transform 200ms linear

    &[data-push]:after
      content attr(data-push)
      font-style normal
      font-weight bold
      font-size 10px
      line-height 15px
      width 16px
      height 16px
      background-color #F9555F
      border-radius 50%
      display flex
      align-items center
      justify-content center
      position relative
      top -25px
      left 7px
      padding-right 1px

  &:hover svg
    transform scale(1.2)

.main-layout__user
  display flex
  align-items center
  font-weight 600
  font-size 15px
  color #fff

.main-layout__user-pic
  width 50px
  height 50px
  border-radius 50%
  overflow hidden
  margin-right 15px
  flex none
  background-color #8bc49e

  div
    display flex
    align-items center
    justify-content center
    width 100%
    height 100%
    object-fit cover

  img
    display flex
    align-items center
    justify-content center
    width 100%
    height 100%
    object-fit cover

.main-layout__user-post
  margin-left 5px

@media (max-width 1024px)
  .main-layout__header
    left 120px
</style>
