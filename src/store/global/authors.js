export default {
  namespaced: true,

  state: {
    authors: [],
  },

  mutations: {
    addAuthor: (s, author) => {
      s.authors.push({
        id: author.id,
        firstName: author.firstName,
        lastName: author.lastName,
        photo: author.photo,
      });
    },

    reloadAuthors: (s, author) => {
      s.authors = [
        {
          id: author.id,
          firstName: author.firstName,
          lastName: author.lastName,
          photo: author.photo,
        },
      ];
    },
  },

  actions: {
    addAuthor: ({ state, commit }, author) => {
      if (state.authors.find((currentAuthor) => currentAuthor.id === author.id)) return;

      if (state.authors.length <= 20) {
        commit('addAuthor', author);
      } else {
        commit('reloadAuthors', author);
      }
    },
  },
};
