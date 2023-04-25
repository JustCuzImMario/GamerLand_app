import express, { json as _json, urlencoded } from 'express';
import fetch from 'node-fetch';
import morgan from 'morgan';

const app = express();

const PORT = process.env.PORT || 3000;

// Use the morgan middleware to log requests
app.use(morgan('dev'));

app.use(_json());
app.use(urlencoded({ extended: false }));

app.use('/', async (req, res, next) => {
  try {
    const url = `https://api.rawg.io${req.url}`;
    const rawgResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    const rawData = await rawgResponse.text();
    const json = JSON.parse(rawData);
    res.json(json);
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
