import api from '../apiService/apiService';

export default {
  addArticle(article) {
    return api('/articles', {
      body: JSON.stringify(article),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    });
  },

  getArticle(id) {
    return api(`/articles/${id}`);
  },

  getArticles() {
    return api('/articles');
  },

  removeArticle(id) {
    return api(`/articles/${id}`, {
      method: 'DELETE'
    });
  },

  updateArticle(article) {
    return api(`/articles/${article.id}`, {
      body: JSON.stringify(article),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT'
    });
  }
};
