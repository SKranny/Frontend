<template>
  <div class="like-comment" :class="{ active, fill }">
    <template v-if="comment">
      <comment-icon />

      <span v-if="quantity >= 1" :style="{ 'font-size': fontSize }">
        {{ quantity }}
      </span>
    </template>

    <div class="like-comment__checkbox" v-else>
      <input type="checkbox" :checked="active" :id="id" @change="onChange" />

      <label :for="id" :style="{ 'font-size': fontSize }">
        <template v-if="localQuantity >= 1">
          {{ localQuantity }}
        </template>
      </label>
    </div>
  </div>
</template>

<script>
import CommentIcon from '../Icons/CommentIcon.vue';
export default {
  name: 'Like',
  components: { CommentIcon },
  props: {
    quantity: Number,
    active: Boolean,
    fill: Boolean,
    width: {
      type: String,
      default: '12px',
    },
    height: {
      type: String,
      default: '12px',
    },
    fontSize: {
      type: String,
      default: '12px',
    },
    comment: Boolean,
    id: Number,
  },

  data: () => ({
    localQuantity: null,
    localActive: null,
  }),

  watch: {
    quantity(val) {
      this.localQuantity = val;
    },
    active(val) {
      this.localActive = val;
    },
  },

  mounted() {
    this.localQuantity = this.quantity;
    this.localActive = this.active;
  },

  methods: {
    onChange() {
      this.$emit('liked', this.localActive);
      if (this.localActive) this.localQuantity--;
      else this.localQuantity++;
      this.localActive = !this.localActive;
    },
  },
};
</script>

<style lang="stylus">
@import '../assets/stylus/base/vars.styl'

.like-comment
  display flex
  align-items center
  cursor pointer

  &:hover
    svg
      fill wild-watermelon

      path
        stroke wild-watermelon

  &.fill
    &:hover
      svg
        fill wild-watermelon

        path
          stroke wild-watermelon

    svg
      fill silver-sand

      path
        stroke silver-sand

  &.active
    &:hover
      svg
        fill transparent

    svg
      fill wild-watermelon

      path
        stroke wild-watermelon

    span
      color wild-watermelon

  span
    font-weight 600
    color #AEAEBD
    margin-left 5px

.like-comment__checkbox
  input
    width 0.1px
    height 0.1px
    opacity 0
    overflow hidden
    position absolute
    z-index -1

    &:checked
      & + label
        background-image url('/static/img/like-active.svg')
        color wild-watermelon

  label
    width 18px
    height 16px
    display block
    background url('/static/img/like.svg') center no-repeat
    background-size 18px
    padding-left 25px
    font-weight 600
    color #AEAEBD
    cursor pointer
</style>
