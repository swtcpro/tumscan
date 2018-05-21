/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/4/14
 \* Time: 22:17
 \* Description:
 \*/


import Env from './env';
import axios from 'axios'

axios.defaults.withCredentials = true;
// axios.interceptors.response.use(function (response) {
//   console.log(response);
//   return response;
// }, function (error) {
//   console.log(response);
//   // 对响应错误做点什么
//   return Promise.reject(error);
// });

//基地址
let base = Env.baseURL;

//测试使用
export const ISDEV = Env.isDev;

// download url
export const downloadUrl = url => {
  location.href = `${base}${url}`;
};

//通用方法
export const POST = (url, params) => {
  return axios.post(`${base}${url}`, params).then(res => res.data)
};

export const GET = (url, params) => {
  return axios.get(`${base}${url}`, {params: params}).then(res => res.data)
};

export const PUT = (url, params) => {
  return axios.put(`${base}${url}`, params).then(res => res.data)
};

export const DELETE = (url, params) => {
  return axios.delete(`${base}${url}`, {params: params}).then(res => res.data)
};

export const PATCH = (url, params) => {
  return axios.patch(`${base}${url}`, params).then(res => res.data)
};
