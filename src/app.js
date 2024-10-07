import './styles.scss';
import request from './request.js';
import parser from './parser.js';
import 'bootstrap';

import i18next from 'i18next';
import * as yup from 'yup';
import resources from './locales/ru.js';
import watch from './view.js';

export default async () => {
  const i18nInstance = i18next.createInstance();
  await i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  }); //переписать на then

  yup.setLocale({
    mixed: {
      url: { key: 'err.url.url' },
    },
  });

  const schema = yup.string().url();

  const initialState = {
    valid: true,
    error: '',
    links: [], //сюда добавлю ссылки, чтобы потом првоерить на уникальность
    news: [], //массив с объектами [{id, заголовок, описание} ]
    feeds: [], //массив с объектами {id, заголовок, описание}

  };

  const elements = {
    form: document.querySelector('.rss-form'),
    fields: {
      link: document.getElementById('url-input'),
    },
    submitButton: document.querySelector('button[type="submit"]'),
  };

  const watchedState = watch(elements, i18nInstance, initialState);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.valid = true;
    const formData = new FormData(e.target);
    const urlValue = formData.get('url');
    watchedState.links.push(urlValue);
    //console.log(request(urlValue))

     
      schema.validate(urlValue, { abortEarly: false })
      .then((urlValue) => request(urlValue))
      .then((data) => parser(data)) //проверить на дубликаты, добавить еще один метод в yup ? 
      .then((data) => console.log(data))
      .then((arr) => {
        watchedState.feeds.push(arr[0])
        watchedState.news.push(arr[1]) //обработка ошибок в промисах 
      }) // вычленяю фиды и новости 
      .catch((err) => {
        watchedState.errors = '';

        console.log(err.message) //
       // err.inner.forEach((e) => { //одно поле, можно оптимизировать
         // const value2 = i18nInstance.t(e.message.key);
         // watchedState.valid = false; //как распознаь когда ошибка валиадации, а когда парсинга? будет ли указано в ключе?
         // watchedState.error = value2;
        //});
      })
  });
};
