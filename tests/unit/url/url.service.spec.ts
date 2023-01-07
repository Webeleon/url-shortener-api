import { UrlService } from "../../../src/url/url.service";
import { Mongoose } from "mongoose";
import { mongooseConnection } from "../../../src/core/mongoose/connection";
import { urlModel } from "../../../src/url/url.schema";
import { UrlNotFoundException } from "../../../src/url/exception/url-not-found.exception";

describe("Url service", () => {
  let urlService: UrlService;
  let db: Mongoose;

  beforeEach(async () => {
    /*
    I chose to run all service tests with an in memory database thrown between each tests instead of mocking a model with an in memory datastore.
     */
    db = await mongooseConnection({
      uri: global.__MONGO_URI__,
    });
    urlService = new UrlService(urlModel);
  });

  afterEach(async () => {
    await urlModel.deleteMany({});
    await db.connection.close();
  });

  it("create", async () => {
    const url = await urlService.create({
      url: "https://webeleon.dev",
    });

    expect(url.originalUrl).toBe("https://webeleon.dev");
    expect(url.shortUrl.length).toBeGreaterThan(1);
  });

  it("find url by short code and increase redirect count", async () => {
    const createdUrl = await urlService.create({
      url: "https://webeleon.dev",
    });

    const url = await urlService.findByShortUrl(createdUrl.shortUrl);
    expect(url).toBe("https://webeleon.dev");

    const doc = await urlModel.findOne({
      shortUrl: createdUrl.shortUrl,
    });
    expect(doc.nbClicks).toBe(1);
  });

  it("throw an exception if the short url is not fpund", async () => {
    await expect(urlService.findByShortUrl("not found")).rejects.toThrow(
      UrlNotFoundException
    );
  });

  it("return analitycs", async () => {
    const seeds = [
      {
        originalUrl: "https://webeleon.dev",
        shortUrl: "asdasd",
        nbClicks: 10,
      },
      {
        originalUrl: "https://lunii.com",
        shortUrl: "coolcool",
        nbClicks: 25,
      },
      {
        originalUrl: "https://www.mybookinou.com/",
        shortUrl: "okokahah",
        nbClicks: 5,
      },
    ];
    for (const url of seeds) {
      await urlModel.create(url);
    }

    const analitycs = await urlService.analytics();
    for (const analityc of analitycs) {
      expect(typeof analityc.originalUrl).toBe("string");
      expect(typeof analityc.shortUrl).toBe("string");
      expect(typeof analityc.nbClicks).toBe("number");
      //@ts-ignore not defined in the type but setted by default by mongo, checking serialization
      expect(analityc._id).not.toBeDefined();
    }
  });

  it("generate random code", () => {
    expect(UrlService.generateShortCode().length).toBeGreaterThan(1);

    /*
    testing collision with 10000 calls, it's not 100% bullet proof.
    more iteration would take a long time 2sec for 100000
    a map is used since the query for an item is faster than looking into an array
     */
    const codes: Map<string, boolean> = new Map();
    for (let i = 0; i < 10000; i++) {
      const code = UrlService.generateShortCode();
      expect(codes.get(code)).toBe(undefined);
      codes.set(code, true);
    }
  });
});
