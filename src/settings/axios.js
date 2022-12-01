import axios from 'axios';
import store from '@/store';
// import jwtDecode from "jwt-decode";

axios.defaults.headers['content-type'] = 'application/json';
axios.defaults.withCredentials = true;

axios.defaults.baseURL = '/api/v1/';
// axios.defaults.baseURL = "http://84.201.189.234/api/v1/";

const token = localStorage.getItem('user-token');
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// console.log(jwtDecode(token));

axios.interceptors.response.use(null, (error) => {
  console.error(error.response.status);
  const errorMessage = error.response.data.error_description || '';

  if (error.response) {
    // if (error.response.status === 403) {
    //   console.log("Have to refresh Token");
    //   store.dispatch("auth/api/refreshToken");
    // }
    if (error.response.status === 400) {
      store.dispatch('global/alert/setAlert', {
        status: 'error',
        text: `Ошибка ${error.response.status}: ${errorMessage}`,
      });
    }
    if (error.response.status === 401) {
      localStorage.removeItem('user-token');
      document.cookie = 'jwt=';
      store.commit('auth/api/setToken', null);
      window.location.replace('/login');
    }
    store.dispatch('global/alert/setAlert', {
      status: 'error',
      text: `Ошибка ${error.response.status}: ${errorMessage}`,
    });
  } else if (error.request) {
    store.dispatch('global/alert/setAlert', {
      status: 'error',
      text: 'Нет ответа от сервера',
    });
  } else {
    store.dispatch('global/alert/setAlert', {
      status: 'error',
      text: 'Неизвестная ошибка',
    });
  }

  console.error('Axios error', { error });
  return Promise.reject(error);
});
