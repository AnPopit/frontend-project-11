const request = (link) => {
    fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Ошибка сети')
  })
  .then(data => data.contents); 
}

