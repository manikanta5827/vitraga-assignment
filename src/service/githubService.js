const axios = require('axios');

async function fetchGitHubEvents() {
  try {
    const url = 'https://api.github.com/events';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'GitHub-Events-Subscriber/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('GitHub API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
}

module.exports = fetchGitHubEvents;
