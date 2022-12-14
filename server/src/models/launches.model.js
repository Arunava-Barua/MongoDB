const launches = new Map();
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

let DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 21, 2030"),
  target: "Kepler-442 b",
  customers: ["NASA", "ISRO"],
  upcoming: true,
  success: true,
};

saveLaunches(launch);

async function scheduleNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Arunava', 'NASA'],
    flightNumber: newFlightNumber
  });

  await saveLaunches(newLaunch);
}

async function existLaunchWithId (launchId) {
    return await launchesDatabase.findOne({
      flightNumber: launchId
    });
}

async function abortLaunchById (launchId) {
  const aborted = await launchesDatabase.updateOne({
    flightNumber: launchId
  }, {
    upcoming: false,
    success: false
  });

  return aborted.modifiedCount === 1;;
}

async function getLatestFlightNumber () {
  const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');

  if (!latestLaunch) {  
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDatabase.find({}, {
    '_id': 0,
    '__v': 0
  })
}

async function saveLaunches(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('Couldn\'t find planet');
  }

  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  })
}

module.exports = {
  getAllLaunches,
  existLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch
};
