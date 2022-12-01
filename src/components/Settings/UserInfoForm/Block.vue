<template>
  <div class="user-info-form__block">
    <span class="user-info-form__label_stylus">{{ label }}</span>

    <div class="user-info-form__wrap">
      <textarea
        class="user-info-form__input_stylus user-info-form__input_stylus--textarea"
        :value="value"
        @input="$emit('input', $event.target.value)"
        v-if="about"
      />

      <input
        class="user-info-form__input_stylus"
        type="text"
        :value="value"
        :placeholder="placeholder"
        @input="$emit('input', $event.target.value)"
        :ref="phone && 'phone'"
        v-else
      />
    </div>
  </div>
</template>

<script>
import Inputmask from 'inputmask';
export default {
  name: 'UserInfoFormBlock',

  props: {
    label: String,
    placeholder: String,
    value: String,
    phone: Boolean,
    about: Boolean,
  },

  mounted() {
    if (this.phone) {
      var im = new Inputmask('+7 (999) 999-99-99');
      im.mask(this.$refs.phone);
    }
  },
};
</script>
