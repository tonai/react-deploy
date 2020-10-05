import { API } from 'aws-amplify';

import api from './apiService';

jest.mock('aws-amplify');

const apiName = process.env.REACT_APP_API_NAME;

describe('apiService service', () => {
  it('api GET', async () => {
    jest.spyOn(API, 'get');

    await api('/articles');
    expect(API.get).toHaveBeenCalledWith(apiName, '/articles', {});
    API.get.mockClear();

    await api('articles');
    expect(API.get).toHaveBeenCalledWith(apiName, '/articles', {});
    API.get.mockClear();

    await api('articles', { body: 'batman' });
    expect(API.get).toHaveBeenCalledWith(apiName, '/articles', { body: 'batman' });
    API.get.mockClear();
  });

  it('api POST', async () => {
    jest.spyOn(API, 'post');

    await api('/articles', { method: 'POST' });
    expect(API.post).toHaveBeenCalledWith(apiName, '/articles', {});
    API.post.mockClear();
  });

  it('api PUT', async () => {
    jest.spyOn(API, 'put');

    await api('/articles', { method: 'PUT' });
    expect(API.put).toHaveBeenCalledWith(apiName, '/articles', {});
    API.put.mockClear();
  });

  it('api DELETE', async () => {
    jest.spyOn(API, 'del');

    await api('/articles', { method: 'DELETE' });
    expect(API.del).toHaveBeenCalledWith(apiName, '/articles', {});
    API.del.mockClear();
  });
});
