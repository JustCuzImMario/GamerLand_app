const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const apiKey = "c0c4266a6e0c49218d68459d4798adc7";
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const gameName = searchInput.value;
  const apiUrl = `${proxyUrl}https://api.rawg.io/api/games?search=${gameName}&key=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      if (data.results.length > 0) {
        searchResults.innerHTML = "";
        const gameCardContainer = document.createElement("div");
        gameCardContainer.classList.add("game-card-container");
        data.results.forEach((game) => {
          const gameCard = document.createElement("div");
          gameCard.classList.add("game-card");
      
          const gameTitle = document.createElement("h2");
          gameTitle.innerText = game.name;
      
          const gameCover = document.createElement("img");
          gameCover.src = game.background_image;
      
          gameCard.appendChild(gameTitle);
          gameCard.appendChild(gameCover);
          gameCardContainer.appendChild(gameCard);
        });
        searchResults.appendChild(gameCardContainer);
      } else {
        searchResults.innerHTML = "No games found!";
      }
    })
    .catch((error) => {
      console.error(error);
      searchResults.innerHTML = "Error fetching games!";
    });
});
