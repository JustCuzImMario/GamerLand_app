const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const apiKey = "c0c4266a6e0c49218d68459d4798adc7";
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");
const MongoClient = require('mongodb').MongoClient;



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
                const description = await getGameDetails(game.id, );
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
                // Add close button
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
  



  
// Connecting to MongoDB for Login and Account Creation

const uri = "mongodb+srv://patchflood17:Tydetmer14!@clustergl.niradnb.mongodb.net/?retryWrites=true&w=majority"; 
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log('Connected to database!');
  // perform database operations here
});


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



  