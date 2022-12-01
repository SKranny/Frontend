<template>
  <div class="friends-possible">
    <h4 class="friends-possible__title" v-if="possibleFriends.length > 0">Возможно вы их знаете</h4>

    <ul class="friends-possible__list">
      <li class="friends-possible__item" v-for="user in possibleFriends" :key="user.id">
        <div class="main-layout__user-pic">
          <img v-if="user.photo" :src="user.photo" :alt="user.firstName" />

          <div v-else class="avatar">
            {{ user.firstName[0] + ' ' + user.lastName[0] }}
          </div>
        </div>

        <router-link
          class="friends-possible__name"
          :to="{ name: 'ProfileId', params: { id: user.id } }"
        >
          {{ user.firstName + ' ' + user.lastName }}
        </router-link>

        <a href="#" class="friends-possible__link" @click.prevent="apiAddFriends({ id: user.id })">
          Добавить
        </a>
      </li>
    </ul>

    <router-link class="friends-possible__btn" href="#" :to="{ name: 'FriendsFind' }">
      <search-icon class="friends-possible__icon" />
      <span class="friends-possible__link">Искать друзей</span>
    </router-link>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SearchIcon from '../../Icons/SearchIcon.vue';
export default {
  name: 'FriendsPossible',

  components: { SearchIcon },

  computed: {
    ...mapGetters('profile/friends', ['getResultById']),

    possibleFriends() {
      return this.getResultById('recommendations');
    },
  },

  mounted() {
    if (this.possibleFriends.length === 0) this.apiRecommendations();
  },

  methods: {
    ...mapActions('profile/friends', ['apiAddFriends', 'apiRecommendations']),
  },
};
</script>

<style lang="stylus">
.friends-possible__btn
  color #21a45d
  transition color 200ms linear, background-color 200ms linear

  &:hover
    color #fff
    background-color #21a45d

.friends-possible__link
  color inherit

.friends-possible__icon
  margin-right 5px
</style>
