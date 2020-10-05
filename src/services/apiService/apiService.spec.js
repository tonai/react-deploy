import fetchMock from 'jest-fetch-mock';

import api from './apiService';

fetchMock.enableMocks();

describe('apiService service', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('api', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    await api('/articles');
    expect(fetch.mock.calls[0][0]).toEqual('/articles');

    await api('articles');
    expect(fetch.mock.calls[1][0]).toEqual('/articles');

    await api('/articles', { method: 'POST' });
    expect(fetch.mock.calls[2][0]).toEqual('/articles');
    expect(fetch.mock.calls[2][1].method).toEqual('POST');
  });
});
