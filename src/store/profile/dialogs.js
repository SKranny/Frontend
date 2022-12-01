import dialogsApi from '@/requests/dialogs';

export default {
  namespaced: true,
  state: {
    dialogs: [],
    unreadedMessages: 0, // total unreaded
    messages: [], // sorted oldest->newest 0 is oldest
    totalMessages: null,
    dialogsLoaded: false,
    activeDialogId: null,
    oldLastKnownMessageId: null,
    isHistoryEndReached: false,
    newMessage: {},
  },
  getters: {
    getDialogs: (s) => s.dialogs,
    getMessages: (s) => s.messages,
    oldestKnownMessageId: (s) => (s.messages.length > 0 ? s.messages[0]['id'] : null),
    activeDialog: (s) => s.dialogs.find((el) => el.id == s.activeDialogId),
    getActiveDialogId: (s) => +s.activeId,
    dialogsLoaded: (s) => s.dialogsLoaded,
    unreadedMessages: (s) => s.unreadedMessages,
    hasOpenedDialog: (s) => (dialogId) => !!s.dialogs.find((el) => el.id == dialogId),
    isHistoryEndReached: (s) => s.isHistoryEndReached,
  },
  mutations: {
    clearMessages(state) {
      state.messages = [];
    },

    setUnreadedMessages: (s, unread) => (s.unreadedMessages = unread),
    setDialogs: (s, dialogs) => (s.dialogs = dialogs),
    setNewMessage: (s, newMessage) => (s.newMessage = newMessage),
    dialogsLoaded: (s) => (s.dialogsLoaded = true),
    setActiveDialogId: (s, value) => (s.activeDialogId = value),
    addMessages: (s, { messages, total }) => {
      s.messages = [...s.messages, ...messages];
      s.messages.sort((a, b) => a.time - b.time);
      s.total = total;
    },

    addOneMessage: (state, messagePayload) => {
      state.messages.push(messagePayload);
    },
    selectDialog: (state, dialogId) => {
      state.activeId = dialogId;
      state.messages = [];
      state.isHistoryEndReached = false;
    },
    markEndOfHistory: (s) => (s.isHistoryEndReached = true),
  },

  actions: {
    async fetchMessages({ commit }, dialogId) {
      const response = await dialogsApi.getMessages(dialogId);
      if (!Object.keys(response.data).length) return;
      const { data } = response.data;
      const messages = data.map((message) => ({ ...message, time: message.time * 1000 }));
      commit('clearMessages');
      commit('addMessages', {
        messages,
        total: response.data.total,
      });
    },

    async fetchDialogs({ commit }) {
      try {
        const response = await dialogsApi.getDialogs();
        if (response.data?.data?.length === 0) return;

        const dialogs = [];
        const { data } = response.data;
        data.forEach((d) => {
          const conversationPartnerId = d.conversationPartner.id;
          const newDialog = {
            id: conversationPartnerId,
            unreadCount: d.unreadCount,
            lastMessage: {
              time: d.lastMessage.time,
              messageText: d.lastMessage.messageText,
              authorId: d.lastMessage.authorId,
            },
            conversationPartner: d.conversationPartner,
          };
          dialogs.push(newDialog);
        });
        commit('setDialogs', dialogs);
      } catch (err) {
        console.log({ err });
      }
    },

    async apiUnreadedMessages({ commit }) {
      const response = await dialogsApi.unreadedMessages();
      const { count } = response.data.data;
      commit('setUnreadedMessages', count);
    },

    async markReadedMessages(_, id) {
      await dialogsApi.markReaded(id);
    },
  },
};
