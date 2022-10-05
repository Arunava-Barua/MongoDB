// Server code here

const http = require("http");
const mongoose = require("mongoose");

const {MONGO_URL} = require('../secret')

const app = require("./app");

const { loadPlanetsData } = require("../src/models/planets.model");

const PORT = process.env.PORT || 8000;



const server = http.createServer(app);

mongoose.connection.once('open', () => console.log('MongoDB connection ready'));
mongoose.connection.on('error', (err) => console.error(err));

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log("Listening on port " + PORT);
  });
}

startServer();
