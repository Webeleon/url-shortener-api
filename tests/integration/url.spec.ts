import { Express } from "express";
import request from "supertest";
import { getApp } from "../../src/app";
import { Mongoose } from "mongoose";
import { urlModel } from "../../src/url/url.schema";

describe("[e2e] url", () => {
  let server: Express;
  let db: Mongoose;

  beforeEach(async () => {
    const { app, connection } = await getApp({
      uri: global.__MONGO_URI__,
    });
    server = app;
    db = connection;
  });

  afterEach(async () => {
    await urlModel.deleteMany({});
    await db.connection.close();
  });

  it("[201][POST] /api/shorturl", async () => {
    const { body, status } = await request(server).post("/api/shorturl").send({
      url: "https://webeleon.dev",
    });

    expect(status).toBe(201);
    expect(body.originalUrl).toBe("https://webeleon.dev");
    expect(body.shortUrl).toMatch(/\w+/i);
  });

  it("[400][POST] /api/shorturl", async () => {
    const { body, status } = await request(server).post("/api/shorturl").send({
      url: "https://webeleon",
    });

    expect(status).toBe(400);
    expect(body.error).toBe("invalid url");
  });

  it("[200][GET] /api/shorturl/:id", async () => {
    const createShortUrlResponse = await request(server)
      .post("/api/shorturl")
      .send({
        url: "https://webeleon.dev",
      })
      .expect(201);

    await request(server)
      .get(`/api/shorturl/${createShortUrlResponse.body.shortUrl}`)
      .expect(302)
      .expect("Location", "https://webeleon.dev");
  });

  it("[404][GET] /api/shorturl/:id", async () => {
    await request(server).get(`/api/shorturl/nope`).expect(404).expect({
      error: "url not found",
    });
  });

  it("[200][GET] analytics aka full scenario", async () => {
    const createWebeleon = await request(server)
      .post("/api/shorturl")
      .send({
        url: "https://webeleon.dev",
      })
      .expect(201);

    const createLunii = await request(server)
      .post("/api/shorturl")
      .send({
        url: "https://lunii.com",
      })
      .expect(201);

    // click 5 times on webeleon
    for (let i = 0; i < 5; i++) {
      await request(server)
        .get(`/api/shorturl/${createWebeleon.body.shortUrl}`)
        .expect(302)
        .expect("Location", "https://webeleon.dev");
    }

    // click 10 times on lunii
    for (let i = 0; i < 10; i++) {
      await request(server)
        .get(`/api/shorturl/${createLunii.body.shortUrl}`)
        .expect(302)
        .expect("Location", "https://lunii.com");
    }

    await request(server)
      .get("/api/shorturl/analytics")
      .expect(200)
      .expect([
        {
          originalUrl: "https://webeleon.dev",
          shortUrl: createWebeleon.body.shortUrl,
          nbClicks: 5,
        },
        {
          originalUrl: "https://lunii.com",
          shortUrl: createLunii.body.shortUrl,
          nbClicks: 10,
        },
      ]);
  });
});
