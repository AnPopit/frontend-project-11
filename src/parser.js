const parser = (data) => {
  const parserCopy = new DOMParser();
  const dataDOM = parserCopy.parseFromString(data, 'text/xml');
  const errorNode = dataDOM.querySelector('parsererror');
  if (errorNode) {
    throw new Error('Ошибка парсинга');
  }
  const titleFeed = dataDOM.querySelector('channel > title').textContent;
  const descriptionFeed = dataDOM.querySelector('channel > description').textContent;
  const feed = { title: titleFeed, description: descriptionFeed };
  const item = dataDOM.querySelectorAll('channel > item');
  const posts = Array.from(item).map((el) => ({
    title: el.querySelector('title').textContent,
    link: el.querySelector('link').textContent,
    description: el.querySelector('description').textContent,
  }));
  return [feed, posts];
};

export default parser;
