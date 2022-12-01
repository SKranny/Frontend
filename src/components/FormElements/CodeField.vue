<template>
  <div class="form__group" :class="{ fill: code.length > 0 }">
    <input
      type="text"
      class="form__input_stylus"
      :id="id"
      v-model="code"
      name="code"
      :class="{ invalid: (v.$dirty && !v.required) || (v.$dirty && !v.isCode) }"
      @change="v.$touch()"
      autocomplete="off"
    />

    <label :for="id" class="form__label_stylus">Код</label>

    <span class="form__error" v-if="v.$dirty && !v.required">Обязательное поле</span>

    <span class="form__error" v-else-if="v.$dirty && !v.isCode">код не совпадает</span>
  </div>
</template>

<script>
export default {
  name: 'CodeField',
  props: {
    value: {
      type: String,
      default: '',
    },
    v: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    code: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>
