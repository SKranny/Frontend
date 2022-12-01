import axios from 'axios';

export default {
  getCountries() {
    return axios.get('/geo/countries');
  },

  getSities(countryId) {
    return axios.get(`/geo/cities/${countryId}`);
  },
};
