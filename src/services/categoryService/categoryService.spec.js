import api from '../apiService/apiService';

import categoryService from './categoryService';

jest.mock('../apiService/apiService');

describe('categoryService service', () => {
  afterEach(() => {
    api.mockClear();
  });

  it('getCategories', async () => {
    await categoryService.getCategories();
    expect(api).toHaveBeenCalledWith('/categories');
  });
});
