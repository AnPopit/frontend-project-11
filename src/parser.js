const parser = (data) => {
  const feed = {};
  const posts = [];
  const parserCopy = new DOMParser();
  const dataDOM = parserCopy.parseFromString(data, 'text/xml');
  const errorNode = dataDOM.querySelector('parsererror');
  if (errorNode) {
    throw new Error('Ошибка парсинга');
  }
  const titleFeed = dataDOM.querySelector('channel > title').textContent;
  const descriptionFeed = dataDOM.querySelector('channel > description').textContent;
  feed.title = titleFeed;
  feed.description = descriptionFeed;
  const item = dataDOM.querySelectorAll('channel > item');
  item.forEach((el) => {
    posts.push({
      title: el.querySelector('title').textContent,
      link: el.querySelector('link').textContent,
      description: el.querySelector('description').textContent,
    });
  });
  return [feed, posts];
};

export default parser;
