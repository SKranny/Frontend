<template>
  <div class="admin-search">
    <div class="sdmin-search__icon">
      <div class="simple-svg-wrapper">
        <search-icon />
      </div>

      <input
        type="text"
        class="admin-search__input"
        placeholder="Начните набирать, что бы найти..."
        :value="value"
        @input="changeValue($event.target.value)"
      />
    </div>
  </div>
</template>

<script>
import SearchIcon from '../../Icons/SearchIcon.vue';
export default {
  name: 'AdminSearch',
  components: { SearchIcon },
  props: {
    value: String,
  },
  methods: {
    changeValue(value) {
      this.$emit('change-value', value);
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.admin-search
  height 62px
  background #FFFFFF
  box-shadow 0 2px 8px rgba(0, 0, 0, 0.08)
  display flex
  align-items center
  padding 0 40px

.admin-search__icon
  margin-right 15px

  .simple-svg-wrapper
    width 16px
    height 16px


  .simple-svg
    stroke #D6D6E2
    fill transparent


.admin-search__input
  color steel-gray
  font-size 13px

  &::placeholder
    color #B0B0BC
</style>
