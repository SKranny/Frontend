import axios from 'axios';

export default {
  getMessages(id) {
    return axios.get(`/dialogs/messages?companionId=${id}`);
  },

  getDialogs() {
    return axios.get('/dialogs');
  },

  unreadedMessages() {
    return axios.get('/dialogs/unreaded');
  },

  markReaded(id) {
    return axios.put(`dialogs/${id}`);
  },
};
