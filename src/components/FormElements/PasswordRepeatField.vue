<template>
  <div class="form__group" :class="{ fill: password.length > 0 }">
    <label :for="id" class="form__label_stylus">Повторите пароль</label>

    <input
      type="password"
      class="form__input_stylus"
      :id="id"
      v-model.trim="password"
      name="password"
      :class="{
        invalid:
          (v.$dirty && !v.required) ||
          (v.$dirty && !v.minLength) ||
          (v.$dirty && !v.sameAsPassword),
      }"
      @change="v.$touch()"
    />

    <span class="form__error" v-if="v.$dirty && !v.sameAsPassword">Пароли должны совпадать</span>

    <span class="form__error" v-if="v.$dirty && !v.minLength">
      Пароль должен быть не менее {{ v.$params.minLength.min }} символов. Сейчас он
      {{ password.length }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'PasswordRepeatField',
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
    password: {
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
