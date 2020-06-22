import axios from 'axios';
const BASE_API_URL = 'http://localhost:4001';

const req = axios.create({
  baseURL: BASE_API_URL,
  timeout: 9000,
  headers: { 'Content-type': 'application/json' },
});

const get = (args, method) =>
  new Promise(async (resolve, reject) => {
    req
      .get(`${method}`, args)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

const post = (args, method) =>
  new Promise(async (resolve, reject) => {
    console.log(req);
    req
      .post(`${BASE_API_URL}${method}`, args)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export default {
  get,
  post,
};
