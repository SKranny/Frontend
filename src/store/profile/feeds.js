import posts from '@/requests/posts';
import createPagination from '@/utils/createPagination';
import getAuthor from '@/utils/getAuthor';

export default {
  namespaced: true,
  state: {
    feeds: [],
    feedsPagination: {},
  },

  getters: {
    getFeeds: (state) => state.feeds,
    getPagitnation: (state) => state.feedsPagination,
    authors: (state, getters, rootState) => rootState.global.authors.authors,
    getloading: (state, getters, rootstate) => rootstate.global.status.loading,
  },

  mutations: {
    setFeeds: (s, feeds) => {
      const currentFeeds = feeds.filter((currentFeed) => {
        return !s.feeds.find((feed) => feed.id === currentFeed.id);
      });

      s.feeds = [...s.feeds, ...currentFeeds];
    },

    clearFeeds: (s) => {
      s.feeds = [];
    },

    deleteFeeds: (s, id) => {
      const currentFeeds = s.feeds.filter((feed) => feed.id !== id);
      s.feeds = currentFeeds;
    },

    putFeeds: (s, payload) => {
      const postIndex = s.feeds.indexOf(s.feeds.find((feed) => feed.id === payload.postId));
      s.feeds[postIndex] = {
        ...s.feeds[postIndex],
        imagePath: payload.imagePath,
        postText: payload.postText,
        tags: payload.tags,
        title: payload.title,
        timeChanged: new Date(),
      };
      s.feeds = [...s.feeds];
    },

    setFeedsPagination: (s, pagination) => (s.feedsPagination = pagination),

    setFeedsById: (s, payload) =>
      (s.feeds[s.feeds.indexOf(s.feeds.find((el) => el.id === payload.id))] = payload),
  },

  actions: {
    async apiFeeds({ commit, dispatch, getters }, payload) {
      if (getters.getloading) return;
      commit('global/status/removeError', null, { root: true });
      commit('global/status/setLoading', null, { root: true });
      try {
        const response = await posts.getFeeds(payload);
        const { content } = response.data;

        const feeds = await content.reduce(async (acc, post) => {
          const accumulator = await acc;
          const author = await getAuthor(post.authorId, getters.authors, dispatch);

          post = { ...post, author };
          accumulator.push(post);

          return accumulator;
        }, []);

        commit('setFeeds', feeds);
        const pagination = createPagination(response);
        commit('setFeedsPagination', pagination);
      } catch (error) {
        const errorMessage = error.message || '';
        commit('global/status/setError', errorMessage, { root: true });
      } finally {
        commit('global/status/removeLoading', null, { root: true });
      }
    },

    async apiFeedsById({ commit }, postId) {
      const response = await posts.getById(postId);
      commit('setFeedsById', response.data);
    },

    async actionsFeed({ dispatch, commit, rootGetters }, payload) {
      const isPUT = payload.edit && !!payload.edit;
      const publishDate = payload.publishDate ? '?publishDate=' + payload.publishDate : '';
      const data = {
        title: payload.title,
        postText: payload.postText,
        tags: payload.tags,
        imagePath: payload.imagePath,
      };

      await posts.push(data, isPUT, payload.postId, publishDate);

      // if (isPUT) {
      //   dispatch('users/info/apiWallById', payload.postId, { root: true });
      // }

      if (payload.route === 'News') {
        if (isPUT) commit('putFeeds', payload);
        else {
          commit('clearFeeds');
          dispatch('apiFeeds');
        }
      } else {
        if (isPUT) commit('users/info/putPost', payload, { root: true });
        else {
          console.log(rootGetters['profile/info/getInfo']);
          commit('users/info/clearWall', null, { root: true });
          dispatch(
            'users/info/apiWall',
            { accountIds: payload.id, author: rootGetters['profile/info/getInfo'] },
            { root: true }
          );
        }
      }
    },

    async deleteFeeds({ commit }, payload) {
      await posts.delete(payload.postId);

      if (payload.route === 'News') {
        commit('deleteFeeds', payload.postId);
      } else commit('users/info/deletePost', payload.postId, { root: true });
    },
  },
};
