import { API } from 'aws-amplify';

const apiName = process.env.REACT_APP_API_NAME;

export default function api(url, options = {}) {
  if (url.indexOf('/') !== 0) {
    url = '/' + url;
  }

  const { method, ...init } = options;
  switch (method) {
    case 'DELETE':
      return API.del(apiName, url, init);

    case 'POST':
      return API.post(apiName, url, init);

    case 'PUT':
      return API.put(apiName, url, init);

    default:
      return API.get(apiName, url, init);
  }
}
