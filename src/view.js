import onChange from 'on-change';

export default (elements, i18n, initialState) => { // принимает состояние
  const renderClass = () => {
    const el2 = elements.fields.link;
    if (initialState.form.valid) {
      el2.classList.remove('is-invalid');
      el2.classList.add('is-valid');
    } else {
      el2.classList.remove('is-valid');
      el2.classList.add('is-invalid');
    }

    if (initialState.errors.length === 0) {
      el2.classList.remove('is-invalid');
      el2.classList.add('is-valid');
    }
  };

  const renderError = () => {
    const feedback = document.querySelector('.feedback');
    feedback.textContent = initialState.error;
  };

  const renderFeed = () => {
//выводит структуру фидов и новостей
  }

  const render = (path) => {
    switch (path) {
      case 'errors':
        renderError();
        renderClass();
        break;
    case 'feeds':
        renderFeed()
        break;

      default:
        break;
    }
  };

  return onChange(initialState, render);
  // END
};
