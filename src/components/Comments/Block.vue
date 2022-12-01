<template>
  <div class="comment-block" :class="{ 'show-comments': isShowSubComments }">
    <template v-if="admin">
      <div class="edit" v-tooltip.bottom="'Разблокировать'" v-if="blocked">
        <simple-svg :filepath="'/static/img/unblocked.svg'" />
      </div>

      <div class="edit" v-tooltip.bottom="'Заблокировать'" v-else>
        <simple-svg :filepath="'/static/img/blocked.svg'" />
      </div>
    </template>

    <comment-main
      :admin="admin"
      :info="info"
      :edit="edit"
      :deleted="deleted"
      @answer-comment="onAnswerMain"
      @edit-comment="onEditMain"
      @delete-comment="onDeleteComment"
      @recover-comment="onRecoverComment"
    />

    <div class="comment-block__reviews" v-if="!info.is_deleted">
      <a
        class="comment-block__reviews-show"
        href="#"
        v-if="!currentSubComents && info.commentsCount"
        @click.prevent="showSubComments"
      >
        показать {{ info.commentsCount }} {{ answerText }}
      </a>

      <div class="comment-block__reviews-list" v-show="currentSubComents">
        <div v-if="currentSubComents">
          <comment-main
            :isSubcomment="true"
            :admin="admin"
            v-for="i in currentSubComents.value"
            :key="i.id"
            :info="i"
            :edit="getInfo.id === i.author.id"
            :deleted="getInfo.id === i.author.id"
            @answer-comment="onAnswerSub"
            @edit-comment="onEditSub"
            @delete-comment="onDeleteSubComment"
            @recover-comment="onRecoverSubComment"
          />
        </div>

        <comment-add
          :isSubcomment="true"
          v-if="!admin"
          ref="addComment"
          :id="info.postId"
          :parent-id="info.parentId"
          v-model="commentText"
          @submited="onSubmitComment"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CommentMain from '@/components/Comments/Main';
import CommentAdd from '@/components/Comments/Add';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'CommentBlock',
  components: { CommentMain, CommentAdd },
  props: {
    admin: Boolean,
    blocked: Boolean,
    info: Object,
    edit: Boolean,
    deleted: Boolean,
  },
  data: () => ({
    isShowSubComments: false,
    commentText: '',
    commentEdit: false,
    commentEditId: null,
    commentEditParentId: null,
  }),
  computed: {
    ...mapGetters('profile/info', ['getInfo']),
    ...mapState('profile/comments', ['subComments']),

    answerText() {
      if (!this.info) return 'ответ';
      return this.info.commentsCount && this.info.commentsCount > 1 ? 'ответа' : 'ответ';
    },

    currentSubComents() {
      return this.subComments[this.info.id];
    },
  },

  methods: {
    ...mapActions('profile/comments', [
      'commentActions',
      'deleteComment',
      'recoverComment',
      'commentsById',
    ]),

    async showSubComments() {
      if (this.isShowSubComments) return;
      await this.commentsById({ postId: this.info.postId, commentId: this.info.id });
      this.isShowSubComments = true;
    },

    onAnswerSub() {
      this.$refs.addComment.setFocus();
    },

    async onAnswerMain() {
      await this.showSubComments();
      this.onAnswerSub();
    },

    onEditMain({ commentText }) {
      this.$emit('edit-comment', {
        commentInfo: this.info,
        commentText,
      });
    },

    onDeleteComment(id) {
      this.deleteComment({
        id,
        postId: this.info.postId,
      });
    },

    onDeleteSubComment(id, parentId) {
      this.deleteComment({
        id,
        postId: this.info.postId,
        parentId,
      });
    },

    onRecoverComment(id) {
      this.recoverComment({
        id,
        postId: this.info.postId,
      });
    },

    onRecoverSubComment(id) {
      this.recoverComment({
        id,
        postId: this.info.postId,
        isSubComment: true,
      });
    },

    onEditSub({ parentId, id, commentText }) {
      this.commentEdit = true;
      this.commentText = commentText;
      this.commentEditId = id;
      this.commentEditParentId = parentId;
      this.onAnswerSub();
    },

    onSubmitComment() {
      this.commentActions({
        isSubcomment: true,
        edit: this.commentEdit,
        postId: this.info.postId,
        parentId: this.commentEdit ? this.commentEditParentId : this.info.id,
        text: this.commentText,
        id: this.commentEditId,
      }).then(() => {
        this.commentText = '';
        this.commentEdit = false;
        this.commentEditInfo = null;
        this.commentEditParentId = null;
      });
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.comment-block
  padding-top 20px
  position relative

  & + &
    margin-top 20px

    &:after
      display block

  &.show-comments
    & + .comment-block
      margin-top 0

      &:after
        width 100%

    .comment-block__reviews
      border-top 1px solid #e7e7e7
      padding-top 40px

  .comment-add
    height 50px


.comment-block__reviews
  margin-top 15px
  max-width calc(100% - 50px)
  margin-left auto

.comment-block__reviews-show
  color eucalypt
  font-size 13px
  font-weight 600
  display flex
  align-items center

  &:before
    content ''
    display block
    width 7px
    height 7px
    margin-right 7px
    border 1.5px solid transparent
    border-radius 2px
    border-top-color eucalypt
    border-right-color eucalypt
    transform rotate(45deg)

.comment-block__reviews-list
  .comment-main + .comment-main
    margin-top 15px
    padding-top 15px
    border-top 1px solid #e7e7e7

  .comment-main__pic
    width 30px
    height 30px
</style>
