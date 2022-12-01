<template>
  <div>
    <!--  Please avoid to use margin between -->
    <!--  messages block or it will glitter on-->
    <!--  scroll-->
    <h5 class="im-chat__message-title" v-if="source.stubDate">
      {{ source.date | moment('DD MMMM YYYY') }}
    </h5>

    <div v-else class="im-chat__message-block" :class="{ me: source.isSentByMe }">
      <p class="im-chat__message-text">{{ source.messageText }}</p>
      <span class="im-chat__message-time">{{ source.time | moment('YYYY-MM-DD hh:mm') }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfiniteLoadingItem',
  props: {
    source: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '../../assets/stylus/base/vars.styl'


.im-chat__message-day
  &+&
    margin-top 50px

.im-chat__message-title
  color #8A94A4
  font-size 15px
  text-align center
  display block
  width 100%

.im-chat__message-block
  display flex
  align-items center
  max-width 460px

  &+&
    margin-top 20px

  &.me + &
    margin-top 30px

  &.me
    flex-direction row-reverse
    max-width 450px
    margin-left auto

    .im-chat__message-text
      background-color eucalypt
      color #fff
      box-shadow 0px 4px 15px #D4E8DD

    .im-chat__message-time
      margin-right 15px
      margin-left 0

.im-chat__message-text
  background-color #FFFFFF
  box-shadow 0px 4px 15px #EFF1F6
  border-radius 20px
  padding 15px 20px
  color steel-gray
  font-size 15px
  line-height 23px

.im-chat__message-time
  font-size 13px
  color #BAC3D0
  margin-left 15px
</style>
