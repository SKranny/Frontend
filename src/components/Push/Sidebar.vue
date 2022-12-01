<template>
  <div class="aside-filter-notes">
    <h2 class="aside-filter-notes__title">Оповещения</h2>

    <ul class="aside-filter-notes__list">
      <li
        class="aside-filter-notes__item"
        v-for="item in list"
        :key="item"
        :class="{ active: item === value }"
        @click="changePushSidebar(item)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PushSidebar',
  props: {
    value: String,
  },

  data: () => ({
    list: ['Все', 'Комментарии', 'Друзья'],
  }),

  methods: {
    changePushSidebar(item) {
      this.$emit('change-push-sidebar', item);
    },
  },
};
</script>
