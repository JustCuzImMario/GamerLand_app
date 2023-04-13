fetch('/games')
    .then(response => response.json())
    .then(data => console.log(data));

fetch('http://localhost:3000/games/popular')
    .then(response => response.json())
    .then(data => console.log(data));

const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');

searchButton.addEventListener('click', () => {
    const searchInput = document.getElementById('search-input').value;

    // Send an AJAX request to the server with the search query
    fetch(`/search?query=${searchInput}`)
        .then(response => {
            console.log(`Sending search query: ${searchInput}`);
            return response.json();
        })
        .then(games => {
            console.log(`Received games: ${JSON.stringify(games)}`);
            // Clear the previous search results
            searchResults.innerHTML = '';

            // Append new elements for each game result
            games.forEach(game => {
                const gameElement = document.createElement('div');
                gameElement.classList.add('game');
                gameElement.innerHTML = `
                    <img src="${game.imageUrl}" alt="${game.title}">
                    <h3>${game.title}</h3>
                    <p>${game.description}</p>
                    <p><strong>Genres:</strong> ${game.genres.join(', ')}</p>
                    <p><strong>Platforms:</strong> ${game.platforms.join(', ')}</p>
                    <p><strong>Release Date:</strong> ${game.releaseDate}</p>
                    <p><strong>Publisher:</strong> ${game.publisher}</p>
                    <p><strong>Developer:</strong> ${game.developer}</p>
                    <p><strong>Rating:</strong> ${game.rating}/5</p>
                `;
                searchResults.appendChild(gameElement);
            });
        })
        .catch(error => {
            console.error(`Error searching for games: ${error}`);
        });
});
