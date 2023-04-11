const axios = require('axios');

const apiKey = '7c1ad78a393c4c64928884b6c322c513';

async function getPopularGames(platform, genre, title) {
  let url = `https://api.rawg.io/api/games?key=${apiKey}&ordering=-rating`;

  if (platform) {
    url += `&platforms=${platform}`;
  }

  if (genre) {
    url += `&genres=${genre}`;
  }

  if (title) {
    url += `&search=${title}`;
  }

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error(`Error getting games: ${error.message}`);
    return { error: 'Could not retrieve games at this time. Please try again later.' };
  }
}

module.exports = {
  getPopularGames,
};
