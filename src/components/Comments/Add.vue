<template>
  <form
    action="#"
    class="comment-add"
    :class="{ 'is-subcomment': isSubcomment }"
    @submit.prevent="onSubmitComment"
  >
    <div class="comment-add__pic" v-if="getInfo.photo">
      <img :src="getInfo.photo" :alt="getInfo.firstName" />
    </div>

    <div class="comment-add__pic" v-else>
      <div>{{ getInfo.firstName[0] + ' ' + getInfo.lastName[0] }}</div>
    </div>

    <input
      type="text"
      class="comment-add__input"
      :placeholder="isSubcomment ? 'Написать ответ...' : 'Написать комментарий...'"
      ref="addInput"
      v-model="commentText"
    />
  </form>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'CommentAdd',
  props: {
    value: String,
    id: [Number, String],
    parentId: Number,
    isSubcomment: {
      type: Boolean,
      default: false,
    },
  },
  expose: ['setFocus'],

  computed: {
    ...mapGetters('profile/info', ['getInfo']),
    commentText: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  methods: {
    onSubmitComment() {
      this.$emit('submited');
    },

    setFocus() {
      this.$refs.addInput.focus();
    },
  },
};
</script>

<style lang="stylus">
.comment-add
  display flex
  align-items center
  height 60px
  border-bottom 1px solid #e7e7e7
  margin-bottom 20px

  &.is-subcomment
    border-top 1px solid #e7e7e7
    border-bottom none
    margin-top 20px

.comment-add__pic
  width 36px
  height 36px
  border-radius 50%
  overflow hidden
  margin-right 15px
  flex none
  background-color #e6f4eb

  img
    display flex
    align-items center
    justify-content center
    width 100%
    height 100%
    object-fit cover

  div
    display flex
    align-items center
    justify-content center
    width 100%
    height 100%
    object-fit cover

.comment-add__input
  font-size 13px
  line-height 21px
  color #6A6A80
  display block
  width 100%

  &::placeholder
    color #B0B0BC

.comment-add__icon
  cursor pointer

  &+&
    margin-left: 10px

  &.photo
    .simple-svg-wrapper
      width: 22px
      height: 22px

  &.add
    margin-top: -5px

    .simple-svg-wrapper
      width: 15px
      height: 15px
</style>
