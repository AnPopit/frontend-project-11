import './styles.scss';
import './request.js';
import './parser.js';
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
  });

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
    try {
      schema.validate(urlValue, { abortEarly: false })
      .then(() => request())
      .then(() => parser())
      .then((arr) => {
        watchedState.feeds.push(arr[0])
        watchedState.news.push(arr[1])
      }) // вычленяю фиды и новости 
      watchedState.errors = '';
    } catch (err) {
      watchedState.errors = '';
      err.inner.forEach((e) => {
        const value2 = i18nInstance.t(e.message.key);
        watchedState.valid = false; //как распознаь когда ошибка валиадации, а когда парсинга? будет ли указано в ключе?
        watchedState.error = value2;
      });
    }
  });
};
