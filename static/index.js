fetch('/games')
    .then(response => response.json())
    .then(data => console.log(data));

fetch('http://localhost:3000/games/popular')
    .then(response => response.json())
    .then(data => console.log(data));

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchResults = document.querySelector('#search-results');

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const query = searchInput.value;

    try {
    const response = await fetch(`/search?query=${query}`);
    const games = await response.json();

    // Clear the previous search results
    searchResults.innerHTML = '';

    // Display the search results
    games.forEach((game) => {
        const gameContainer = document.createElement('div');
        gameContainer.className = 'game-container';

        const title = document.createElement('h3');
        title.textContent = game.title;
        gameContainer.appendChild(title);

        const description = document.createElement('p');
        description.textContent = game.description;
        gameContainer.appendChild(description);

        const image = document.createElement('img');
        image.src = game.imageUrl;
        gameContainer.appendChild(image);

        searchResults.appendChild(gameContainer);
    });
    } catch (error) {
    console.error(error);
    }
});
    