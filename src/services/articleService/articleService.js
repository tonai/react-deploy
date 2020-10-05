import api from '../apiService/apiService';

export default {
  addArticle(article) {
    return api('/articles', {
      body: JSON.stringify(article),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }).then((data) => data.json());
  },

  getArticle(id) {
    return api(`/articles/${id}`).then((data) => data.json());
  },

  getArticles() {
    return api('/articles').then((data) => data.json());
  },

  removeArticle(id) {
    return api(`/articles/${id}`, {
      method: 'DELETE'
    }).then((data) => data.json());
  },

  updateArticle(article) {
    return api(`/articles/${article.id}`, {
      body: JSON.stringify(article),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT'
    }).then((data) => data.json());
  }
};
