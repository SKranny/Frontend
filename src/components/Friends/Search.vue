<template>
  <form action="#" class="friends-possible" @submit.prevent="onSearchUsers">
    <h4 class="friends-possible__title">Параметры поиска</h4>

    <div class="friends-search">
      <div class="friends-search__row">
        <div class="friends-search__block">
          <label for="friends-search-name" class="search__label">Имя:</label>
          <input type="text" class="search__input" id="friends-search-name" v-model="firstName" />
        </div>
      </div>

      <div class="friends-search__block">
        <label class="search__label">Возраст:</label>
        <div class="search__row">
          <select class="select friends-search__select" v-model.number="ageFrom">
            <option value="null" disabled>От</option>
            <option v-for="age in ageFromArray" :value="age" :key="age">От {{ age }}</option>
          </select>

          <span class="search__age-defis">—</span>

          <select class="select friends-search__select" v-model.number="ageTo">
            <option value="null" disabled>До</option>
            <option v-for="age in ageToArray" :value="age" :key="age">До {{ age }}</option>
          </select>
        </div>
      </div>

      <div class="friends-search__block">
        <label class="search__label">Регион:</label>
        <div class="search__row">
          <select class="select friends-search__select" v-model="country">
            <option value="null" disabled>Страна</option>
            <option v-for="c in countries" :key="c.id" :value="c">{{ c.title }}</option>
          </select>
          <select class="select friends-search__select" v-model="city">
            <option value="null" disabled>Город</option>
            <option v-for="c in currentCities" :key="c.id" :value="c">
              {{ c.title }}
            </option>
          </select>
        </div>
      </div>

      <div class="friends-search__block">
        <label class="search__label checkbox-wrapper">
          <span>Поиск по всем пользователям</span>
          <input type="checkbox" class="checkbox" v-model="allUsers" />
        </label>
      </div>
    </div>

    <button class="friends-possible__btn" type="submit">
      <search-icon class="friends-possible__icon" />
      <span class="friends-possible__link">Искать друзей</span>
    </button>
  </form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import SearchIcon from '../../Icons/SearchIcon.vue';
export default {
  name: 'FriendsSearch',
  components: { SearchIcon },
  data: () => ({
    firstName: null,
    lastName: null,
    ageFrom: null,
    ageTo: null,
    country: null,
    city: null,
    currentCities: [],
    disabled: false,
    page: 1,
    itemSize: 5,
    ageFromArray: [...Array(100).keys()].slice(5),
    ageToArray: [...Array(121).keys()].slice(5),
    allUsers: false,
  }),
  computed: {
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

  beforeDestroy() {
    this.clearSearch();
  },

  methods: {
    ...mapActions('global/search', ['searchUsers', 'clearSearch']),

    onSearchUsers() {
      let { firstName, lastName, ageFrom, ageTo } = this;
      if (ageFrom !== null && ageTo !== null && ageFrom >= ageTo) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'error',
          text: 'Неправильный выбор возрастного интервала!',
        });
        return;
      }

      const countryName = this.country ? this.country.title : null;
      const cityName = this.city ? this.city.title : null;
      this.searchUsers({
        payload: {
          firstName,
          lastName,
          ageFrom,
          ageTo,
          country: countryName,
          city: cityName,
        },
        myFriends: !this.allUsers,
      });
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.checkbox
  position relative
  border 0
  padding 0
  height 1px
  width 1px
  clip rect(1px, 1px, 1px, 1px)
  cursor pointer

  &::before
    content ''
    position absolute
    right 0
    width 20px
    height 20px
    border 2px solid #21a45d

  &::after
    content: ''
    transform scale(1.3)
    opacity 0
    transition transform 200ms linear, opacity  100ms linear

  &:checked::after
    content '\2714'
    position absolute
    right -2px
    top -11px
    font-size 27px
    color #5f5e7a
    transform scale(1)
    opacity 1

.checkbox-wrapper
  position relative
  padding-top 20px
  display flex
  justify-content space-between

.friends-search
  margin-top 25px
  padding-top 20px
  margin-bottom 30px
  border-top 1px solid #E6E6E6

.friends-search__row
  @media (max-width breakpoint-xl)
    display flex

    .friends-search__block
      flex auto

    .friends-search__block + .friends-search__block
      margin-top 0
      margin-left 12px

.friends-search__row + .friends-search__block
  margin-top 15px

.friends-search__block
  &+&
    margin-top 15px

.friends-search__select
  display block
  width 100%

  &+&
    margin-left 12px
</style>
