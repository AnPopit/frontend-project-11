import onChange from 'on-change';

export default (elements, i18n, initialState) => {
  const createModal = (title, link, description) => {
    const divAll = document.querySelector('.modal');
    divAll.innerHTML = `<div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">${title}</h5>
        <button type="button" class="btn-close close" data-bs-dismiss="modal" aria-label="Close">
          </button>
          </div>
          <div class="modal-body text-break">${description}</div>
          <div class="modal-footer">
            <a class="btn btn-primary full-article" href="${link}" role="button" target="_blank" rel="noopener noreferrer">${i18n.t('inter.posts.readFull')} </a>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18n.t('inter.posts.close')}</button>
            </div>
            </div>
            </div>`;
    const body = document.querySelector('body');
    const divFooter = document.createElement('div');
    divFooter.classList.add('modal-backdrop', 'fade', 'show');
    body.classList.add('modal-open');
    body.style = 'overflow: hidden; padding-right: 17px;';
    divAll.classList.add('show');
    divAll.style = 'display: block;';
    divAll.ariaModal = 'true';
    divAll.role = 'dialog';
    divAll.removeAttribute('aria-hidden');
    const close = document.querySelectorAll('[data-bs-dismiss="modal"]');
    close.forEach((el) => el.addEventListener('click', () => {
      divFooter.remove();
      divAll.style = 'display: none;';
      divAll.removeAttribute('[aria-hidden="true"]');
      divAll.classList.remove('show');
      divAll.removeAttribute('aria-modal');
      divAll.removeAttribute('role');
    }));
  };

  const touchPost = [];

  const renderClass = () => {
    const el2 = elements.fields.link;
    const feedback = document.querySelector('.feedback');
    if (initialState.valid) {
      el2.classList.remove('is-invalid');
      el2.classList.add('is-valid');
      feedback.textContent = i18n.t('success.load.load');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
    } else {
      el2.classList.remove('is-valid');
      el2.classList.add('is-invalid');
      feedback.textContent = initialState.error;
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
    }

    if (initialState.error.length === 0) {
      el2.classList.remove('is-invalid');
      el2.classList.add('is-valid');

      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = i18n.t('success.load.load');
    }
  };

  const renderFeed = () => {
    const feedsDiv = document.querySelector('div .feeds');
    feedsDiv.innerHTML = '';
    const divCardFirst = document.createElement('div');
    divCardFirst.classList.add('card', 'border-0');
    feedsDiv.append(divCardFirst);
    const divCardSecond = document.createElement('div');
    divCardSecond.classList.add('card-body');
    divCardFirst.append(divCardSecond);
    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    divCardSecond.append(h2);
    h2.textContent = i18n.t('inter.feeds.feeds');
    if (!(feedsDiv.querySelector('ul'))) {
      const ulNew = document.createElement('ul');
      ulNew.classList.add('list-group', 'border-0', 'rounded-0');
      divCardFirst.append(ulNew);
    }
    const ul = feedsDiv.querySelector('ul');

    const { feeds } = initialState;
    feeds.forEach((feed) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'border-0', 'border-end-0');
      ul.append(li);
      const h3 = document.createElement('h3');
      h3.classList.add('h6', 'm-0');
      h3.textContent = feed.title;
      const p = document.createElement('p');
      p.classList.add('m-0', 'small', 'text-black-50');
      p.textContent = feed.description;
      li.append(h3);
      li.append(p);
    });
  };

  const renderNews = () => {
    const postsDiv = document.querySelector('div .posts');
    postsDiv.innerHTML = '';
    const divCardFirst = document.createElement('div');
    divCardFirst.classList.add('card', 'border-0');
    postsDiv.append(divCardFirst);
    const divCardSecond = document.createElement('div');
    divCardSecond.classList.add('card-body');
    divCardFirst.append(divCardSecond);
    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    divCardSecond.append(h2);
    h2.textContent = i18n.t('inter.posts.posts');
    if (!(postsDiv.querySelector('ul'))) {
      const ulNew = document.createElement('ul');
      ulNew.classList.add('list-group', 'border-0', 'rounded-0');
      divCardFirst.append(ulNew);
    }
    const ul = postsDiv.querySelector('ul');
    const { posts } = initialState;
    posts.forEach((post) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      ul.append(li);
      const a = document.createElement('a');
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.href = post.link;
      a.classList.add('fw-bold');
      if (touchPost.includes(post.id)) {
        a.classList.add('fw-normal', 'link-secondary');
        a.classList.remove('fw-bold');
      }
      a.textContent = post.title;
      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.type = 'button';
      const title = document.querySelector('title');
      button.dataset.id = title.textContent;
      button.dataset.bs_toggle = 'modal';
      button.dataset.bs_target = '#modal';
      button.textContent = i18n.t('inter.posts.watch');
      li.append(a);
      li.append(button);
      button.addEventListener('click', () => {
        createModal(post.title, post.link, post.description);
        touchPost.push(post.id);
        console.log(post);
        if (touchPost.includes(post.id)) {
          a.classList.add('fw-normal', 'link-secondary');
          a.classList.remove('fw-bold');
        }
      });
    });
  };

  const render = (path) => {
    switch (path) {
      case 'error':
        renderClass();
        break;
      case 'feeds':
        renderFeed();
        break;
      case 'posts':
        renderNews();
        break;

      default:
        break;
    }
  };

  return onChange(initialState, render);
};
