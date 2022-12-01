<template>
  <div class="aside-filter">
    <h2 class="aside-filter__title">Настройки</h2>

    <ul class="aside-filter__list">
      <li
        class="aside-filter__item"
        v-for="item in list"
        :key="item.component"
        :class="{ active: item.component === value }"
        @click="changeComponent(item)"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SettingsSidebar',
  props: {
    value: String,
  },

  data: () => ({
    list: [
      { component: 'settings-main', text: 'Основные' },
      { component: 'settings-push', text: 'Настройка оповещений' },
      { component: 'settings-security', text: 'Безопасность' },
      { component: 'settings-delete', text: 'Удалить профиль' },
    ],
  }),

  methods: {
    changeComponent(item) {
      this.$emit('change-component', item);
    },
  },
};
</script>
