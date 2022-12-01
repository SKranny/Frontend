<template>
  <div class="im-dialog" :class="{ active, push }">
    <router-link
      class="im-dailog__pic"
      :to="{
        name: 'ProfileId',
        params: { id: info.conversationPartner.id },
      }"
    >
      <div class="main-layout__user-pic">
        <img
          v-if="info.conversationPartner.photo"
          :src="info.conversationPartner.photo"
          :alt="info.conversationPartner.firstName[0] + ' ' + info.conversationPartner.lastName[0]"
        />

        <div v-else>
          {{ info.conversationPartner.firstName[0] + ' ' + info.conversationPartner.lastName[0] }}
        </div>
      </div>
    </router-link>

    <div class="im-dialog__info">
      <router-link
        class="im-dialog__name"
        :to="{
          name: 'ProfileId',
          params: { id: info.conversationPartner.id },
        }"
      >
        {{ info.conversationPartner.firstName }}
        {{ info.conversationPartner.lastName }}
      </router-link>

      <span class="user-status" v-if="!online" :class="{ online }">
        Был(а) в сети
        <br />
        {{ this.info.conversationPartner.lastOnlineTime | moment('from') }}
      </span>

      <span class="user-status" v-else :class="{ online, offline: !online }"> онлайн </span>
    </div>

    <div class="im-dialog__content">
      <p class="im-dialog__last">
        <span class="im-dialog__last-me" v-if="me"> Вы: {{ info.lastMessage.messageText }}</span>
        <span v-else> {{ info.lastMessage.messageText }}</span>
      </p>

      <span class="im-dialog__time">{{ info.lastMessage.time | moment('from') }}</span>
    </div>

    <span class="im-dialog__push" v-if="push > 0">{{ push }}</span>
  </div>
</template>

<script>
export default {
  name: 'ImDialog',
  props: {
    active: Boolean,
    push: Number,
    online: Boolean,
    me: Boolean,
    info: Object,
  },
  computed: {},
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.im-dialog
  display flex
  align-items center
  height 100px
  position relative
  padding 0 6.38%
  z-index 0
  cursor pointer

  &:before
    content ''
    display none
    width 100%
    height 100%
    position absolute
    top 0
    left 0
    background-color #F8FAFD
    z-index -1

  &:after
    content ''
    display block
    height 1px
    width 87.24%
    background-color #E3E8EE
    position absolute
    bottom 0
    left 50%
    transform translateX(-50%)

  &.push + &.active, &.active + &.push
    &:after
      display none

  &.active
    &:after
      display none

    &:before
      display block

  &.push
    &:after
      display none

    &:before
      display block
      background-color #E9F5EF

    .im-dialog__content
      max-width 30%

    .im-dialog__time
      color #7D9A8B

.im-dailog__pic
  width 60px
  height 60px
  border-radius 50%
  overflow hidden
  margin-right 15px
  flex none

.im-dialog__info
  width 100%
  max-width 35%
  margin-right 60px
  @media (max-width breakpoint-xl)
    display none

.im-dialog__name
  font-size 12px
  line-height 22px
  color steel-gray
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

.im-dialog__content
  max-width 35%

  @media (max-width breakpoint-xl)
    display none

.im-dialog__last
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  font-size 12px
  line-height 18px
  letter-spacing -0.003em

  &-me
    color eucalypt

.im-dialog__time
  color #A4A4B8
  font-size 12px
  line-height 19px

.im-dialog__push
  width 27px
  height 27px
  border-radius 50%
  display flex
  align-items center
  justify-content center
  font-size 12px
  line-height 27px
  font-weight 600
  color #fff
  background-color #E65151
  margin-left auto

.im-dialog__last-me
  color green
</style>
