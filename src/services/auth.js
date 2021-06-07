import {customFetch} from './fetch.js';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const AuthService = () => {
  const handleLogin = async (
    email, password
  )=> {
    return await customFetch(
      'auth/admin/login',
      'POST',
      {email, password},
      config,
    );
  };

  return {
    handleLogin,
  };
};

export default AuthService();
