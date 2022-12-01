<template>
  <div class="settings-main">
    <user-info-form-block label="Имя:" placeholder="Введите имя" v-model="firstName" />

    <user-info-form-block label="Фамилия:" placeholder="Введите фамилию" v-model="lastName" />

    <user-info-form-block
      label="Телефон:"
      placeholder="Введите телефон"
      v-model="phone"
      phone="phone"
    />

    <div class="user-info-form__block">
      <span class="user-info-form__label_stylus">Страна:</span>

      <div class="user-info-form__wrap">
        <select class="select user-info-form__select country" v-model="country">
          <option value="">Неизвестно</option>
          <option v-for="c in countries" :key="c.id" :value="c.title">
            {{ c.title }}
          </option>
        </select>
      </div>
    </div>

    <div class="user-info-form__block">
      <span class="user-info-form__label_stylus">Город:</span>

      <div class="user-info-form__wrap">
        <select class="select user-info-form__select country" v-model="city">
          <option value="">Неизвестно</option>
          <option v-for="c in cities" :key="c.id" :value="c.title">
            {{ c.title }}
          </option>
        </select>
      </div>
    </div>

    <div class="user-info-form__block">
      <span class="user-info-form__label_stylus">Дата рождения:</span>

      <div class="user-info-form__wrap">
        <select class="select user-info-form__select day" v-model="day">
          <option :value="null">Неизвестно</option>
          <option v-for="d in days" :key="d">{{ d }}</option>
        </select>

        <select class="select user-info-form__select month" v-model="month">
          <option :value="null">none</option>
          <option v-for="month in months" :key="month.val" :value="month">
            {{ month.text }}
          </option>
        </select>

        <select class="select user-info-form__select year" v-model="year">
          <option :value="null">Неизвестно</option>
          <option v-for="i in years" :key="i">{{ i }}</option>
        </select>
      </div>
    </div>

    <div class="user-info-form__block user-info-form__block--photo">
      <span class="user-info-form__label_stylus">Фотография:</span>

      <div class="user-info-form__wrap">
        <div class="user-info-form__photo-wrap">
          <input
            class="user-info-form__input_stylus-photo"
            type="file"
            ref="photo"
            id="photo"
            @change="processFile($event)"
            accept="image/*"
          />

          <label
            class="user-info-form__input_stylus user-info-form__input_stylus--photo"
            for="photo"
          >
            <span class="setting-main__photo-delete" v-if="photoName">
              {{ photoName }}

              <delete-icon class="setting-main__delete-icon" @click.native.prevent="deletePhoto" />
            </span>
          </label>

          <button-hover variant="fill" bordered="bordered" @click.native="loadPhoto">
            Загрузить
          </button-hover>
        </div>

        <div class="main-layout__user-pic" v-if="src" style="margin: 10px">
          <img :src="src" :alt="firstName[0]" />
        </div>
      </div>
    </div>

    <user-info-form-block label="О себе:" v-model="about" about="about" />

    <div class="user-info-form__block user-info-form__block--actions">
      <span class="user-info-form__label_stylus" />

      <div class="user-info-form__wrap">
        <button-hover @click.native.prevent="submitHandler"> Сохранить </button-hover>

        <router-link class="settings-main__back" :to="{ name: 'Profile' }">
          <button-hover variant="red" bordered="bordered"> Отменить </button-hover>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import DeleteIcon from '../../Icons/DeleteIcon.vue';
// import moment from 'moment';
import UserInfoFormBlock from '@/components/Settings/UserInfoForm/Block.vue';
import axios from 'axios';

