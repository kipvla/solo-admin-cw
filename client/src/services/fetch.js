import axios from 'axios';
import {URL} from '../assets/constants/url';

const customFetch = (
  path,
  reqType,
  body,
  config,
)=> {
  const reqOptions = {
    POST: async function () {
      try {
        console.log(`${URL}/${path}`, body, config);
        const serverRes = await axios.post(
          `${URL}/${path}`,
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
        const serverRes = await axios.get(`${URL}/${path}`, config);
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