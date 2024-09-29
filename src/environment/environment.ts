import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";
import Router from "next/router";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

http.interceptors.request.use((config) => {
  const cookies = parseCookies();
  const token = cookies.jwt_token;
  console.log(config.url, config.method)
  if (!(config.url === 'v1/login' && config.method === "post") && token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      destroyCookie(null, 'jwt_token', { path: '/' });

      Router.push('/');
    }

    return Promise.reject(error);
  }
);
