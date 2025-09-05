const axios = require('axios');

async function fetchGitHubEvents() {
  const url = 'https://api.github.com/events';
  const response = await axios.get(url);
  return response.data;
}

module.exports = fetchGitHubEvents;
