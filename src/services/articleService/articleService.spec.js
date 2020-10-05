import api from '../apiService/apiService';

import articleService from './articleService';

jest.mock('../apiService/apiService');

describe('articleService service', () => {
  afterEach(() => {
    api.mockClear();
  });

  it('getArticle', async () => {
    await articleService.getArticle(42);
    expect(api).toHaveBeenCalledWith('/articles/42');
  });

  it('getArticles', async () => {
    await articleService.getArticles();
    expect(api).toHaveBeenCalledWith('/articles');
  });

  it('addArticle', async () => {
    await articleService.addArticle({ id: 42 });
    // expect(api).toHaveBeenCalledWith('/articles');
    expect(api.mock.calls[0][0]).toEqual('/articles');
    expect(api.mock.calls[0][1].method).toEqual('POST');
  });

  it('updateArticle', async () => {
    await articleService.updateArticle({ id: 42 });
    // expect(api).toHaveBeenCalledWith('/articles/42');
    expect(api.mock.calls[0][0]).toEqual('/articles/42');
    expect(api.mock.calls[0][1].method).toEqual('PUT');
  });

  it('removeArticle', async () => {
    await articleService.removeArticle(42);
    // expect(api).toHaveBeenCalledWith('/articles/42');
    expect(api.mock.calls[0][0]).toEqual('/articles/42');
    expect(api.mock.calls[0][1].method).toEqual('DELETE');
  });
});
