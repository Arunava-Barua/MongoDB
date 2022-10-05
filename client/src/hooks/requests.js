const API_LINK = "http://localhost:5000";

async function httpGetPlanets() {
  // TODO: Once API is ready.

  const response = await fetch(`${API_LINK}/planets`);

  return await response.json();
  // Load planets and return as JSON.
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  const response = await fetch(`${API_LINK}/launches`);

  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  try {
    return await fetch(`${API_LINK}/launches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (error) {
    return {
      ok: false,
    };
  }
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  try {
    return await fetch(`${API_LINK}/launches/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    return {
      ok: false,
    }
  }
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
