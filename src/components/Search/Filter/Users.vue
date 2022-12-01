<template>
  <div class="search-filter">
    <div class="search-filter__block name">
      <label class="search__label" for="search-people-name">Имя:</label>
      <input class="search__input" type="text" id="search-people-name" v-model="firstName" />
    </div>

    <div class="search-filter__block lastname">
      <label class="search__label" for="search-people-lastname">Фамилия:</label>
      <input class="search__input" type="text" id="search-people-lastname" v-model="lastName" />
    </div>

    <div class="search-filter__block age">
      <label class="search__label">Возраст:</label>

      <div class="search__row">
        <select class="select search-filter__select" v-model.number="ageFrom">
          <option :value="null" :disabled="disabled">От</option>
          <option v-for="age in ageFromArray" :value="age" :key="age">От {{ age }}</option>
        </select>

        <span class="search__age-defis">—</span>

        <select class="select search-filter__select" v-model.number="ageTo">
          <option :value="null" :disabled="disabled">До</option>
          <option v-for="age in ageToArray" :value="age" :key="age">До {{ age }}</option>
        </select>
      </div>
    </div>

    <div class="search-filter__block region">
      <label class="search__label">Регион:</label>

      <div class="search__row">
        <select class="select search-filter__select" v-model="country">
          <option :value="null" :disabled="disabled">Страна</option>
          <option v-for="c in countries" :key="c.id" :value="c">
            {{ c.title }}
          </option>
        </select>

        <select class="select search-filter__select" v-model="city">
          <option :value="null" :disabled="disabled">Город</option>
          <option v-for="c in currentCities" :key="c.id" :value="c">
            {{ c.title }}
          </option>
        </select>
      </div>
    </div>

    <div class="search-filter__block btn-news" @click.prevent="onSearchUsers">
      <button-hover>Применить</button-hover>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'SearchFilterUsers',

  data: () => ({
    firstName: null,
    lastName: null,
    ageFrom: null,
    ageTo: null,
    country: null,
    city: null,
    currentCities: [],
    disabled: false,
    ageFromArray: [...Array(100).keys()].slice(5),
    ageToArray: [...Array(121).keys()].slice(5),
  }),

  computed: {
    ...mapGetters('global/search', ['getUsersQueryParams', 'searchText']),
    ...mapState('global/geo', ['countries', 'cities']),
  },

  watch: {
    country: {
      immediate: true,
      handler(value) {
        if (value && value.id) this.currentCities = this.cities[this.country.id];
        else this.cities = [];
        this.city = null;
      },
    },
  },

  methods: {
    ...mapActions('global/search', ['searchUsers']),

    onSearchUsers() {
      const { firstName, lastName, ageFrom, ageTo } = this;
      if (ageFrom !== null && ageTo !== null && ageFrom >= ageTo) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'action',
          text: 'Неправильный выбор возрастного интервала!',
        });
        return;
      }
      const countryName = this.country ? this.country.title : null;
      const cityName = this.city ? this.city.title : null;
      const searchQuery = Object.assign({}, this.getUsersQueryParams, {
        firstName,
        lastName,
        ageFrom,
        ageTo,
        country: countryName,
        city: cityName,
        author: this.searchText,
      });
      this.searchUsers({ payload: searchQuery });
    },
  },
};
</script>
