const request = (link) => fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
  .then(response =>  response.json())
  .then(data => data.contents)
  .catch(() => {
   throw new Error('Ошибка доступа');
  })
export default request;

