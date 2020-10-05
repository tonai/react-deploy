import api from '../apiService/apiService';

export default {
  getCategories() {
    return api('/categories').then((data) => data.json());
  }
};
