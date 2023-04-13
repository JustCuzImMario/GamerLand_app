fetch('/games')
    .then(response => response.json())
    .then(data => console.log(data));

fetch('http://localhost:3000/games/popular')
    .then(response => response.json())
    .then(data => console.log(data));
