import onChange from 'on-change';
import { Modal } from 'bootstrap';

export default (elements, i18n, initialState) => {
  const createModal = (title, link, description) => {
    const modal = document.getElementById('modal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const linkButtonRead = modal.querySelector('.btn-primary');
    modalTitle.textContent = title;
    modalBody.textContent = description;
    linkButtonRead.href = link;
    linkButtonRead.textContent = i18n.t('inter.posts.readFull');
    const bootstrapModal = new Modal(modal);
    bootstrapModal.show();
  };

  const checkExisUl = (selector, div) => {
    if (!(selector)) {
      const ulNew = document.createElement('ul');
      ulNew.classList.add('list-group', 'border-0', 'rounded-0');
      div.append(ulNew);
    }
  };

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
      console.log(initialState.error);
      el2.classList.remove('is-valid');
      el2.classList.add('is-invalid');
      feedback.textContent = initialState.error;
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
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
    checkExisUl(feedsDiv.querySelector('ul'), divCardFirst);
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
  const postsDiv = document.querySelector('div .posts');

  const renderNews = () => {
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
    checkExisUl(postsDiv.querySelector('ul'), divCardFirst);
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
      if (initialState.touchPost.includes(post.id)) {
        a.classList.add('fw-normal', 'link-secondary');
        a.classList.remove('fw-bold');
      }
      a.textContent = post.title;
      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.type = 'button';
      a.dataset.id = post.id;
      button.dataset.id = post.id;
      button.dataset.bs_toggle = 'modal';
      button.dataset.bs_target = '#modal';
      button.textContent = i18n.t('inter.posts.watch');
      li.append(a);
      li.append(button);
    });
  };

  postsDiv.addEventListener('click', (e) => {
    if (e.target && e.target.tagName === 'BUTTON') {
      const modalID = e.target.dataset.id;
      const currentPost = initialState.posts.find((el) => el.id === modalID);
      console.log(currentPost);
      const titleModal = currentPost.title;
      const linkModal = currentPost.link;
      const descriptionModal = currentPost.description;
      createModal(titleModal, linkModal, descriptionModal);
      initialState.touchPost.push(modalID);
      if (initialState.touchPost.includes(modalID)) {
        const a = document.querySelector(`a[data-id="${modalID}"]`);
        a.classList.add('fw-normal', 'link-secondary');
        a.classList.remove('fw-bold');
      }
    }
  });

  const render = (path) => {
    switch (path) {
      case 'valid':
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
