const axios = require('axios');

const apiKey = '7c1ad78a393c4c64928884b6c322c513';


async function getPopularGames() {
    const response = await axios.get(`https://api.rawg.io/api/games?key=${apiKey}&ordering=-rating`);
    return response.data.results;
}

module.exports = {
    getPopularGames
  };
  