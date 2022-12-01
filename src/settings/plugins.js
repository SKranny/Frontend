import Vue from 'vue';

import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

import VueSimpleSVG from 'vue-simple-svg';
Vue.use(VueSimpleSVG);

import VTooltip from 'v-tooltip';
Vue.use(VTooltip);

import VueToastify from 'vue-toastify';
Vue.use(VueToastify);

import moment from 'moment';

moment.locale('ru');
import VueMoment from 'vue-moment';
Vue.use(VueMoment, {
  moment,
});

// import chat from "@/plugins/socketio";
import chat from '@/plugins/websocket';
// import VueSocketIO from 'vue-socket.io';

// Vue.use(chat, { server: "localhost:7000" });
Vue.use(chat, { server: 'localhost' });
// Vue.use(chat, { server: "84.201.189.234:8080" });
