<template>
  <div class="comment-main">
    <template v-if="info.is_deleted">
      <p class="comment-main__text">
        <span>Комментарий удален.</span>

        <a href="#" @click="onRecoverComment">Восстановить</a>
      </p>
    </template>

    <template v-else>
      <div class="edit edit--small" v-if="edit || deleted">
        <div class="edit__icon" v-if="deleted" @click="onDeleteComment">
          <simple-svg :filepath="'/static/img/delete-news.svg'" />
        </div>

        <div class="edit__icon" v-if="edit" @click="editComment">
          <simple-svg :filepath="'/static/img/edit.svg'" />
        </div>
      </div>

      <router-link
        class="comment-main__pic"
        :to="{ name: 'ProfileId', params: { id: info.authorId } }"
      >
        <img
          class="comment-add__pic"
          v-if="info.author.photo"
          :src="info.author.photo"
          :alt="info.author.firstName"
        />

        <div v-else class="comment-add__pic">
          {{ info.author.firstName[0] + ' ' + info.author.lastName[0] }}
        </div>
      </router-link>

      <div class="comment-main__main">
        <router-link
          class="comment-main__author"
          :to="{ name: 'ProfileId', params: { id: info.author.id } }"
        >
          {{ info.author.firstName + ' ' + info.author.lastName }}
        </router-link>

        <p class="comment-main__text">{{ info.commentText }}</p>

        <div class="comment-main__actions">
          <span class="comment-main__time">{{ info.time | moment('from') }}</span>

          <template v-if="!admin && !isSubcomment">
            <a class="comment-main__review" href="#" @click.prevent="$emit('answer-comment')">
              Ответить
            </a>
            <like-comment
              fill="fill"
              :quantity="info.likeAmount"
              :active="info.myLike"
              :id="info.id"
              @liked="likeAction"
            />
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import LikeComment from '@/components/LikeComment';

export default {
  name: 'CommentMain',
  components: { LikeComment },
  props: {
    admin: Boolean,
    info: Object,
    edit: Boolean,
    deleted: Boolean,
    isSubcomment: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      like: this.info.myLike,
    };
  },
  methods: {
    ...mapActions('global/likes', ['putLike', 'deleteLike']),
    likeAction() {
      if (this.like) {
        this.deleteLike({
          itemId: this.info.id,
          postId: this.info.postId,
          type: 'COMMENT',
        });
        return;
      }

      this.putLike({
        itemId: this.info.id,
        postId: this.info.postId,
        type: 'COMMENT',
      });
    },

    onDeleteComment() {
      if (this.isSubcomment) this.$emit('delete-comment', this.info.id, this.info.parentId);
      else this.$emit('delete-comment', this.info.id);
    },

    editComment() {
      this.$emit('edit-comment', {
        id: this.info.id,
        commentText: this.info.commentText,
        parentId: this.info.parentId,
      });
    },

    onRecoverComment() {
      this.$emit('recover-comment', this.info.id);
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.comment-main
  display flex
  font-size 13px
  position relative

.comment-main__pic
  flex none
  align-self flex-start
  width 40px
  height 40px
  border-radius 50%
  overflow hidden
  margin-right 10px

  img
    width 100%
    height 100%
    object-fit cover

.comment-main__main
  width 100%

.comment-main__author
  font-weight 600
  color #000
  margin-bottom 5px
  display block

.comment-main__text
  line-height 21px
  color #6A6A80
  margin-bottom 5px

.comment-main__actions
  display flex
  align-items center

.comment-main__time
  color santas-gray
  display block
  margin-right 20px

.comment-main__review
  color eucalypt
  margin-right auto

.comment-add__pic
  display flex
  align-items center
  justify-content center
  width 100%
  height 100%
  object-fit cover
</style>
