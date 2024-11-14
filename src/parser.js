const parser = (data) => {
  const posts = [];
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
  Array.from(item).map((el) => {
    posts.push({
      title: el.querySelector('title').textContent,
      link: el.querySelector('link').textContent,
      description: el.querySelector('description').textContent,
    });
    return true;
  });
  return [feed, posts];
};

export default parser;
