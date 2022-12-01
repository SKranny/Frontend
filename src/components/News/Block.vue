<!-- eslint-disable vue/html-indent -->
<template>
  <div class="news-block" :class="{ deffered, 'news-block--admin': admin }">
    <add-form
      v-if="isEditNews"
      :info="info"
      edit="edit"
      :deffered="deffered"
      @submit-complete="toggleEditNews"
      @close-form="toggleEditNews"
    />

    <template v-else>
      <template v-if="!admin">
        <div class="edit">
          <div class="edit__icon" v-if="deleted" @click="deleteNews">
            <delete-news-icon />
          </div>

          <div class="edit__icon" v-if="edit" @click="toggleEditNews">
            <edit-icon />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="edit" v-tooltip.bottom="'Разблокировать'" v-if="blocked">
          <simple-svg :filepath="'/static/img/unblocked.svg'" />
        </div>

        <div class="edit" v-tooltip.bottom="'Заблокировать'" v-else>
          <simple-svg :filepath="'/static/img/blocked.svg'" />
        </div>
      </template>

      <div class="news-block__deffered" v-if="deffered">
        <span class="news-block__deffered-text">
          Дата и время публикации:
          {{ info.time }} (будет опубликован {{ info.time }})
        </span>
      </div>

      <div class="news-block__author" v-if="!deffered">
        <router-link class="news-block__author-pic" :to="routerLink(info.author.id)">
          <div class="main-layout__user-pic">
            <img
              v-if="info.author.photo"
              :src="info.author.photo"
              :alt="info.author.firstName[0] + ' ' + info.author.lastName[0]"
            />

            <div v-else>
              {{ info.author.firstName[0] + ' ' + info.author.lastName[0] }}
            </div>
          </div>
        </router-link>

        <div class="news-block__author-info">
          <router-link class="news-block__author-name" :to="routerLink(info.author.id)">
            {{ info.author.firstName + ' ' + info.author.lastName }}
          </router-link>

          <span class="news-block__author-time">
            Опубликован {{ info.time | moment('from') }}
          </span>

          <span class="news-block__changed-time" v-if="info.timeChanged">
            Изменен {{ info.timeChanged | moment('from') }}
          </span>
        </div>
      </div>

      <div class="news-block__content">
        <div class="news-block__content-main">
          <h3 class="news-block__content-title">{{ info.title }}</h3>

          <div v-if="info.imagePath">
            <img class="post-image" :src="info.imagePath" :alt="'photo'" />
          </div>

          <p
            class="news-block__content-text"
            ref="text"
            :class="{ lotText: isLotText, open: openText }"
            v-html="info.postText"
          />

          <a class="news-block__content-more" href="#" v-if="isLotText" @click.prevent="toggleText">
            <template v-if="openText">Скрыть</template>
            <template v-else>Читать весь пост</template>
          </a>
        </div>

        <ul class="news-block__content-tags" v-if="info.tags && info.tags.length > 0">
          <li class="news-block__content-tag" v-for="(tag, index) in info.tags" :key="index">
            <router-link :to="{ name: 'Search', query: { tab: 'news', tags: tag } }">
              {{ '#' + tag }}
            </router-link>
          </li>
        </ul>
      </div>

      <div class="news-block__actions" v-if="!deffered && !admin">
        <div class="news-block__actions-block">
          <like-comment
            :quantity="info.likeAmount"
            width="16px"
            height="16px"
            font-size="15px"
            @liked="likeAction"
            :active="info.myLike"
            :id="info.id"
          />
        </div>

        <div
          class="news-block__actions-block news-block__comments-btn"
          @click="toggleComments"
          :title="!openCommnets ? 'Посмотреть комментарии' : 'Скрыть комментарии'"
        >
          <like-comment
            :quantity="info.commentsCount"
            width="16px"
            height="16px"
            font-size="15px"
            comment="comment"
          />
        </div>
      </div>

      <div class="news-block__comments" v-if="!deffered && openCommnets">
        <comments
          :admin="admin"
          :info="currentComments"
          :id="info.id"
          :edit="edit"
          :deleted="deleted"
        />

        <button-hover
          variant="fill"
          bordered="bordered"
          v-if="
            currentComments &&
            currentComments.totalPages !== 0 &&
            currentComments.page + 1 !== currentComments.totalPages
          "
          class="comments__more"
          @click.native="showMore"
        >
          Ещё комментарии
        </button-hover>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import DeleteNewsIcon from '../../Icons/DeleteNewsIcon.vue';
import EditIcon from '../../Icons/EditIcon.vue';
import AddForm from '@/components/News/AddForm';
import LikeComment from '@/components/LikeComment';
import Comments from '@/components/Comments/Index.vue';

