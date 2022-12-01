<template>
  <div class="admin-sidebar">
    <ul class="admin-sidebar__list">
      <li
        class="admin-sidebar__item"
        v-for="item in list"
        :key="item.id"
        :class="{ active: item.id === value }"
        @click="changeFilter(item.id)"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AdminSidebar',
  props: {
    value: String,
    list: {
      type: Array,
      default: () => [
        { text: 'Все', id: 'all' },
        { text: 'Активные', id: 'active' },
        { text: 'Заблокированные', id: 'blocked' },
      ],
    },
  },
  methods: {
    changeFilter(id) {
      this.$emit('change-filter', id);
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.admin-sidebar
  background #fff
  box-shadow standart-boxshadow
  padding 0 40px

  @media (max-width breakpoint-xl)
    background transparent
    box-shadow none
    padding 0

.admin-sidebar__list
  @media (max-width breakpoint-xl)
    display flex

.admin-sidebar__item
  color rgba(#000, 0.5)
  font-size 15px
  padding 30px 0
  cursor pointer

  &+&
    border-top 1px solid #e6e6e6

  &.active
    cursor default
    font-weight 600
    color eucalypt

  @media (max-width breakpoint-xl)
    padding 0
    color steel-gray
    display block
    padding 20px
    flex auto

    &+&
      border-top none
</style>
