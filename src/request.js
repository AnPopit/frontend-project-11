import axios from 'axios';

const request = (link) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}&disableCache=true`)
  .then((response) => response.data.contents)
  .catch(() => {
    throw new Error('Ошибка доступа');
  });
export default request;
