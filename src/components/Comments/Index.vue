<template>
  <div class="comments" :class="{ 'comments--admin': admin }">
    <div class="comments__add" v-if="!admin">
      <comment-add ref="addComment" :id="id" v-model="commentText" @submited="onSubmitComment" />
    </div>

    <h4 class="comments__title" v-if="info">
      <span>Комментарии ({{ info.totalElements }})</span>
    </h4>

    <div class="comments__list" v-if="getInfo && info">
      <comment-block
        v-for="i in info.value"
        :admin="admin"
        :key="i.id"
        :info="i"
        :edit="getInfo.id === i.authorId"
        :deleted="getInfo.id === i.authorId"
        @edit-comment="onEditMain"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CommentBlock from '@/components/Comments/Block';
import CommentAdd from '@/components/Comments/Add';

export default {
  name: 'Comments',
  components: { CommentBlock, CommentAdd },
  props: {
    admin: Boolean,
    info: Object,
    id: Number,
    edit: Boolean,
    deleted: Boolean,
  },
  data: () => ({
    commentText: '',
    commentEdit: false,
    commentEditInfo: null,
  }),
  computed: {
    ...mapGetters('profile/info', ['getInfo']),
    showText() {
      return this.isOpenComments ? 'скрыть' : 'показать';
    },
  },

  methods: {
    ...mapActions('profile/comments', ['commentActions']),

    onEditMain({ commentInfo, commentText }) {
      this.commentEdit = true;
      this.commentText = commentText;
      this.commentEditInfo = commentInfo;
      this.$refs.addComment.$refs.addInput.focus();
    },
    onSubmitComment() {
      this.commentActions({
        edit: this.commentEdit,
        postId: this.id,
        text: this.commentText,
        id: this.commentEdit ? this.commentEditInfo.id : null,
      }).then(() => {
        this.commentText = '';
        this.commentEdit = false;
        this.commentEditInfo = null;
      });
    },
    computed() {
      this.info.subComments = this.info.subСomments ? this.info.subComments : [];
    },
    async showMore() {
      await this.commentsById({ postId: this.info.id, currentPage: this.info.comments.page });
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.comments
  &.open
    .comment-block, .comment-block__reviews
      display block

  &.comments--admin
    padding-bottom 40px

    .comment-block
      &:first-child
        display none

      .edit
        display none

.comments__title
  display flex
  align-items center
  margin-bottom 15px

  span
    font-family font-exo
    font-weight bold
    font-size 15px
    color #000
    display block
    margin-right 5px

.comments__show
  font-size 13px
  color eucalypt

.comments__list
  width 100%
  max-width 550px
  padding-left 30px
</style>
