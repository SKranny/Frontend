import moment from 'moment';
import account from '@/requests/account';
import posts from '@/requests/posts';
import comments from '@/requests/comments';
import getAuthor from '@/utils/getAuthor';
import createPagination from '@/utils/createPagination';

export default {
  namespaced: true,
  state: {
    info: null,
    wall: [],
    users: null,
    authors: [],
    wallPagination: { total: 3, page: 1, size: 5 },
  },

  getters: {
    authors: (state, getters, rootState) => rootState.global.authors.authors,
    getloading: (state, getters, rootstate) => rootstate.global.status.loading,

    getInfo(state) {
      if (!state.info) return;
      let result = {
        ...state.info,
      };
      // если понадобиться то добавить склонение (для публикаций, но нужен или пол или отчество)
      // библиотека - petrovich
      result.fullName = result.firstName + ' ' + result.lastName;
      result.ages = moment().diff(result.birthDate, 'years');
      return result;
    },

    getUsersInfo(state) {
      if (!state.users) return;
      let result = {
        ...state.users,
      };
      // если понадобиться то добавить склонение (для публикаций, но нужен или пол или отчество)
      // библиотека - petrovich
      result.fullName = result.firstName + ' ' + result.lastName;
      result.ages = moment().diff(result.birthate, 'years');
      // result.is_onlined =
      //   moment().diff(moment(result.last_online_time), "seconds") <= 60;
      return result;
    },

    getWall: (s) => s.wall,
    getWallPagination: (s) => s.wallPagination,
    getWallPostedLength: (s) => s.wall.filter((el) => el.type === 'POSTED').length,
    getWallQueuedLength: (s) => s.wall.filter((el) => el.type === 'QUEUED').length,
  },

  mutations: {
    setInfo: (s, info) => {
      s.info = info;
    },

    setWall(s, wall) {
      const currentWall = wall.filter((currentPost) => {
        return !s.wall.find((post) => post.id === currentPost.id);
      });

      s.wall = [...s.wall, ...currentWall];
    },

    setWallPagination(s, pagination) {
      s.wallPagination = pagination;
    },

    deletePost: (s, id) => {
      const currentWall = s.wall.filter((post) => post.id !== id);
      s.wall = currentWall;
    },

    putPost: (s, payload) => {
      const postIndex = s.wall.indexOf(s.wall.find((post) => post.id === payload.postId));
      s.wall[postIndex] = {
        ...s.wall[postIndex],
        imagePath: payload.imagePath,
        postText: payload.postText,
        tags: payload.tags,
        title: payload.title,
        timeChanged: new Date(),
      };
      s.wall = [...s.wall];
    },

    setWallById: (s, payload) =>
      (s.wall[s.wall.indexOf(s.wall.find((el) => el.id === payload.id))] = payload.value),

    setCommentsById: (s, payload) => {
      s.wall[s.wall.indexOf(s.wall.find((el) => el.id === payload.postId))].comments =
        payload.value;
      s.wall.push('dog-nail');
      s.wall.splice(-1, 1);
    },

    setUsersInfo: (s, info) => (s.users = info),
    clearWall: (s) => {
      s.wall = [];
    },

    clearPagination: (s) => {
      s.wallPagination = { total: 3, page: 1, size: 5 };
    },
  },

  actions: {
    async apiInfo({ commit }) {
      const me = await account.get().data.data;
      const wall = await posts.getWall(me.id).data.content;
      commit('setInfo', me);
      commit('setWall', wall);
    },

    async apiWall({ commit, dispatch, getters }, { accountIds, page, itemPerPage, author = null }) {
      if (getters.getloading) return;

      commit('global/status/removeError', null, { root: true });
      commit('global/status/setLoading', null, { root: true });

      try {
        const response = await posts.get({ accountIds, page, itemPerPage });
        const { content } = response.data;

        if (author) dispatch('global/authors/addAuthor', author, { root: true });

        const wall = author
          ? content.map((post) => ({ ...post, author }))
          : await content.reduce(async (acc, post) => {
              const accumulator = await acc;
              const author = await getAuthor(post.authorId, getters.authors, dispatch);

              post = { ...post, author };

              accumulator.push(post);
              return accumulator;
            }, []);

        commit('setWall', wall);
        const pagination = createPagination(response);
        commit('setWallPagination', pagination);
      } catch (error) {
        const errorMessage = error.message || '';
        commit('global/status/setError', errorMessage, { root: true });
      } finally {
        commit('global/status/removeLoading', null, { root: true });
      }
    },

    // Проверить где еще используется и удалить
    async apiProfileWall({ commit }, { id, page, itemPerPage }) {
      const response = await posts.getById(id, { page, itemPerPage });
      if (response.data.data) commit('setWall', response.data.content);
    },

    // если нигде не используется то тоже можно удалить
    async apiWallById({ commit, dispatch, getters }, id, params = null) {
      const response = await posts.getById(id, params);

      const { content } = response.data;
      const getAuthorComments = async (comments) => {
        return await comments.reduce(async (acc, comment) => {
          const accumulator = await acc;
          const author = await getAuthor(comment.authorId, getters.authors, dispatch);

          comment = { ...comment, author };

          accumulator.push(comment);
          return accumulator;
        });
      };

      const post = {
        ...content,
        comments: content.comments.length ? await getAuthorComments(content.comments) : [],
      };

      commit('setWallById', { id, value: post });
    },

    async apiCommentsById({ commit }, id) {
      const response = await comments.get(id);
      commit('setCommentsById', response.data.data);
    },

    async userInfoId({ commit, dispatch }, id) {
      const response = await account.getUser(id);
      commit('setUsersInfo', response.data);
      await dispatch('apiWall', { accountIds: id });
    },
  },
};
