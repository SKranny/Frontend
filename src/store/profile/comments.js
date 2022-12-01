import comments from '@/requests/comments';
import getAuthor from '@/utils/getAuthor';

export default {
  state: {
    comments: {},
    subComments: {},
  },
  namespaced: true,
  getters: {
    authors: (state, getters, rootState) => rootState.global.authors.authors,
  },

  mutations: {
    addComments: (s, comments) => {
      s.comments = {
        ...s.comments,
        [comments.postId]: {
          ...comments,
          value: s.comments[comments.postId]
            ? [...s.comments[comments.postId].value, ...comments.value]
            : comments.value,
        },
      };
    },

    addSubComments: (s, subComments) => {
      s.subComments = {
        ...s.subComments,
        [subComments.commentId]: {
          ...subComments,
          value: s.subComments[subComments.commentId]
            ? [...s.subComments[subComments.commentId].value, ...subComments.value]
            : subComments.value,
        },
      };
    },

    deleteComment: (s, { postId, id }) => {
      s.comments = {
        ...s.comments,
        [postId]: {
          ...s.comments[postId],
          value: s.comments[postId].value.filter((comment) => comment.id !== id),
        },
      };
    },

    deleteSubComment: (s, { id, parentId }) => {
      s.subComments = {
        ...s.subComments,
        [parentId]: {
          ...s.subComments[parentId],
          value: s.subComments[parentId].value.filter((comment) => comment.id !== id),
        },
      };
    },

    prependComment: (s, comment) => {
      s.comments = {
        ...s.comments,
        value: [comment, ...s.comments.value],
      };
    },

    clearComments: (s) => {
      s.comments = {};
    },

    clearSubComments: (s) => {
      s.subComments = {};
    },
  },

  actions: {
    async commentsById(
      { commit, dispatch, getters },
      { postId, currentPage = null, commentId = null }
    ) {
      const response = await comments.get(postId, currentPage, commentId);

      const { content, totalPages, totalElements } = response.data;
      const page = response.data.number;

      const currentComments = await content.reduce(async (acc, comment) => {
        const accumulator = await acc;
        const author = await getAuthor(comment.authorId, getters.authors, dispatch);

        comment = {
          ...comment,
          author,
        };

        accumulator.push(comment);
        return accumulator;
      }, []);
      const data = {
        postId,
        value: currentComments,
        page,
        totalPages,
        totalElements,
        commentId,
      };

      if (commentId) commit('addSubComments', data);
      else commit('addComments', data);
    },

    async newComment({ dispatch, commit }, payload) {
      await comments.add(payload.postId, {
        parentId: payload.parentId,
        commentText: payload.text,
      });
      if (payload.parentId) commit('clearSubComments');
      else commit('clearComments');

      dispatch('commentsById', { postId: payload.postId, commentId: payload.parentId || null });
    },

    async editComment({ dispatch }, payload) {
      await comments.edit(payload.postId, payload.id, { commentText: payload.text });
      dispatch('commentsById', { postId: payload.postId });
    },

    async deleteComment({ commit }, payload) {
      await comments.delete(payload.postId, payload.id);
      if (payload.parentId) commit('deleteSubComment', payload);
      else commit('deleteComment', payload);
    },

    async recoverComment({ dispatch }, payload) {
      await comments.recover(payload.postId, payload.id);
      dispatch('commentsById', { postId: payload.postId });
    },

    async commentActions({ dispatch }, payload) {
      if (payload.edit) await dispatch('editComment', payload);
      else await dispatch('newComment', payload);
    },
  },
};
