import axios from 'axios';

export default {
  get() {
    return axios.get('notifications');
  },

  getLength() {
    return axios.get('notifications/count');
  },

  changeSettings(data) {
    return axios.put('notifications/settings', data);
  },

  getSettings() {
    return axios.get('notifications/settings');
  },
};
