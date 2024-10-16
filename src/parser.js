const parser = (data) => {
  const feed = {};
  const posts = [];
    const parser = new DOMParser();
      const dataDOM = parser.parseFromString(data, "text/html");
      const errorNode = dataDOM.querySelector("parsererror");
      if (errorNode) {
        throw new Error('Ошибка парсинга');
      }
      const titleFeed = dataDOM.querySelector('channel > title').textContent;
      const descriptionFeed = dataDOM.querySelector('channel > description').textContent;
      feed.title = titleFeed;
      feed.description = descriptionFeed;
      ///console.log(dataDOM.querySelector('description'))
      //console.log(dataDOM.querySelector('title'))
      const item = dataDOM.querySelectorAll('channel > item');
      item.forEach((el) => {
        posts.push({
          title: el.querySelector('title').textContent,
          link: el.querySelector('link').nextSibling.textContent, //куда пропал link????????????
          description: el.querySelector('description').textContent
        })
      })
      return [feed, posts];
    //возращает массив где первый элемент это фид, второй элемент это массив объектов новостей
} //тут не добавляется id 

export default parser;