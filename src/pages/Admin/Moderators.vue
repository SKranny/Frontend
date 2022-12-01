<template>
  <div class="admin-moderators inner-page admin">
    <h2 class="admin__title">Администраторы и модераторы</h2>

    <div class="admin__wrap">
      <div class="inner-page__main">
        <a href="#" class="admin-moderators__link">Добавить</a>

        <friends-block moderator />
        <friends-block moderator />
      </div>

      <div class="inner-page__aside">
        <admin-sidebar v-model="filter" :list="list" @change-filter="onChangeFilter" />
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '@/components/Admin/Sidebar';
import FriendsBlock from '@/components/Friends/Block';
export default {
  name: 'AdminModerators',
  components: { AdminSidebar, FriendsBlock },

  data: () => ({
    filter: 'all',
    list: [
      { text: 'Все', id: 'all' },
      { text: 'Модераторы', id: 'moderators' },
      { text: 'Администраторы', id: 'admins' },
    ],
  }),

  methods: {
    onChangeFilter(id) {
      this.filter = id;
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.admin-moderators
  .inner-page__main
    position relative

.admin-moderators__link
  font-size 13px
  color #21A45D
  position absolute
  right 15px
  top -40px
</style>
