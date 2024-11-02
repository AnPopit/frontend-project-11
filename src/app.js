import './styles.scss';
import _ from 'lodash';
import i18next from 'i18next';
import * as yup from 'yup';
import request from './request.js';
import parser from './parser.js';
import 'bootstrap';

import resources from './locales/index.js';
import watch from './view.js';

export default () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    yup.setLocale({
      mixed: {
        url: { key: 'err.url.url' },
      },
    });

    const schema = yup.string().url();

    const initialState = {
      valid: true,
      error: '',
      links: [],
      posts: [],
      feeds: [],

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
        return Promise.resolve(el);
      }
    };

    const watchedState = watch(elements, i18nInstance, initialState);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.valid = true;
      const formData = new FormData(e.target);
      const url = formData.get('url');
      watchedState.error = '';
      document.getElementById('url-input').focus();
      schema.validate(url, { abortEarly: false })
        .then((urlValue) => {
          findDub(initialState.links, urlValue);
          watchedState.links.push(urlValue);
          return request(urlValue);
        })
        .then((data) => parser(data))
        .then((arr) => {
          document.querySelector('.rss-form').reset();
          const [feed, posts] = arr;
          posts.forEach((el) => el.id = _.uniqueId());
          watchedState.posts.push(...posts);
          console.log(watchedState.posts);
          watchedState.feeds.push(feed);
        })
        .catch((err) => {
          watchedState.valid = true;
          let key;
          switch (err.message) {
            case 'this must be a valid URL':
              key = 'err.url.url';
              break;
            case 'Ошибка парсинга':
              key = 'err.parse.parse';
              break;
            case 'Не уникальный RSS':
              key = 'err.notUnique.notUnique';
              break;
            case 'Ошибка доступа':
              key = 'err.network.network';
              break;
            default:
              throw new Error('Unidentified error');
          }
          watchedState.valid = false;
          const value = i18nInstance.t(key);
          watchedState.error = value;
        });
    });

    const updatePost = () => {
      const promises = watchedState.links.map((link) => {
        request(link)
          .then((data) => parser(data))
          .then((arr) => {
            const [feed, posts] = arr;
            const currentPosts = _.cloneDeep(watchedState.posts);
            currentPosts.forEach((el) => delete el.id);
            const diff = _.differenceWith(posts, currentPosts, _.isEqual);
            diff.forEach((el) => el.id = _.uniqueId());
            if (diff.length !== 0) {
              watchedState.posts.push(...diff);
            }
          });
      });
      const promise = Promise.all(promises);
      promise.then(() => setTimeout(updatePost, 5000));
    };
    setTimeout(updatePost, 5000);
  });
};
