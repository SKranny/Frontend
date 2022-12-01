<template>
  <div class="settings-delete">
    <h2 class="settings-delete__title">
      После удаления профиля будет удалена вся связанная с ним информация: друзья, публикации,
      комментарии, лайки.
    </h2>

    <div class="settings-delete__confirm">
      <input
        class="settings-delete__confirm-input"
        type="checkbox"
        id="confirm"
        v-model="confirm"
      />

      <label for="confirm" class="settings-delete__confirm-label">
        Да, удалить мою страницу и всю связаную с ней информацию
      </label>
    </div>

    <div class="settings-delete__actions">
      <button-hover :disable="!confirm" variant="warning" @click.prevent.native="onDelete">
        Удалить профиль
      </button-hover>

      <router-link class="settings-delete__actions-link" :to="{ name: 'Profile' }">
        Не удалять профиль, я хочу вернуться
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'SettingsDelete',

  data: () => ({
    confirm: false,
  }),

  methods: {
    ...mapActions('profile/info', ['deleteInfo']),
    ...mapActions('auth/api', ['logout']),

    onDelete() {
      this.deleteInfo().then(() => {
        this.logout().then(() => {
          this.$router.push({ name: 'Login' });
        });
      });
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.settings-delete
  background #fff
  box-shadow standart-boxshadow
  padding 45px 65px

  @media (max-width breakpoint-xl)
    padding 20px

.settings-delete__title
  margin-bottom 20px
  color #0A0A0A
  font-size 18px
  line-height 27px
  max-width 666px

.settings-delete__confirm
  margin-bottom 30px

.settings-delete__confirm-input
  display none

  &:checked
    & + .settings-delete__confirm-label
      &:before
        border-color eucalypt

      &:after
        opacity 1

.settings-delete__confirm-label
  position relative
  display flex
  align-items center
  color #A4A4B8
  font-size 16px
  cursor pointer

  &:before
    content ''
    display block
    border 2px solid #BCBCC7
    width 26px
    height 26px
    margin-right 24px
    transition all 0.2s

  &:after
    content ''
    display block
    width 8px
    height 13px
    border 2px solid transparent
    border-bottom-color eucalypt
    border-right-color eucalypt
    position absolute
    left 9px
    top 4px
    transform rotate(45deg)
    opacity 0
    transition all 0.2s

.settings-delete__actions
  display flex
  align-items center

.settings-delete__actions-link
  font-size 13px
  color eucalypt
  margin-left 20px
</style>
