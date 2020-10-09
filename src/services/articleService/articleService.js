import api from '../apiService/apiService';

export default {
  addArticle(article) {
    article = { ...article, id: Date.now() };
    return api('/articles', {
      body: article,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }).then(() => article);
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
      body: article,
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT'
    });
  }
};
