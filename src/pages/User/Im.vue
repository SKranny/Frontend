<template>
  <div class="im">
    <div class="im__dialogs">
      <im-dialog
        v-for="dialog in dialogs"
        :key="dialog.id"
        :info="dialog"
        :push="countPush(dialog.unreadСount)"
        :me="+info.id === +dialog.lastMessage.authorId"
        :active="+dialog.id === +activeDialogId"
        :online="checkOnlineUser(dialog)"
        @click.native="clickOnDialog(dialog.id)"
      />
    </div>

    <div class="im__chat" v-if="activeDialog && messagesLoaded">
      <im-chat :info="activeDialog" :messages="messages" :online="checkOnlineUser(activeDialog)" />
    </div>

    <div v-else class="no-dialog">Диалог не выбран</div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
import ImDialog from '@/components/Im/Dialog';
import ImChat from '@/components/Im/Chat';

export default {
  name: 'Im',
  components: { ImDialog, ImChat },
  props: {
    activeDialogId: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      activeDialog: null,
      messagesLoaded: false,
    };
  },

  computed: {
    ...mapState('profile/dialogs', ['dialogs', 'messages', 'newMessage']),
    ...mapState('profile/info', ['info']),
  },

  watch: {
    activeDialogId: {
      immediate: true,
      async handler(value) {
        await this.fetchDialogs();
        if (value) {
          this.messagesLoaded = false;
          await this.fetchMessages(value);
          this.messagesLoaded = true;
          const newActiveDialog = this.getDialogs().length
            ? this.getDialogs().filter((d) => +d.id === +value)
            : 0;

          if (newActiveDialog.length > 0) {
            [this.activeDialog] = newActiveDialog;
            this.activeDialog.unreadCount = 0;
          } else {
            await this.userInfoId(this.activeDialogId).then(() => {
              this.activeUser = this.getUsersInfo();
              this.activeDialog = this.generateNewDialog(this.activeUser);
              this.setDialogs([...this.dialogs, this.activeDialog]);
            });
          }
        }
      },
    },

    newMessage: {
      handler(message) {
        // new message of partner
        if (this.activeDialogId && +message.authorId === +this.activeDialogId) {
          message.isSentByMe = false;
          this.addOneMessage(message);
          this.markReadedMessages(message.authorId);
        }
      },
    },
  },

  methods: {
    ...mapActions('profile/dialogs', ['fetchDialogs', 'fetchMessages', 'markReadedMessages']),
    ...mapActions('users/info', ['userInfoId']),
    ...mapMutations('profile/dialogs', [
      'addOneMessage',
      'setUnreadedMessages',
      'setNewMessage',
      'setActiveDialogId',
    ]),
    ...mapMutations('profile/dialogs', ['setDialogs']),
    ...mapGetters('users/info', ['getUsersInfo']),
    ...mapGetters('profile/dialogs', ['getDialogs']),
    ...mapGetters('profile/info', ['getInfo']),

    generateNewDialog(user) {
      return {
        id: this.activeDialogId,
        conversationPartner: {
          id: this.activeDialogId,
          firstName: user.firstName,
          lastName: user.lastName,
          lastOnlineTime: user.lastOnlineTime,
          isOnline: user.isOnline,
          photo: user.photo || null,
        },
        lastMessage: {},
        unreadCount: 0,
      };
    },

    countPush(unread) {
      return unread > 0 ? unread : null;
    },
    checkOnlineUser(dialog) {
      return dialog.conversationPartner.isOnline;
    },
    clickOnDialog(dialogId) {
      if (+dialogId === +this.activeDialogId) {
        return;
      }
      this.$router.push({
        name: 'ImChat',
        params: { activeDialogId: dialogId.toString() },
      });
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.no-dialog
  display flex
  width 100%
  height 100%
  justify-content:center
  align-items center
  color #666

.im
  display flex
  height 'calc(100vh - %s)' % header-height

.im__dialogs
  width 100%
  max-width 39.13%
  overflow-y auto
  max-height 100%
  height 100%
  background-color #eaf0fb

  @media (max-width breakpoint-xl)
    max-width 120px

.im__chat
  width 100%
  flex auto
  height 100%
  background-color #F8FAFD
</style>
