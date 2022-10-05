const {
  getAllLaunches,
  addNewLaunch,
  existLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.launchDate ||
    !launch.rocket ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    // Dates are number. so we check if its not a number ---> if true ----> invalid date
    return res.status(400).json({
      error: "Invalid Date",
    });
  }

  let now = new Date();
  console.log(now.valueOf());
  console.log(launch.launchDate.valueOf());

  if (launch.launchDate.valueOf() < now.valueOf()) {
    return res.status(400).json({
      error: "Please enter a future date",
    });
  }

  await scheduleNewLaunch(launch);

  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const existLaunch = await existLaunchWithId(launchId);

  if (!existLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = await abortLaunchById(launchId);

  if(!aborted) {
    return res.status(404).json({
      error: "Launch not aborted",
    });
  }

  return res.status(200).json({
    ok: true
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
