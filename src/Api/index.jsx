import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Auth: import.meta.env.VITE_AUTH
    }
});

export const getData = async (endpoint, params) => {
  try {
    const response = await instance.get(endpoint, {
        params: {
          ...params,
          token: import.meta.env.VITE_TOKEN
        }
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export const postData = async (endpoint, data, params = {}) => {
    try {
        const response = await instance.post(endpoint, data, {
          params: {
            ...params,
            token: import.meta.env.VITE_TOKEN
          }
        });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export const putData = async (endpoint, data, params = {}) => {
    try {
      const response = await instance.put(endpoint, data, {
          params: {
              ...params,
              token: import.meta.env.VITE_TOKEN
          }
      });
      return response.data;
    } catch (err) {
      throw err;
    }
}
