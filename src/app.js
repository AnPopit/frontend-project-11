import './styles.scss';
import request from './request.js';
import parser from './parser.js';
import 'bootstrap';

import i18next from 'i18next';
import * as yup from 'yup';
import resources from './locales/index.js';
import watch from './view.js';

export default () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => i18nInstance).catch(() => {
    throw new Error('Ошибка инициализации')
  })

  yup.setLocale({
    mixed: {
      url: { key: 'err.url.url' },
    },
  });

  const schema = yup.string().url();

  const initialState = {
    valid: true,
    error: '1',
    links: [], //сюда добавлю ссылки, чтобы потом првоерить на уникальность
    posts: [], //массив с объектами [{id, заголовок, описание} ]
    feeds: [], //массив с объектами {id, заголовок, описание}

  };

  const elements = {
    form: document.querySelector('.rss-form'),
    fields: {
      link: document.getElementById('url-input'),
    },
    submitButton: document.querySelector('button[type="submit"]'),
  };

  const findDub = (array, el) => {
    if (array.includes(el)) {
      throw new Error('Не уникальный RSS');
    } else {
      return Promise.resolve(el)
    }
  };

  const watchedState = watch(elements, i18nInstance, initialState);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.valid = true;
    const formData = new FormData(e.target);
    const urlValue = formData.get('url');
    watchedState.error = '';
    document.querySelector('.rss-form').reset();
    document.getElementById('url-input').focus();
      schema.validate(urlValue, { abortEarly: false })
      .then((urlValue) => findDub(initialState.links, urlValue))
      .then((urlValue) => {
        watchedState.links.push(urlValue);
        return request(urlValue)})
      .then((data) => parser(data))
      .then((arr) => {
        watchedState.posts.push(arr[1])
        watchedState.feeds.push(arr[0])
        //console.log( JSON.parse(JSON.stringify(watchedState.posts)).length)
         //обработка ошибок в промисах 
      }) // вычленяю фиды и новости 
      .catch((err) => {
        watchedState.valid = true;
        let key;
        switch(err.message) {
          case 'this must be a valid URL':
            key = 'err.url.url';
            break;
          case 'Ошибка парсинга':
            key = 'err.parse.parse';
            break;
          case 'Не уникальный RSS':
            key = 'err.notUnique.notUnique';
          case 'Ошибка доступа':
            key = 'err.network.network';
        }
        watchedState.valid = false;
        const value = i18nInstance.t(key);
        watchedState.error = value;
      })
  });
};
