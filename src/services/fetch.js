import axios from 'axios';

const {REACT_APP_SERVER_URL} = process.env;

const customFetch = (
  path,
  reqType,
  body,
  config,
)=> {
  const reqOptions = {
    POST: async function () {
      try {
        const serverRes = await axios.post(
          `${REACT_APP_SERVER_URL}/${path}`,
          JSON.stringify(body),
          config,
        );
        return {serverRes, error: false};
      } catch (e) {
        return {serverRes: e.response.data, error: true};
      }
    },
    GET: async function () {
      try {
        const serverRes = await axios.get(`${REACT_APP_SERVER_URL}/${path}`, config);
        return {serverRes, error: false};
      } catch (e) {
        return {serverRes: e.response.data, error: true};
      }
    },
  };
  if (!reqOptions[reqType]) {
    throw new Error('Invalid request type');
  }
  return reqOptions[reqType]();
};

export {customFetch};
