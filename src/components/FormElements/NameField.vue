<template>
  <div class="form__group" :class="{ fill: name.length > 0 }">
    <input
      type="text"
      class="form__input_stylus"
      :id="id"
      v-model="name"
      name="name"
      :class="{ invalid: (v.$dirty && !v.required) || (v.$dirty && !v.minLength) }"
      @change="v.$touch()"
    />

    <label :for="id" class="form__label_stylus">{{ label }}</label>

    <span class="form__error" v-if="v.$dirty && !v.required">Обязательное поле</span>

    <span class="form__error" v-else-if="v.$dirty && !v.minLength">
      Минимальное количество символов {{ v.minLength }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'NameField',
  props: {
    value: {
      type: String,
      default: '',
    },
    v: {
      type: Object,
      required: true,
    },
    label: {
      type: String,
      default: 'Имя',
    },
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    name: {
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
