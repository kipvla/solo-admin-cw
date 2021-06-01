import {CustomResponse} from '../interfaces';
import {customFetch} from './fetch.ts';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const AuthService = () => {
  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<CustomResponse<any>> => {
    return await customFetch<any>(
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
