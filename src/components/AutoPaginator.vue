<template>
  <div ref="observer" />
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    page: {
      type: Number,
      default: 0,
    },
    totalPage: {
      type: Number,
      default: 20,
    },
    action: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      pageCount: 0,
    };
  },

  mounted() {
    this.pageCount = this.page;
    const loadingObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.loading) {
          if (this.page === this.totalPage) return;

          if (this.pageCount === 0) {
            this.action({ page: this.page - 1 || 0 });
            this.pageCount += 1;
          } else {
            this.action({ page: this.page || 0 });
            this.pageCount += 1;
          }
        }
      });
    });

    loadingObserver.observe(this.$refs.observer);
  },
};
</script>
