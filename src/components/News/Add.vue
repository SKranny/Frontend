<template>
  <div class="news-add" :class="{ open: isOpen }">
    <div class="news-add__mask" v-if="!isOpen">
      <template v-if="getInfo">
        <div class="news-add__pic imgDiv" v-if="user">
          <img
            v-if="getInfo.photo"
            class="avatar"
            :src="getInfo.photo"
            :alt="getInfo.firstName[0] + ' ' + getInfo.lastName[0]"
          />

          <div class="avatar" v-else>
            {{ getInfo.firstName[0] + ' ' + getInfo.lastName[0] }}
          </div>
        </div>
      </template>

      <span class="news-add__placeholder">Поделитесь новостью...</span>

      <div class="news-add__block add" @click.prevent="openForm">
        <add-icon />
      </div>
    </div>

    <add-form v-else @submit-complete="closeForm" @close-form="closeForm" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AddIcon from '@/Icons/AddIcon.vue';
import AddForm from '@/components/News/AddForm';

export default {
  name: 'NewsAdd',
  components: { AddForm, AddIcon },
  props: {
    user: Boolean,
  },
  data: () => ({
    isOpen: false,
  }),
  computed: {
    ...mapGetters('profile/info', ['getInfo']),
  },
  methods: {
    openForm() {
      this.isOpen = true;
    },
    closeForm() {
      this.isOpen = false;
    },
  },
};
</script>

<style lang="stylus" scoped>
.avatar
  display flex
  align-items center
  justify-content center
  width 100%
  height 100%
  object-fit cover

.imgDiv
  background-color #bcdfc7
</style>
