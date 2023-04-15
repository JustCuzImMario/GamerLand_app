const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchQuery = searchInput.value;
    fetch(`https://api.rawg.io/api/games?search=${searchQuery}`)
        .then((response) => response.json())
        .then((data) => {
            searchResults.innerHTML = "";
            data.results.forEach((game) => {
                const gameCard = document.createElement("div");
                gameCard.classList.add("game-card");

                const gameTitle = document.createElement("h2");
                gameTitle.innerText = game.name;

                const gameCover = document.createElement("img");
                gameCover.src = game.background_image;

                gameCard.appendChild(gameTitle);
                gameCard.appendChild(gameCover);
                searchResults.appendChild(gameCard);
            });
        });
});

