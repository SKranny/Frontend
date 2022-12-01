<script>
import { mapGetters, mapActions } from 'vuex';

const INTERVAL_DIALOG_MS = 2000;
const INTERVAL_NOTIFICATIONS_MS = 5000;

export default {
  computed: {
    ...mapGetters('profile/dialogs', ['activeDialog']),
  },

  mounted() {
    this.intervalForMessages = setInterval(() => {
      // if (this.activeDialog) {
      //   this.loadFreshMessages(this.activeDialog.id);
      // }
    }, INTERVAL_DIALOG_MS);

    this.intervalForNotifications = setInterval(() => {
      // this.apiNotifications();
    }, INTERVAL_NOTIFICATIONS_MS);
  },

  beforeDestroy() {
    window.clearInterval(this.intervalForMessages);
    window.clearInterval(this.intervalForNotifications);
  },

  methods: {
    ...mapActions('profile/dialogs', ['loadFreshMessages']),
    // ...mapActions("profile/notifications", ["apiNotifications"]),
  },

  render: () => null,
};
</script>
