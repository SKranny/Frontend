import Vue from 'vue';

Vue.component('ButtonHover', {
  props: {
    tag: {
      type: String,
      default: 'a',
    },
    variant: {
      type: String,
      default: 'green',
    },
    bordered: {
      type: Boolean,
    },
    to: {
      type: Object,
    },
    disable: {
      type: Boolean,
    },
  },
  data: () => ({
    x: null,
    y: null,
    isAnimated: true,
  }),
  computed: {
    classObject() {
      return {
        'btn--white': this.variant === 'white',
        'btn--dark': this.variant === 'dark',
        'btn--red': this.variant === 'red',
        'btn--warning': this.variant === 'warning',
        'btn--fill': this.variant === 'fill',
        'btn--bordered': this.bordered,
        'btn--disable': this.disable,
      };
    },
  },
  methods: {
    btnHandler(e) {
      if (!this.isAnimated) return null;
      this.isAnimated = false;
      this.x = `${e.offsetX}px`;
      this.y = `${e.offsetY}px`;
    },
    btnMouseLeave(e) {
      this.x = `${e.offsetX}px`;
      this.y = `${e.offsetY}px`;
      this.isAnimated = true;
      setTimeout(() => {
        this.x = 0;
        this.y = 0;
      }, 200);
    },
  },
  template: `<router-link :to="to" class="btn" :class="classObject" @mousemove.native="btnHandler($event)" @mouseleave.native="btnMouseLeave($event)" v-if="to">
    <span class="helper" :style="{left: x, top: y}"></span>
    <slot></slot>
  </router-link>
  <component :is="tag" class="btn" :class="classObject" @mousemove="btnHandler($event)" @mouseleave="btnMouseLeave($event)" v-else>
    <span class="helper" :style="{left: x, top: y}"></span>
    <slot></slot>
  </component>`,
});
