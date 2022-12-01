<template>
  <div class="friends friends-find inner-page">
    <div class="inner-page__main">
      <div class="friends__header">
        <h2 class="friends__title">
          <template v-if="searchUsers.length === 0">Найти друзей</template>
          <template v-else>Найдено {{ searchUsers.length }} человек</template>
        </h2>
      </div>

      <div class="friends__content">
        <div class="friends__list-wrapper">
          <div class="friends__list" v-if="searchUsers.length > 0">
            <friends-block v-for="user in searchUsers" :key="user.id" :info="user" />
          </div>

          <div class="friends__list" v-else-if="possibleFriends.length > 0">
            <div class="friends-possible__title">Возможные друзья</div>
            <friends-block v-for="user in possibleFriends" :key="user.id" :info="user" />
          </div>
        </div>

        <div class="inner-page__aside">
          <friends-search />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import FriendsBlock from '@/components/Friends/Block';
import FriendsSearch from '@/components/Friends/Search';
export default {
  name: 'FriendsFind',
  components: { FriendsBlock, FriendsSearch },
  data: () => ({
    isPossible: true,
    friends: [],
  }),

  computed: {
    ...mapGetters('profile/friends', ['getResultById']),

    possibleFriends() {
      return this.getResultById('recommendations');
    },

    searchUsers() {
      return this.$store.getters['global/search/getResultById']('users');
    },
  },

  watch: {
    searchUsers(val) {
      if (val.length === 0) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'response',
          text: 'Пользователи с такими параметрами не найдены!',
        });
        return;
      }
    },
  },

  mounted() {
    if (this.possibleFriends.length === 0) this.apiRecommendations();
    if (this.friends.length === 0) this.apiFriends();
  },

  methods: {
    ...mapActions('profile/friends', ['apiAddFriends', 'apiRecommendations']),
    ...mapActions('profile/friends', ['apiFriends']),
  },
};
</script>

<style lang="stylus" scoped>
@import '../../assets/stylus/base/vars.styl';
.inner-page__main, .friends-block
  max-width none

.friends__content
  position relative
  display flex
  align-items flex-start

.friends__list-wrapper
  flex 0 1 680px
  margin-right 40px

.friends__list
  margin-right 0

.friends-block
  margin-right 0

.friends-possible
  margin-top 0

.inner-page__aside
  position sticky
  top 85px

@media (max-width 892px)
  .friends__content
    flex-direction column
    align-items stretch
  .inner-page__aside
    position static
    max-width none
    width 100%
    margin-bottom 40px
    order -1
  .friends__list-wrapper
    margin-right 0
</style>
