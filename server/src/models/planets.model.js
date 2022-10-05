const { parse } = require("csv-parse");
const assert = require("assert");
const fs = require("fs");
const { resolve } = require("path");

const planets = require('./planets.mongo');

const path = require("path");

// const habitablePlanets = [];

function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "..", "..", "data", "keplers_data.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("headers", (headers) => {
        console.log(headers[0]);
      })
      .on("data", async (data) => {
        if (isHabitable(data)) {
          //insert + update = upsert
          // TODO
          await planets.updateOne({
            keplerName: data.kepler_name,
          }, {
            keplerName: data.kepler_name,
          }, {
            upsert: true
          } );
          // habitablePlanets.push(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(
          `There are ${countPlanetsFound} number of habitable planets`
        );
        resolve();
      });
  });
}

async function getAllPlanets(req,res) {
  return await planets.find({},{
    '_id': 0,
    '__v': 0
  }); // Show all planets
}

module.exports = {
  loadPlanetsData,
  getAllPlanets
};
