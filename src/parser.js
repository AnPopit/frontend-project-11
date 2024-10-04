const parser = (data) => {
    const parser = new DOMParser();
    try {
      const dataDOM = parser.parseFromString(data, "text/html");
      return dataDOM;
    } catch (e) {
        throw new Error('Network response was not ok.')
    }
    //возращает массив где первый элемент это фид, второй элемент это массив объектов новостей

}