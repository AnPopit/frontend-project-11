import 'bootstrap';

import i18next from 'i18next';
import * as yup from 'yup';
import resources from '.';
import watch from './view';

export default async () => {
    const elements = {
      form: document.querySelector('#form'),
      fields: {},
      errorFields: {},
    };
  
    const defaultLang = 'ru';
  
    const state = {
      form: {
        status: null,
        valid: false,
        errors: [],
      },
    };
  
    yup.setLocale({
      mixed: {
        required: () => ({ key: 'errors.validation.required' }),
        oneOf: () => ({ key: 'errors.validation.confirmPassword' }),
      },
      string: {
        min: ({ min }) => ({ key: 'errors.validation.min', values: { count: min } }),
        max: ({ max }) => ({ key: 'errors.validation.max', values: { count: max } }),
      },
    });
  
    const i18n = i18next.createInstance();
    await i18n.init({
      lng: defaultLang,
      debug: false,
      resources,
    });
  
    const watchedState = watch(elements, i18n, state);
    watchedState.form.status = 'filling';
  
    const schema = yup.object({
      username: yup.string().required().min(3).max(10),
      password: yup.string().required().min(6).max(12),
      confirmPassword: yup.string().required().oneOf([yup.ref('password')]),
    });
  
    elements.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const newUser = Object.fromEntries(formData);
      try {
        await schema.validate(newUser, { abortEarly: false });
        watchedState.form.errors = [];
        watchedState.form.valid = true;
      } catch (err) {
        const validationErrors = err.inner.reduce((acc, cur) => {
          const { path, message } = cur;
          const errorData = acc[path] || [];
          return { ...acc, [path]: [...errorData, message] };
        }, {});
        watchedState.form.errors = validationErrors;
      }
    });
  };