export default {
  name: 'NewsBlock',
  components: { Comments, LikeComment, AddForm, DeleteNewsIcon, EditIcon },
  props: {
    info: {
      type: Object,
      default: () => ({
        title: 'Дизайн привычных вещей',
        post_text:
          'А вот и «Книга недели от Skillbox и МИФ».' +
          ' Сегодня делимся с вами книгой «Дизайн привычных вещей» автора Дональда Нормана.' +
          ' В ней Дональд рассказывает об основополагающих принципах, которым нужно следовать' +
          ' чтобы избежать проблем и превратить привычные вещи в приятные товары, доставляющие' +
          ' нам удовольствие А вот и «Книга недели от Skillbox и МИФ». Сегодня делимся с вами' +
          ' книгой «Дизайн привычных вещей» автора Дональда Нормана. В ней Дональд рассказывает' +
          ' об основополагающих принципах, которым нужно следовать, чтобы избежать проблем и' +
          ' превратить привычные вещи в приятные товары, доставляющие нам удовольствие',
        time: 1559751301818,
        likes: 44,
        id: 1,
        tags: ['tag1'],
        comments: {},
        author: '',
      }),
    },
    edit: Boolean,
    deffered: Boolean,
    admin: Boolean,
    blocked: Boolean,
    deleted: Boolean,
  },

  data: () => ({
    openCommnets: false,
    isLotText: false,
    openText: false,
    isEditNews: false,
    commnets: '',
  }),

  computed: {
    ...mapGetters('profile/info', ['getInfo']),
    ...mapState('profile/comments', ['comments']),

    currentComments() {
      return this.comments[this.info.id];
    },
  },

  mounted() {
    this.isLotText = this.$refs.text.offsetHeight > 100;
  },

  methods: {
    ...mapActions('global/likes', ['putLike', 'deleteLike']),
    ...mapActions('profile/feeds', ['deleteFeeds']),
    ...mapActions('users/info', ['deletePost']),
    ...mapActions('profile/comments', ['commentsById']),

    toggleText() {
      this.openText = !this.openText;
    },

    async toggleComments() {
      const isSetComments = !!this.currentComments;
      const currentPage = isSetComments ? this.currentComments.page : null;
      if (!isSetComments) await this.commentsById({ postId: this.info.id, currentPage });
      this.openCommnets = !this.openCommnets;
    },

    async showMore() {
      await this.commentsById({ postId: this.info.id, currentPage: this.currentComments.page });
    },

    likeAction(active) {
      if (active) this.deleteLike({ itemId: this.info.id, type: 'POST' });
      else this.putLike({ itemId: this.info.id, type: 'POST' });
    },

    toggleEditNews() {
      this.isEditNews = !this.isEditNews;
    },

    routerLink(infoAuthorId) {
      return this.getInfo.id === infoAuthorId
        ? { name: 'Profile' }
        : { name: 'ProfileId', params: { id: infoAuthorId } };
    },

    deleteNews() {
      this.deleteFeeds({
        id: this.getInfo.id,
        postId: this.info.id,
        route: this.$route.name,
      });
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.post-image
  width 400px

.news-block
  background #FFFFFF
  box-shadow standart-boxshadow
  padding 30px 40px 30px
  position relative
  border-radius 10px

  .edit
    top 30px

  &.deffered
    padding-bottom 20px

  &--admin
    .news-block__comments
      margin-top 20px
      margin-bottom 20px

  & + &
    margin-top 30px

  &__actions-block
    transition transform 200ms linear
    &:hover
      transform scale(1.2)

.news-block__deffered
  position relative
  height 45px
  margin-bottom 20px
  display flex

  &:after
    content ''
    display block
    position absolute
    left -40px
    right -40px
    bottom 0
    width calc(100% + 80px)
    height 2px
    background-color #e7e7e7

  @media (max-width breakpoint-xxl)
    &:after
      left -30px
      width calc(100% + 60px)

.news-block__deffered-text
  color #5F5E7A
  font-size 16px

.news-block__author
  margin-bottom 20px
  display flex
  align-items center

.news-block__author-pic
  width 60px
  height 60px
  overflow hidden
  margin-right 15px

  img
    width 100%
    height 100%
    object-fit cover

.news-block__author-name
  font-weight 600
  font-size 15px
  color #000
  display block
  margin-bottom 5px

.news-block__author-time
  font-size 13px
  color santas-gray

.news-block__changed-time
  position absolute
  top 7px
  right 20px
  font-size 13px
  font-style italic
  color santas-gray

.news-block__content
  display flex

.news-block__content-main
  padding-bottom 20px
  border-bottom 1px solid #E7E7E7
  width 100%

.news-block__content-title
  font-family font-exo
  font-weight bold
  font-size 24px
  color #000
  margin-bottom 10px

.news-block__content-text
  font-size 15px
  line-height 25px
  color storm-gray
  overflow hidden
  text-align justify
  padding-right 1em
  position relative

  &:before
    content '\02026'
    position absolute
    right 0
    bottom 0

  &:after
    content ''
    position absolute
    right 0
    width 1em
    height 1em
    margin-top 0.2em
    background white

  &.lotText
    max-height 100px

  &.open
    max-height 100%
    padding-right 0

.news-block__content-more
  display inline-block
  margin-top 10px
  font-size 13px
  color eucalypt

.news-block__content-tags
  background-color #F5F7FB
  padding 20px
  max-width 230px
  flex none
  align-self flex-start
  margin-left 40px

  @media (max-width breakpoint-xxl)
    margin-left 20px

.news-block__content-tag
  color eucalypt
  font-size 13px
  line-height 22px
  display inline-block
  margin 0 7px

.news-block__actions
  display flex
  align-items center
  margin 25px 0

.news-block__actions-block
  & + &
    margin-left 30px
</style>
