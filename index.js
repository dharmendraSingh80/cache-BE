const express = require("express");
const app = express();
const port = 8000;
const Cache = require("./cache");

app.use(express.urlencoded({ extended: false }));

const cache = new Cache(100); // Create a new cache with a size of 100

app.get("/", (req, res) => {
  return res.send(
    "<h1>Express is up and running you can check your api on postman</h1>"
  );
});

// API for creating cache with a size
app.post("/cache/create/:size", (req, res) => {
  const size = parseInt(req.params.size);
  cache.size = size;
  cache.cacheMap = {};
  cache.cacheList = [];
  res.send(`Cache created with size ${size}`);
});

// Create an object in the cache
app.post("/cache/:key", (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  //ttl will be in miliseconds
  const { ttl } = req.body;
  cache.set(key, value, ttl);
  res.status(201).json({
    message: "your key is stored in cache !!",
  });
});

// Retrieve an object from the cache
app.get("/cache/:key", (req, res) => {
  const { key } = req.params;
  const value = cache.get(key);
  if (value) {
    res.status(200).json(value);
  } else {
    res.status(404).json({
      message: "your key doesn't exist !!",
    });
  }
});

// Delete an object from the cache
app.delete("/cache/:key", (req, res) => {
  const { key } = req.params;
  const status = cache.remove(key);
  if (status === 204) {
    res.status(200).json({
      message: "your key is deleted successfully !!",
    });
  } else {
    res.status(status).json({
      message: "your key doesn't exist !!",
    });
  }
});

app.listen(port, (err) => {
  if (err) {
    console.log(`Error in connecting with server ${err}`);
  }
  console.log(`Server is running on port ${port}`);
});
