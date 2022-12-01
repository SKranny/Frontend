<template>
  <div class="settings-push">
    <ul class="settings-push__list">
      <li class="settings-push__item" v-for="item in getNotificationsSettings" :key="item.type">
        <div class="settings-push__icon">
          <simple-svg :filepath="`/static/img/settings/push/${item.icon}.svg`" />
        </div>

        <h2 class="settings-push__name">{{ item.name }}</h2>

        <div class="settings-push__check">
          <input
            class="settings-push__check-input"
            type="checkbox"
            :id="item.icon"
            @change="onChecked(item)"
            :checked="item.enable"
          />

          <label class="settings-push__check-label" :for="item.icon" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'SettingsPush',

  computed: {
    ...mapGetters('profile/account', ['getNotificationsSettings']),
  },

  mounted() {
    this.apiNotificationsSettings();
  },

  methods: {
    ...mapActions('profile/account', ['changeNotifications']),
    ...mapActions('profile/account', ['apiNotificationsSettings']),

    onChecked(item) {
      console.log(item);
      this.changeNotifications({
        notification_type: item.type,
        enable: !item.enable,
      });
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.settings-push
  background #fff
  box-shadow standart-boxshadow
  padding 10px 40px

.settings-push__item
  display flex
  align-items center
  padding 25px 0

  &+&
    border-top 1px solid #E6E6E6

.settings-push__icon
  margin-right 30px
  width 23px
  height 23px

.settings-push__name
  margin-right auto
  font-size 15px
  font-family Open Sans
  color #5F5E7A

.settings-push__check
  width 43px
  height 22px

.settings-push__check-input
  display none

  &:checked
    & + .settings-push__check-label
      &:before
        background-color eucalypt
        left 50%

      &:after
        background-color #A5CFB1

.settings-push__check-label
  display block
  width 100%
  position relative
  cursor pointer

  &:before
    content ''
    display block
    width 22px
    height 22px
    border-radius 50%
    background-color #BCBCC7
    position absolute
    left 0
    top -11px
    z-index 2
    transition all 0.2s

  &:after
    content ''
    display block
    background-color #D6D6E2
    border-radius 13px
    width 43px
    height 13px
    position absolute
    left 0
    top 50%
    transform translateY(-50%)
    transition all 0.2s
</style>
