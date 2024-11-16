const chooseError = (error) => {
  switch (error) {
    case 'this must be a valid URL':
      return 'err.url.url';
    case 'Ошибка парсинга':
      return 'err.parse.parse';
    case 'ссылка дублируется':
      return 'err.notUnique.notUnique';
    case 'Ошибка доступа':
      return 'err.network.network';
    default:
      throw new Error('Unidentified error');
  }
};

export default chooseError;
