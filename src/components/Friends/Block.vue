<template>
  <div class="friends-block">
    <div class="friends-block__img">
      <img v-if="info.photo" :src="info.photo" :alt="info.firstName" />
      <img v-else src="/static/img/avatar.png" :alt="info.firstName" />
    </div>

    <div class="friends-block__info">
      <router-link class="friends-block__name" :to="{ name: 'ProfileId', params: { id: info.id } }">
        {{ info.firstName }}
        {{ info.lastName }}
        <span class="user-status" :class="{ online, offline: !online }">{{ statusText }}</span>
      </router-link>

      <span class="friends-block__age-city" v-if="moderator">модератор</span>

      <span class="friends-block__age-city" v-else-if="info.birthDate && info.country">
        {{ info.birthDate | moment('from', true) }},
        {{ info.city ? info.city.title : info.country.title }}
      </span>

      <span class="friends-block__age-city" v-else>профиль не заполнен</span>
    </div>

    <div class="friends-block__actions">
      <template v-if="moderator">
        <div class="friends-block__actions-block" v-tooltip.bottom="'Редактировать'">
          <simple-svg :filepath="'/static/img/edit.svg'" />
        </div>

        <div
          class="friends-block__actions-block"
          v-tooltip.bottom="'Удалить из списка'"
          @click="openModal('deleteModerator')"
        >
          <simple-svg :filepath="'/static/img/delete.svg'" />
        </div>
      </template>

      <template v-else-if="admin">
        <div
          class="friends-block__actions-block"
          v-tooltip.bottom="'Разблокировать'"
          v-if="blocked || info.isBlocked"
        >
          <simple-svg class="filter-green" :filepath="'/static/img/security-system-unlock.svg'" />
        </div>

        <div class="friends-block__actions-block" v-tooltip.bottom="'Заблокировать'" v-else>
          <simple-svg :filepath="'/static/img/unblocked.svg'" />
        </div>
      </template>

      <template v-else>
        <div
          v-if="subscribeButton"
          class="friends-block__actions-block message"
          v-tooltip.bottom="'Подписаться'"
          @click="subscribe(info.id)"
        >
          <simple-svg :filepath="'/static/img/sidebar/admin/comments.svg'" />
        </div>

        <div
          v-if="acceptButton"
          class="friends-block__actions-block message"
          v-tooltip.bottom="'Принять запрос'"
          @click="acceptFriendRequest(info.id)"
        >
          <simple-svg class="accept" :filepath="'/static/img/add.svg'" />
        </div>

        <div
          class="friends-block__actions-block message"
          v-tooltip.bottom="'Написать сообщение'"
          @click="sendMessage(info.id)"
        >
          <simple-svg :filepath="'/static/img/sidebar/im.svg'" />
        </div>

        <div
          class="friends-block__actions-block delete"
          v-tooltip.bottom="'Удалить'"
          @click="openModal('delete')"
          v-if="friend"
        >
          <simple-svg :filepath="'/static/img/delete.svg'" />
        </div>

        <div
          class="friends-block__actions-block add"
          v-tooltip.bottom="'Добавить в друзья'"
          @click="addToFriend(info.id)"
          v-else
        >
          <simple-svg :filepath="'/static/img/friend-add.svg'" />
        </div>

        <div
          class="friends-block__actions-block"
          v-tooltip.bottom="'Разблокировать'"
          v-if="blocked || info.isBlocked || info.statusCode === 'BLOCKED'"
          @click="openModal('unblock')"
        >
          <simple-svg class="filter-green" :filepath="'/static/img/security-system-unlock.svg'" />
        </div>

        <div
          v-else
          class="friends-block__actions-block"
          v-tooltip.bottom="'Заблокировать'"
          @click="openModal('block')"
        >
          <simple-svg :filepath="'/static/img/unblocked.svg'" />
        </div>
      </template>
    </div>

    <modal v-model="modalShow">
      <p v-if="modalText">{{ modalText }}</p>
      <template slot="actions">
        <button-hover @click.native="onConfrim(info.id)">Да</button-hover>
        <button-hover variant="red" bordered="bordered" @click.native="closeModal">
          Отмена
        </button-hover>
      </template>
    </modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'FriendsBlock',
  components: { Modal },
  props: {
    friend: Boolean,
    admin: Boolean,
    blocked: Boolean,
    moderator: Boolean,
    subscribeButton: {
      type: Boolean,
      default: false,
    },
    acceptButton: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: () => ({
        firstName: 'Артем',
        lastName: 'Иващенко',
        birthDate: 1559751301818,
        town_id: 1,
        photo: '/static/img/user/1.jpg',
        id: 124,
      }),
    },
  },
  data: () => ({
    modalShow: false,
    modalType: 'delete',
  }),
  computed: {
    ...mapGetters('profile/dialogs', ['dialogs']),
    statusText() {
      return this.info.isOnline ? 'онлайн' : 'не в сети';
    },
    online() {
      return this.info.isOnline;
    },
    modalText() {
      let text = '';
      if (this.modalType === 'delete') {
        text = `Вы уверены, что хотите удалить пользователя ${
          this.info.firstName + ' ' + this.info.lastName
        } из друзей?`;
      } else if (this.modalType === 'deleteModerator') {
        text = `Вы уверены, что хотите удалить ${
          this.info.firstName + ' ' + this.info.lastName
        } из списка модераторов?`;
      } else if (this.modalType === 'block') {
        text = `Вы уверены, что хотите заблокировать пользователя ${
          this.info.firstName + ' ' + this.info.lastName
        }?`;
      } else if (this.modalType === 'unblock') {
        text = `Вы уверены, что хотите разблокировать  пользователя ${
          this.info.firstName + ' ' + this.info.lastName
        }?`;
      }
      return text;
    },
  },
  methods: {
    ...mapActions('profile/friends', ['apiAddFriends', 'apiDeleteFriends', 'apiSubscribe']),

    ...mapActions('profile/dialogs', ['openDialog']),

    ...mapActions('users/actions', ['apiBlockUser', 'apiUnblockUser']),

    acceptFriendRequest(id) {
      if (this.info.statusCode === 'FRIEND_TO') {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'Вы уже отправляли запрос на добавления в друзья этому пользователю!',
        });
        return;
      }
      if (this.info.statusCode === 'FRIEND') {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'Этот пользователь уже является вашим другом!',
        });
        return;
      }
      this.apiAddFriends({ id, isApprove: true });
    },

    addToFriend(id) {
      if (this.info.statusCode === 'FRIEND_TO') {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'Вы уже отправляли запрос на добавления в друзья этому пользователю!',
        });
        return;
      }
      if (this.info.statusCode === 'FRIEND') {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'Этот пользователь уже является вашим другом!',
        });
        return;
      }
      if (this.info.statusCode === 'BLOCKED') {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'Вы заблокировали этого пользователя!',
        });
        return;
      }
      if (this.info.statusCode === 'SUBSCRIBED') {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'Этот пользователь среди ваших подписчиков, для добавления в друзья необходимо удалить его из списка подписчиков!',
        });
        return;
      }
      if (
        this.info.statusCode !== 'NONE' &&
        this.info.statusCode !== null &&
        this.info.statusCode == 'WATCHING'
      ) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'У вас уже есть отношения с этим пользователем, чтобы подписаться необходимо остановить другие отношения!',
        });
        return;
      }
      this.apiAddFriends({ id });
    },

    subscribe(id) {
      console.log('subscribe', this.info.statusCode);
      if (this.info.statusCode === 'WATCHING') {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'Вы уже подписаны на этого пользователя!',
        });
        return;
      }
      if (
        this.info.statusCode !== 'NONE' &&
        this.info.statusCode !== null &&
        this.info.statusCode !== 'WATCHING'
      ) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'У вас уже есть отношения с этим пользователем, чтобы подписаться необходимо остановить другие отношения!',
        });
        return;
      }
      this.apiSubscribe(id);
    },

    closeModal() {
      this.modalShow = false;
    },

    openModal(id) {
      this.modalType = id;
      this.modalShow = true;
    },

    sendMessage(userId) {
      this.$router.push({ name: 'ImChat', params: { activeDialogId: userId } });
    },

    async onConfrim(id) {
      if (this.modalType === 'delete') {
        this.apiDeleteFriends(id).then(() => this.closeModal());
      } else if (this.modalType === 'deleteModerator') {
        console.log('delete moderator');
      } else if (this.modalType === 'block') {
        this.apiBlockUser(id).then(() => this.closeModal());
      } else if (this.modalType === 'unblock') {
        this.apiUnblockUser(id).then(() => this.closeModal());
      }
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.accept path
  fill sea-green

.friends-block
  align-items center
  background #fff
  box-shadow standart-boxshadow
  padding 20px
  width 100%
  max-width calc(90% - 20px)
  display inline-flex
  margin 0 10px 20px
  border-radius 3%
  min-width 300px

.friends-block__img
  width 65px
  height 65px
  border-radius 50%
  overflow hidden
  margin-right 30px
  flex none

  @media (max-width breakpoint-xxl)
    margin-right 10px

  img
    object-fit cover
    width 100%
    height 100%

.friends-block__info
  margin-right auto

.friends-block__name
  font-weight 600
  font-size 18px
  line-height 27px
  color steel-gray
  display block

  @media (max-width breakpoint-xxl)
    font-size 14px

.friends-block__age-city
  font-size 15px
  line-height 22px
  color #5A5A5A

  @media (max-width breakpoint-xxl)
    font-size 13px

.friends-block__actions
  display flex
  align-items center

.friends-block__actions-block
  cursor pointer

  @media (max-width breakpoint-xxl)
    & + &
      margin-left 5px

  & + &
    margin-left 10px

  &.message
    margin-top 5px

    .simple-svg
      fill eucalypt

  &.delete
    margin-top 3px

  &.add
    margin-top 2px
    margin-left 15px

  .simple-svg-wrapper
    width 20px
    height 20px
</style>