export default {
  name: 'SettingsMain',
  components: { UserInfoFormBlock, DeleteIcon },

  data: () => ({
    photoName: 'Фотография',
    firstName: '',
    lastName: '',
    phone: '',
    about: '',
    day: 1,
    month: { val: 1, text: 'Января' },
    year: 2000,
    months: [
      { val: 0, text: 'Января' },
      { val: 1, text: 'Февраля' },
      { val: 2, text: 'Марта' },
      { val: 3, text: 'Апреля' },
      { val: 4, text: 'Мая' },
      { val: 5, text: 'Июня' },
      { val: 6, text: 'Июля' },
      { val: 7, text: 'Августа' },
      { val: 8, text: 'Сентября' },
      { val: 9, text: 'Октября' },
      { val: 10, text: 'Ноября' },
      { val: 11, text: 'Декабря' },
    ],
    photo: '',
    src: '',
    country: '',
    city: '',
    countries: [],
    cities: [],
  }),

  computed: {
    ...mapGetters('global/storage', ['getStorage']),
    ...mapGetters('profile/info', ['getInfo']),

    phoneNumber() {
      return this.phone.replace(/\D+/g, '');
    },

    years() {
      return Array.from({ length: 61 }, (value, index) => 1962 + index);
    },

    days() {
      return this.month.val === 1
        ? this.year & 3 || (!(this.year % 25) && this.year & 15)
          ? 28
          : 29
        : 30 + ((this.month.val + (this.month.val >> 3)) & 1);
    },
  },

  watch: {
    getInfo(value) {
      if (!value) {
        return;
      }
      this.setInfo();
    },
    country: {
      immediate: true,
      handler(value) {
        if (value && value !== 'none') {
          const currentCountry = this.countries.find((country) => country.title === value);
          this.loadCities(currentCountry.id);
        } else this.city = 'none';
      },
    },
  },

  mounted() {
    if (this.getInfo) {
      this.setInfo();
    }
    this.loadCountries();
  },

  methods: {
    ...mapActions('global/storage', ['apiStorage']),
    ...mapActions('profile/info', ['apiChangeInfo']),
    ...mapMutations('global/storage', ['setStorage']),

    loadCountries() {
      axios
        .get('/geo/countries')
        .then((response) => {
          this.countries = response.data;
        })
        .catch(() => {});
      return;
    },

    loadCities(countryId) {
      if (!countryId) {
        this.city = null;
        return;
      }
      axios.get(`/geo/cities/${countryId}`).then((response) => {
        this.cities = response.data;
      });
      return countryId;
    },

    async submitHandler() {
      let _birthDate = 'none';
      console.log(this.country);
      if (this.year && this.month && this.day) {
        _birthDate = new Date(this.year, this.month.val, this.day).toISOString();
      }
      if (this.photo) await this.apiStorage(this.photo);
      await this.apiChangeInfo({
        firstName: this.firstName,
        lastName: this.lastName,
        birthDate: _birthDate,
        phone: this.phoneNumber,
        about: this.about,
        country: this.country,
        city: this.city,
      }).then(() => this.setStorage(null));
    },

    processFile(event) {
      [this.photo] = event.target.files;
      const reader = new window.FileReader();
      reader.onload = (e) => {
        this.src = e.target.result;
      };
      reader.readAsDataURL(this.photo);
    },

    loadPhoto() {
      this.$refs.photo.click();
    },

    deletePhoto() {
      this.photo = '';
      this.photoName = '';
      this.src = '';
      this.setStorage('');
    },

    setInfo() {
      this.firstName = this.getInfo.firstName;
      this.lastName = this.getInfo.lastName;
      this.src = this.getInfo.photo;
      if (this.getInfo.phone) {
        this.phone = this.getInfo.phone.replace(/^[+]?[78]/, '');
      } else this.phone = '';

      if (this.getInfo.birthDate) {
        const birthDate = new Date(this.getInfo.birthDate);
        this.day = birthDate.getDate();
        this.month = this.months[birthDate.getMonth()];
        this.year = birthDate.getFullYear();
      }
      this.about = this.getInfo.about;
      if (this.getInfo.country) {
        this.country = this.getInfo.country.title;
      }
      if (this.getInfo.city) {
        this.city = this.getInfo.city.title;
      }
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.settings-main
  background #fff
  box-shadow standart-boxshadow
  padding 40px 10px 50px

  .user-info-form__label_stylus
    white-space pre-wrap

  @media (max-width breakpoint-xl)
    padding 40px 20px

.settings-main__back
  margin-left 20px

.setting-main__delete-icon
  position absolute
  right 10px
  top 12px
  width 12px
  height 12px

.country
  width 100%
</style>
