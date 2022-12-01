<template>
  <div class="profile-info" v-if="info">
    <div class="profile-info__pic">
      <div class="profile-info__img" :class="{ offline: !online && !me }">
        <img
          v-if="info.photo"
          :src="info.photo"
          :alt="info.firstName[0] + ' ' + info.lastName[0]"
        />

        <img v-else src="/static/img/avatar.png" alt="avatar placeholder" />
      </div>

      <div class="profile-info__actions" v-if="!me">
        <button-hover :disable="blocked" @click.native="onSentMessage">
          Написать сообщение
        </button-hover>

        <button-hover
          class="profile-info__add"
          :variant="btnVariantInfo.variant"
          bordered="bordered"
          @click.native="profileAction"
        >
          {{ btnVariantInfo.text }}
        </button-hover>
      </div>
    </div>

    <div class="profile-info__main">
      <router-link class="edit" v-if="me" :to="{ name: 'Settings' }">
        <edit-icon />
      </router-link>

      <span class="profile-info__blocked" :class="{ blocked }" v-else @click="blockedUser">
        {{ blockedText }}
      </span>

      <div class="profile-info__header">
        <h1 class="profile-info__name">{{ info.firstName + ' ' + info.lastName }}</h1>

        <span v-if="!online" class="user-status">
          Был(а) в сети {{ info.lastOnlineTime | moment('from') }}
        </span>

        <span v-else class="user-status" :class="{ online, offline: !online }">
          {{ statusText }}
        </span>
      </div>

      <div class="profile-info__block">
        <span class="profile-info__title">Дата рождения:</span>

        <span class="profile-info__val" v-if="info.birthDate">
          {{
            new Date(info.birthDate).toLocaleString('ru', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          }}
        </span>

        <span class="profile-info__val" v-else>не заполнено</span>
      </div>

      <div class="profile-info__block">
        <span class="profile-info__title">Телефон:</span>

        <a class="profile-info__val" v-if="info.phone" :href="`tel: +7${info.phone}`">
          {{ info.phone | phone }}
        </a>

        <a class="profile-info__val" v-else>не заполнено</a>
      </div>

      <div class="profile-info__block">
        <span class="profile-info__title">Страна, город:</span>

        <span class="profile-info__val" v-if="residenceText">
          {{ residenceText }}
        </span>

        <span class="profile-info__val" v-else>не заполнено</span>
      </div>

      <div class="profile-info__block">
        <span class="profile-info__title">О себе:</span>

        <span class="profile-info__val" v-if="info.about"> {{ info.about }}</span>

        <span class="profile-info__val" v-else>не заполнено</span>
      </div>
    </div>

    <modal v-model="modalShow">
      <p v-if="modalText">{{ modalText }}</p>

      <template slot="actions">
        <button-hover @click.native.prevent="onConfirm">Да</button-hover>

        <button-hover variant="red" bordered="bordered" @click.native="closeModal">
          Отмена
        </button-hover>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Modal from '@/components/Modal';
import EditIcon from '../../Icons/EditIcon.vue';

export default {
  name: 'ProfileInfo',
  components: { Modal, EditIcon },
  props: {
    me: Boolean,
    online: Boolean,
    blocked: Boolean,
    friend: Boolean,
    info: Object,
  },

  data: () => ({
    modalShow: false,
    modalText: '',
    modalType: 'deleteFriend',
  }),

  computed: {
    ...mapGetters('profile/dialogs', ['dialogs']),

    residenceText() {
      let country = this.info?.country;
      let city = this.info?.city;
      if (!country && !city) {
        return null;
      }
      return `${country + ', ' || ''} ${city || ''}`;
    },

    statusText() {
      return this.online ? 'онлайн' : 'не в сети';
    },

    blockedText() {
      return this.blocked ? 'Пользователь заблокирован' : 'Заблокировать';
    },

    btnVariantInfo() {
      return this.blocked
        ? { variant: 'red', text: 'Разблокировать' }
        : this.friend
        ? { variant: 'red', text: 'Удалить из друзей' }
        : { variant: 'white', text: 'Добавить в друзья' };
    },
  },

  methods: {
    ...mapActions('users/actions', ['apiBlockUser', 'apiUnblockUser']),
    ...mapActions('profile/friends', ['apiAddFriends', 'apiDeleteFriends']),
    ...mapActions('profile/dialogs', ['createDialogWithUser', 'apiLoadAllDialogs']),
    ...mapActions('users/info', ['userInfoId']),

    getAgeAsString(age) {
      const ages = ['год', 'года', 'лет'];
      const n = parseInt(age, 10);
      return ages[n % 100 > 4 && n % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][n % 10 < 5 ? n % 10 : 5]];
    },

    blockedUser() {
      if (this.blocked) return;
      this.modalText = `Вы уверены, что хотите заблокировать пользователя ${this.info.fullName}`;
      this.modalShow = true;
      this.modalType = 'block';
    },

    async profileAction() {
      if (this.blocked) {
        this.apiUnblockUser(this.$route.params.id).then(() => {
          this.userInfoId(this.$route.params.id);
        });
        return;
      }

      if (this.friend) {
        this.modalText = `Вы уверены, что хотите удалить пользователя ${this.info.fullName} из друзей?`;
        this.modalShow = true;
        this.modalType = 'deleteFriend';
        return;
      }

      await this.apiAddFriends({ id: this.info.id });
      this.userInfoId(this.$route.params.id);
    },

    closeModal() {
      this.modalShow = false;
    },

    onConfirm() {
      if (this.modalType === 'block') {
        this.apiBlockUser(this.$route.params.id).then(() => {
          this.apiInfo(this.$route.params.id);
          this.closeModal();
        });
        return;
      }

      this.apiUnblockUser(this.$route.params.id).then(() => {
        this.apiInfo(this.$route.params.id);
        this.closeModal();
      });
    },

    onSentMessage() {
      if (this.blocked) return false;
      this.$router.push({
        name: 'ImChat',
        params: { activeDialogId: this.info.id.toString() },
      });
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.profile-info
  display flex
  padding 25px 30px 25px 50px
  background #FFFFFF
  box-shadow standart-boxshadow
  position relative
  border-radius 3%

  @media (max-width breakpoint-xxl)
    padding 25px

.profile-info__pic
  border-right 1px solid #E6E6E6
  padding-right 55px
  margin-right 60px

  @media (max-width breakpoint-xxl)
    margin-right 20px
    padding-right 20px

.profile-info__img
  width 215px
  height 215px
  border-radius 50%
  overflow hidden
  border 5px solid #21A45D

  @media (max-width breakpoint-xxl)
    width 150px
    height 150px
    margin 0 auto

  img
    object-fit cover
    width 100%
    height 100%

  &.offline
    border-color #747474

.profile-info__actions
  margin-top 25px
  max-width 215px

  @media (max-width breakpoint-xxl)
    max-width 180px

  .btn
    width 100%

.profile-info__add
  margin-top 10px

.profile-info__main
  flex 1 1 auto
  padding 20px 0

.profile-info__blocked
  position absolute
  top 30px
  right 45px
  color eucalypt
  font-size 15px
  letter-spacing 0.01em
  cursor pointer

  &.blocked
    color #47474C
    cursor default

.profile-info__header
  display flex
  align-items center
  margin-bottom 30px

.profile-info__name
  font-family font-exo
  font-weight 200
  font-size 30px
  line-height 24px
  color #000000
  margin-right 15px
  margin-bottom 10px

.profile-info__block
  display flex
  font-size 15px

  & + &
    margin-top 5px

  &:last-child
    margin-top 30px

.profile-info__title
  width 100%
  max-width 200px
  flex none
  color #47474C
  line-height 25px

  @media (max-width breakpoint-xxl)
    max-width 150px

.profile-info__val
  color #747487
  line-height 25px
</style>
