<template>
  <div class="push-block">
    <div class="push__img" v-if="info.author.photo">
      <img :src="info.author.photo" :alt="info.author.firstName[0]" />
    </div>

    <div class="push__img" v-else>
      <div>
        {{ info.author.firstName[0] + ' ' + info.author.lastName[0] }}
      </div>
    </div>

    <p class="push__content">
      <router-link class="push__content-name" :to="getRouteByNotification(info)">
        <span class="push__content-preview">{{ info.content }}</span>
        {{ getNotificationsTextType(info.notificationType) }}
        «{{ info.author.firstName + ' ' + info.author.lastName }}»
      </router-link>
    </p>

    <span class="push__time">{{ info.sentTime | moment('from') }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getRouteByNotification } from '@/utils/notifications.utils.js';

export default {
  name: 'PushBlock',
  props: {
    info: Object,
  },
  computed: {
    ...mapGetters('profile/notifications', ['getNotificationsTextType']),
  },
  methods: {
    getRouteByNotification,
  },
};
</script>

<style lang="stylus">
.push-block
  background #fff
  padding 25px 30px
  box-shadow 0px 2px 60px rgba(0, 0, 0, 0.1)
  display flex
  border-radius 3%
  &+&
    margin-top 20px

  .push__img
    flex none

  .push__content
    max-width 650px
    padding-top 10px
    margin-right 30px

  .push__time
    flex none
    padding-top 10px

.push__img
  width 36px
  height 36px
  border-radius 50%
  overflow hidden
  margin-right 15px
  flex none
  background-color #e6f4eb

  img
    display flex
    align-items center
    justify-content center
    width 100%
    height 100%
    object-fit cover

  div
    display flex
    align-items center
    justify-content center
    width 100%
    height 100%
    object-fit cover
</style>
