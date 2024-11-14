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
      valid: '', //проверка на валидность
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
        return el;
      }
    };

    const chooseError = (error) => {
      switch (error) {
        case 'this must be a valid URL':
          return 'err.url.url';
        case 'Ошибка парсинга':
          return'err.parse.parse';
        case 'Не уникальный RSS':
          return 'err.notUnique.notUnique';
        case 'Ошибка доступа':
          return 'err.network.network';
        default:
          throw new Error('Unidentified error');
      }
    }

    const watchedState = watch(elements, i18nInstance, initialState);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url'); //вынести эту переменную в состояние
      watchedState.error = '';
      elements.fields.link.focus();
      schema.validate(url, { abortEarly: false })
        .then((urlValue) => {
          findDub(initialState.links, urlValue);
          watchedState.links.push(urlValue); //дождать пока пройдут проверки и тогда добавлять ее в массив ссылок
          return request(urlValue); //можно без этого
        })
        .then((data) => parser(data))
        .then((arr) => {
          watchedState.valid = true;
          elements.form.reset();
          const [feed, posts] = arr;
          posts.map((el) => {
            const element = el;
            element.id = _.uniqueId();
          });
          watchedState.posts.push(...posts);
          watchedState.feeds.push(feed);
          
          //сюда вставить код на добавление ссылки в массив
        })
        .catch((err) => {
          const key = chooseError(err.message)
          const value = i18nInstance.t(key);
          watchedState.error = value;
          watchedState.valid = false;
        });
    });

    const updatePost = () => {
      const promises = watchedState.links.map((link) => {
        request(link)
          .then((data) => parser(data))
          .then((arr) => {
            const [, posts] = arr;
            const currentPosts = _.cloneDeep(watchedState.posts);
            currentPosts.forEach((el) => {
              const element = el;
              delete element.id;
            });
            const diff = _.differenceWith(posts, currentPosts, _.isEqual);
            diff.forEach((el) => {
              const element = el;
              element.id = _.uniqueId();
            });
            if (diff.length !== 0) {
              watchedState.posts.push(...diff);
            }
          });
        return true; // отключить правила линтера
      });
      const promise = Promise.all(promises);
      promise.then(() => setTimeout(updatePost, 5000));
    };

    //if () { //запускать проверку только если в массиве ссылок есть текущая ссылка из состояния
      //console.log('ddd')
      setTimeout(updatePost, 5000);
    //}    
  });
};
