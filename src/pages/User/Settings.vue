<template>
  <div class="settings inner-page">
    <h1 class="settings__title">{{ activeComponent.text }}</h1>
    <div class="settings__wrap">
      <div class="inner-page__main">
        <component :is="activeComponent.component" />
      </div>
      <div class="inner-page__aside">
        <settings-sidebar v-model="activeComponent.component" @change-component="onChange" />
      </div>
    </div>
  </div>
</template>

<script>
import SettingsMain from '@/components/Settings/Main';
import SettingsPush from '@/components/Settings/Push';
import SettingsSecurity from '@/components/Settings/Security';
import SettingsDelete from '@/components/Settings/Delete';
import SettingsSidebar from '@/components/Settings/Sidebar';

export default {
  name: 'Settings',
  components: {
    SettingsMain,
    SettingsPush,
    SettingsSecurity,
    SettingsDelete,
    SettingsSidebar,
  },

  data: () => ({
    activeComponent: { component: 'settings-main', text: 'Основные' },
  }),

  methods: {
    onChange(item) {
      this.activeComponent = item;
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.settings
  display block

  @media (max-width breakpoint-xl)
    .inner-page__aside
      display block
      max-width 100%

    .inner-page__main
      margin-right 0

.settings__title
  font-family font-exo
  font-weight 200
  font-size 30px
  margin-bottom 20px
  color #000

  @media (max-width breakpoint-xl)
    display none

.settings__wrap
  display flex

  @media (max-width breakpoint-xl)
    flex-direction column-reverse
</style>
