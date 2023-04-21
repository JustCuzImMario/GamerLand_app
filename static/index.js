const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const apiKey = "c0c4266a6e0c49218d68459d4798adc7";
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");
import { MongoClient } from 'mongodb';
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
const uri = "mongodb+srv://patchflood17:Tydetmer14!@clustergl.niradnb.mongodb.net/?retryWrites=true&w=majority"; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
import { urlencoded, json } from 'body-parser';
import router, { post } from './routes';

app.use(urlencoded({ extended: true }));
app.use(json());

app.use('/api', router);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});




MongoClient.connect(url, function(err, client) {
  if (err) throw err;
  console.log("Database connected!");
  
  const db = client.db('gamerland_db');
  const collection = db.collection('users');

  
  app.listen(port, () => console.log(`Server running on port ${port}`));
});

post('/register', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('gamerland_db');
    const collection = database.collection('users');
    const result = await collection.insertOne(req.body);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Error registering user' });
  } finally {
    await client.close();
  }
});

post('/login', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('gamerland_db');
    const collection = database.collection('users');
    const user = await collection.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    if (user.password !== req.body.password) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Error logging in' });
  } finally {
    await client.close();
  }
});

export default router;



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
  






  