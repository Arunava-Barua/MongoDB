const app = require("../../app.js");
const request = require("supertest");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("GET /launches endpoint", () => {
    test("It should return 200 success", async () => {
      await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("POST /launches endpoint", () => {
    const completeLaunchData = {
      mission: "Arv Travels",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "January 4, 2030",
    };

    const launchDataWithoutDate = {
      mission: "Arv Travels",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
    };

    test("It should return 201", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);
      
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });
  });
});
