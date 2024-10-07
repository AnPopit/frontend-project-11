const parser = (data) => {
    const parser = new DOMParser();
      const dataDOM = parser.parseFromString(data, "text/html");
      //console.log(data) //тут будет свойство error, любая ссылка без rss (вернуть ошибку если она есть)
      return dataDOM;
    //возращает массив где первый элемент это фид, второй элемент это массив объектов новостей
} //тут не добавляется id 

export default parser;