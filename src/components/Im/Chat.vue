<template>
  <div class="im-chat">
    <div class="im-chat__user">
      <router-link
        class="im-chat__user-pic"
        :to="{
          name: 'ProfileId',
          params: { id: info.conversationPartner.id },
        }"
      >
        <div class="main-layout__user-pic">
          <img
            v-if="info.conversationPartner.photo"
            :src="info.conversationPartner.photo"
            :alt="
              info.conversationPartner.firstName[0] + ' ' + info.conversationPartner.firstName[0]
            "
          />

          <div v-else>
            {{ info.conversationPartner.firstName[0] }}
          </div>
        </div>
      </router-link>

      <router-link
        class="im-chat__user-name"
        :to="{
          name: 'ProfileId',
          params: { id: info.id },
        }"
      >
        {{ info.conversationPartner.firstName }}
      </router-link>

      <span class="user-status" :class="{ online }">
        Был(а) в сети
        {{ this.info.conversationPartner.lastOnlineTime | moment('from') }}
      </span>
    </div>

    <div class="im-chat__infitite_list_wrapper">
      <virtual-list
        class="im-chat__infitite_list scroll-touch"
        :size="60"
        :keeps="120"
        data-key="id"
        :data-sources="messagesGrouped"
        :data-component="itemComponent"
        :wrap-class="'im-chat__message'"
        :root-tag="'section'"
        @totop="onScrollToTop"
        @scroll.passive="onScroll"
        @tobottom="onScrollToBottom"
        ref="vsl"
      >
        <div class="im-chat__loader" slot="header" v-show="fetching">
          <div class="spinner" v-show="!isHistoryEndReached()" />
          <div class="finished" v-show="isHistoryEndReached()">Больше сообщений нет</div>
        </div>
      </virtual-list>
    </div>

    <form class="im-chat__enter" action="#" @submit.prevent="onSubmitMessage">
      <input
        class="im-chat__enter-input"
        type="text"
        placeholder="Ваше сообщение..."
        v-model="mes"
      />
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import ChatMessage from '@/components/Im/ChatMessage';
import VirtualList from 'vue-virtual-scroll-list';

const makeHeader = (msgDate) => {
  return { id: `group-${msgDate}`, stubDate: true, date: msgDate };
};

export default {
  name: 'ImChat',
  components: {
    VirtualList,
  },

  props: {
    info: Object,
    messages: Array,
    online: Boolean,
  },

  data: () => ({
    mes: '',
    itemComponent: ChatMessage,
    isUserViewHistory: false,
    fetching: false,
    lastId: -1,
  }),

  computed: {
    messagesGrouped() {
      let groups = [];
      let headerDate = null;

      for (const msg of this.messages) {
        const msgDate = new Date(msg.time).toDateString();
        if (msgDate !== headerDate) {
          headerDate = msgDate;
          groups.push(makeHeader(headerDate));
        }
        msg.isSentByMe = +msg.authorId === +this.getInfo().id;
        groups.push(msg);
      }
      return groups;
    },
  },

  watch: {
    messages() {
      if (this.follow) this.setVirtualListToBottom();
    },
  },

  mounted() {
    this.follow = true;
    this.markReadedMessages(this.$route.params.activeDialogId);
    this.$refs.vsl.scrollToBottom();
  },

  methods: {
    ...mapActions('profile/dialogs', ['postMessage', 'loadOlderMessages', 'markReadedMessages']),
    ...mapGetters('profile/dialogs', ['isHistoryEndReached', 'getDialogs']),
    ...mapGetters('profile/info', ['getInfo']),
    ...mapMutations('profile/dialogs', ['addOneMessage']),

    onSubmitMessage() {
      if (!this.mes.trim()) return;
      const time = new Date().getTime();
      const payload = {
        type: 'MESSAGE',
        accountId: this.info.conversationPartner.id,
        data: {
          id: this.lastId,
          authorId: this.getInfo().id,
          messageText: this.mes,
          recipientId: this.info.conversationPartner.id,
          time,
        },
      };
      this.addOneMessage(payload.data);
      this.$socket.sendMessage(payload);
      this.lastId -= 1;
      this.mes = '';
    },

    async onScrollToTop() {
      if (this.$refs.vsl) {
        if (!this.isHistoryEndReached()) {
          let [oldest] = this.messagesGrouped;

          this.fetching = true;
          await this.loadOlderMessages();
          this.setVirtualListToOffset(1);

          this.$nextTick(() => {
            let offset = 0;
            for (const groupedMsg of this.messagesGrouped) {
              if (groupedMsg.id === oldest.id) break;
              offset += this.$refs.vsl.getSize(groupedMsg.id);
            }

            this.setVirtualListToOffset(offset);
            this.fetching = false;
          });
        }
      }
    },

    onScroll() {
      this.follow = false;
    },

    onScrollToBottom() {
      this.follow = true;
    },

    setVirtualListToOffset(offset) {
      if (this.$refs.vsl) {
        this.$refs.vsl.scrollToOffset(offset);
      }
    },

    setVirtualListToBottom() {
      if (this.$refs.vsl) {
        this.$refs.vsl.scrollToBottom();
      }
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.im-chat
  position relative
  display flex
  flex-direction column
  height 100%

.im-chat__user
  border-bottom 1px solid #E3E8EE
  display flex
  align-items center
  height 60px
  padding 30px 20px
  font-size 13px
  background-color #F8FAFD

.im-chat__user-pic
  width 40px
  height 40px
  border-radius 50%
  overflow hidden
  margin-right 10px

.im-chat__user-name
  font-weight 600
  color steel-gray
  margin-right auto

.im-chat__user-status
  color #9EA4AD

  &.online
    color eucalypt

.im-chat__infitite_list_wrapper
  position relative
  flex 1

.im-chat__infitite_list
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  overflow-y auto

.im-chat__message > div
  padding 20px

.im-chat__enter
  display block
  width 100%

.im-chat__enter-input
  width 100%
  background-color #cff2dc
  padding 0 40px
  font-size 15px
  color steel-gray
  height 80px

  &::placeholder
    color #B0B0BC

.im-chat__loader
  padding 1em

  .finished
    font-size 14px
    text-align center
    color #bfbfbf

  .spinner
    font-size 10px
    margin 0 auto
    text-indent -9999em
    width 25px
    height 25px
    border-radius 50%
    background #ffffff
    background linear-gradient(to right, eucalypt 10%, rgba(255, 255, 255, 0) 42%)
    position relative
    animation load3 1.4s infinite linear
    transform translateZ(0)

  .spinner:before
    width 50%
    height 50%
    background eucalypt
    border-radius 100% 0 0 0
    position absolute
    top 0
    left 0
    content ''

  .spinner:after
    background #f8fafd
    width 75%
    height 75%
    border-radius 50%
    content ''
    margin auto
    position absolute
    top 0
    left 0
    bottom 0
    right 0

  @-webkit-keyframes load3
    0%
      transform rotate(0deg)
    100%
      transform rotate(360deg)

  @keyframes load3
    0%
      transform rotate(0deg)
    100%
      transform rotate(360deg)
</style>
