import search from '@/requests/search';
import router from '@/router';
import createPagination from '@/utils/createPagination';
import createQuery from '@/utils/createQuery';
import getAuthor from '@/utils/getAuthor';
import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    lastSearchUsersRequest: '',
    lastSearchNewsRequest: '',
    usersQueryParams: {},
    newsQueryParams: {},
    searchText: null,
    usersPagination: { total: 20, page: 1, size: 5 },
    newsPagination: { total: 20, page: 1, size: 5 },
    tabs: [
      // {
      //   id: "all",
      //   text: "Всё",
      // },
      {
        id: 'users',
        text: 'Люди',
      },
      {
        id: 'news',
        text: 'Новости',
      },
    ],
    tabSelect: 'users',
    result: {
      users: [],
      news: [],
    },
    status: '',
  },
  getters: {
    searchText: (s) => s.searchText,
    tabs: (s) => s.tabs,
    tabSelect: (s) => s.tabSelect,
    getResult: (s) => s.result,
    getResultById: (s) => (id) => s.result[id],
    getStatus: (s) => s.status,
    getLastSearchUsersRequest: (s) => s.lastSearchUsersRequest,
    getLastSearchNewsRequest: (s) => s.lastSearchNewsRequest,
    getUsersQueryParams: (s) => s.usersQueryParams,
    getNewsQueryParams: (s) => s.newsQueryParams,
    getUsersPagination: (s) => s.usersPagination,
    getNewsPagination: (s) => s.newsPagination,
    authors: (state, getters, rootState) => rootState.global.authors.authors,
  },
  mutations: {
    setUsersPagination: (s, pagination) => (s.usersPagination = pagination),
    setNewsPagination: (s, pagination) => (s.newsPagination = pagination),
    setSearchText: (s, value) => (s.searchText = value),
    setLastSearchUsersRequest: (s, value) => (s.lastSearchUsersRequest = value),
    setLastSearchNewsRequest: (s, value) => (s.lastSearchNewsRequest = value),
    setUsersQueryParams: (s, value) => (s.usersQueryParams = value),
    setNewsQueryParams: (s, value) => (s.newsQueryParams = value),
    setTabSelect: (s, id) => (s.tabSelect = id),
    routePushWithQuery(state, id) {
      const query = {};
      if (id !== 'all') query.tab = id;
      if (state.searchText) query.text = state.searchText;
      router.push({
        name: 'Search',
        query,
      });
    },
    setResult(s, result) {
      s.result[result.id] = result.value;
      Vue.set(s.result, result.id, result.value);
    },
  },
  actions: {
    clearSearch({ commit }) {
      commit('setSearchText', '');
      commit('setResult', {
        id: 'users',
        value: [],
      });
      commit('setResult', {
        id: 'news',
        value: [],
      });
    },
    changeTab({ commit }, id) {
      commit('setTabSelect', id);
      commit('routePushWithQuery', id);
    },

    async searchUsers({ commit }, { payload, myFriends = false }) {
      const query = createQuery(payload);

      const response = await search.users(query, myFriends);
      commit('setResult', {
        id: 'users',
        value: response.data.content,
      });
      commit('setUsersQueryParams', payload);
      commit('setLastSearchUsersRequest', payload);

      const pagination = createPagination(response);
      commit('setUsersPagination', pagination);
    },

    async searchNews({ commit, getters, dispatch }, payload) {
      const query = createQuery(payload);
      const response = await search.posts(query);

      const { content } = response.data;

      const fullData = await content.reduce(async (acc, post) => {
        const accumulator = await acc;
        const author = await getAuthor(post.authorId, getters.authors, dispatch);

        post = {
          ...post,
          author,
        };

        accumulator.push(post);
        return accumulator;
      }, []);

      const result = fullData.filter((feed) => feed.author !== undefined);

      commit('setResult', {
        id: 'news',
        value: result,
      });
      commit('setNewsQueryParams', payload);
      commit('setLastSearchNewsRequest', `post?${query.join('&')}`);

      const pagination = createPagination(response);
      commit('setNewsPagination', pagination);
    },

    async searchAll({ dispatch, state }, text) {
      console.log(text);
      const searchQueryUsers = Object.assign({}, state.usersQueryParams, {
        author: text || '',
        size: state.usersPagination.size,
        page: state.usersPagination.page - 1,
      });
      await dispatch('searchUsers', { payload: searchQueryUsers });
      console.log(text);
      const searchQueryNews = Object.assign({}, state.newsQueryParams, {
        text: text || '',
        size: state.newsPagination.size,
        page: state.newsPagination.page - 1,
      });
      await dispatch('searchNews', searchQueryNews);
    },
  },
};
