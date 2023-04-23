const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const apiKey = "c0c4266a6e0c49218d68459d4798adc7"
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");



// RAWG API
// Search for games
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const gameName = searchInput.value;
  const apiUrl = `${proxyUrl}https://api.rawg.io/api/games?search=${gameName}&key=${apiKey}`;

  fetch(apiUrl)
    // Check for errors
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    // Display games
    .then((data) => {
      if (data.results.length > 0) {
        searchResults.innerHTML = "";
        const gameCardContainer = document.createElement("div");
        gameCardContainer.classList.add("game-card-container");

        // Loop through the games
        data.results.forEach((game) => {
            const gameCard = document.createElement("div");
            gameCard.classList.add("game-card");
      
            const gameTitle = document.createElement("h2");
            gameTitle.innerText = game.name;
      
            const gameCover = document.createElement("img");
                if (game.background_image) {
                gameCover.src = game.background_image;
                } else {
                gameCover.appendChild(document.createTextNode("No Image"));
                }

            // Append game title and cover to game card
            gameCard.appendChild(gameTitle);
            gameCard.appendChild(gameCover);
            gameCardContainer.appendChild(gameCard);

            // Add event listener to each game card
            gameCard.addEventListener('click', async () => {
                const description = await getGameDetails(game.id, 475);

                // Create popup
                const popup = document.createElement('div');
                popup.classList.add('popup');

                // Add popup content
                const popupContent = document.createElement('div');
                popupContent.classList.add('popup-content');

                // Add game title
                const popupTitle = document.createElement('h2');
                popupTitle.textContent = game.name;
                popupContent.appendChild(popupTitle);

                // Add game description
                const popupDescription = document.createElement('p');
                popupDescription.textContent = description + '...';
                popupContent.appendChild(popupDescription);

                  // Add 'read more' button
                const readMoreButton = document.createElement('button');
                readMoreButton.textContent = 'Read More';
                readMoreButton.addEventListener('click', () => {
    
                  // Get the game ID and full description from the game card
                  const gameId = game.id;
                  const fullDescription = description;
  
                  // Set the game ID and full description as query parameters in the URL for readmore.html
                  const url = `readmore.html?id=${gameId}&description=${encodeURIComponent(fullDescription)}`;
  
                  // Redirect the user to readmore.html with the query parameters in the URL
                  window.location.href = url;

                });
                popupContent.appendChild(readMoreButton);

            
                // Add 'close' button
                const closeButton = document.createElement('button');
                closeButton.textContent = 'Close';
                closeButton.addEventListener('click', () => {
                  popup.remove();
                });

                // Append popup content and close button to popup
                popupContent.appendChild(closeButton);
                popup.appendChild(popupContent);
                document.body.appendChild(popup);
            });
        });
        // Append game cards to search results
        searchResults.appendChild(gameCardContainer);

      } else {
        searchResults.innerHTML = "No games found!";
      }
    })
    // Handle errors
    .catch((error) => {
      console.error(error);
      searchResults.innerHTML = "Error fetching games!";
    });
});


// Get game details
function getGameDetails(gameId, descriptionLength) {
    const API_URL = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;
  
    return fetch(API_URL)
      .then(response => response.json())
      .then(data => data.description_raw.substring(0, descriptionLength))
      .catch(error => console.log(error));
  }





  