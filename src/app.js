import './styles.scss';
import _ from 'lodash';
import i18next from 'i18next';
import * as yup from 'yup';
import request from './request.js';
import chooseError from './chooseError.js';
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

    const defaultSchema = yup.string().url();

    const initialState = {
      valid: '', // проверка на валидность
      error: '',
      links: [],
      posts: [],
      feeds: [],
      touchPost: [],
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
      const formData = new FormData(e.target);
      const url = formData.get('url');
      watchedState.error = '';
      elements.fields.link.focus();
      const schema = defaultSchema.notOneOf(watchedState.links, 'ссылка дублируется');
      schema.validate(url, { abortEarly: false })
        .then((urlValue) => request(urlValue))
        .then((data) => parser(data))
        .then((arr) => {
          watchedState.links.push(url);
          watchedState.valid = true;
          elements.form.reset();
          const [feed, posts] = arr;
          const postsWithID = posts.map((el) => {
            const element = el;
            element.id = _.uniqueId();
            return element;
          });
          watchedState.posts.push(...postsWithID);
          watchedState.feeds.push(feed);
        })
        .catch((err) => {
          const key = chooseError(err.message);
          const value = i18nInstance.t(key);
          watchedState.error = value;
          watchedState.valid = false;
        });
    });

    const updateInterval = 5000;

    const updatePost = () => {
      const promises = watchedState.links.map((link) => {
        request(link)
          .then((data) => parser(data))
          .then((arr) => {
            const [, posts] = arr;
            const currentPosts = _.cloneDeep(watchedState.posts);
            const postsWithoutID = currentPosts.map((el) => {
              const element = el;
              delete element.id;
              return element;
            });
            const diff = _.differenceWith(posts, postsWithoutID, _.isEqual);
            const postsWithID = diff.map((el) => {
              const element = el;
              element.id = _.uniqueId();
              return element;
            });
            if (diff.length !== 0) {
              watchedState.posts.push(...postsWithID);
            }
          })
          .catch((e) => {
            throw e;
          });
        return watchedState.posts;
      });
      const promise = Promise.all(promises);
      promise.then(() => setTimeout(updatePost, updateInterval));
    };
    setTimeout(updatePost, updateInterval);
  });
};
