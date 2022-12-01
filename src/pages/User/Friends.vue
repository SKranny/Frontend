<template>
  <div class="friends inner-page">
    <div class="inner-page__main">
      <div class="friends__header">
        <h2 class="friends__title">Мои друзья</h2>

        <div class="friends__search">
          <div class="friends__search-icon">
            <search-icon />
          </div>

          <input
            class="friends__search-input"
            placeholder="Начните вводить имя друга..."
            v-model="firstName"
          />
        </div>
      </div>

      <div class="friends__content">
        <div class="friends__list">
          <div v-if="localFriends.REQUEST_FROM" class="friends_group">
            <h3 class="friends_group_title">Запросы в друзья</h3>

            <friends-block
              friend="friend"
              v-for="friend in localFriends.REQUEST_FROM"
              :key="friend.id"
              :info="friend"
              accept-button
            />
          </div>

          <div v-if="localFriends.REQUEST_TO" class="friends_group">
            <h3 class="friends_group_title">Исходящие запросы</h3>

            <friends-block
              friend="friend"
              v-for="friend in localFriends.REQUEST_TO"
              :key="friend.id"
              :info="friend"
            />
          </div>

          <div v-if="localFriends.FRIEND" class="friends_group">
            <h3 class="friends_group_title">Друзья</h3>

            <friends-block
              friend="friend"
              v-for="friend in localFriends.FRIEND"
              :key="friend.id"
              :info="friend"
            />
          </div>

          <div v-if="localFriends.SUBSCRIBED" class="friends_group">
            <h3 class="friends_group_title">Подписчики</h3>

            <friends-block
              friend="friend"
              v-for="friend in localFriends.SUBSCRIBED"
              :key="friend.id"
              :info="friend"
            />
          </div>

          <div v-if="localFriends.BLOCKED" class="friends_group">
            <h3 class="friends_group_title">Заблокированные пользователи</h3>

            <friends-block
              friend="friend"
              v-for="friend in localFriends.BLOCKED"
              :key="friend.id"
              :info="friend"
              :blocked="true"
            />
          </div>

          <div v-if="localFriends.REJECTING" class="friends_group">
            <h3 class="friends_group_title">Отклоненные запросы</h3>
            <friends-block
              friend="friend"
              v-for="friend in localFriends.REJECTING"
              :key="friend.id"
              :info="friend"
            />
          </div>

          <div v-if="friends.WATCHING" class="friends_group">
            <h3 class="friends_group_title">Подписан(а)</h3>
            <friends-block
              friend="friend"
              v-for="friend in friends.WATCHING"
              :key="friend.id"
              :info="friend"
            />
          </div>
        </div>

        <div class="inner-page__aside">
          <friends-possible />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import FriendsPossible from '@/components/Friends/Possible';
import FriendsBlock from '@/components/Friends/Block';
import SearchIcon from '@/Icons/SearchIcon.vue';

export default {
  name: 'Friends',
  components: { FriendsPossible, FriendsBlock, SearchIcon },

  data: () => ({
    firstName: '',
    localFriends: [],
    statusCodes: [
      'REQUEST_FROM',
      'REQUEST_TO',
      'FRIEND',
      'BLOCKED',
      'REJECTING',
      'SUBSCRIBED',
      'WATCHING',
    ],
  }),

  computed: {
    ...mapGetters('profile/friends', ['getResultById']),
    ...mapState('profile/friends', ['friends']),
  },

  watch: {
    friends() {
      this.localFriends = this.friends;
    },

    // firstName(value) {
    //   if (this.firstName === '') this.localFriends = this.friends;
    //   else
    //     this.localFriends = this.localFriends.filter(
    //       (f) => f.firstName.includes(value) || f.lastName.includes(value)
    //     );
    // },
  },

  mounted() {
    if (!Object.keys(this.friends).length) {
      this.statusCodes.forEach((statusCode) => {
        this.apiFriends({ statusCode });
      });
    }
    this.localFriends = this.friends;
  },

  methods: {
    ...mapActions('profile/friends', ['apiFriends']),
  },
};
</script>

<style scoped lang="stylus">
.friends_group_title
  display flex
  justify-content center
  margin-bottom 10px
  margin-top 20px
  color #666

.friends_group
  max-height 435px
  overflow-y scroll
  background-color #eaeaea47
  border 0.5px solid #eaeaea

  &:not(:last-child)
    margin-bottom 40px
.friends__content
  position relative
  display flex
  align-items flex-start
  margin-top 40px

.friends__list
  margin-right 40px
  flex 0 1 auto
.inner-page
  &__main
    max-width none

  &__aside
    position sticky
    top 85px



.friends-possible
  margin-top 0

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
  .friends__list
    margin-right 0

  .friends_group:not(:last-child)
    margin-bottom 40px
</style>
