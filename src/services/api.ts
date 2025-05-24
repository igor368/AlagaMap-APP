import axios from 'axios';

//teste
// const api = axios.create({
//   baseURL: 'http://192.168.0.2:3000',
// });

//produção
const api = axios.create({
  baseURL: 'https://alagamap-production.up.railway.app',
});


export default api;
