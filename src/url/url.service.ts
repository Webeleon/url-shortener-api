import { CreateUrlDto } from "./dto/create-url.dto";
import { Model } from "mongoose";
import { Url } from "./url.schema";
import { CreateUrlOutDto } from "./dto/create-url.out.dto";
import { UrlNotFoundException } from "./exception/url-not-found.exception";

export class UrlService {
  constructor(private readonly urlModel: Model<Url>) {}

  async create(createUrlDto: CreateUrlDto): Promise<CreateUrlOutDto> {
    const url = await this.urlModel.create({
      originalUrl: createUrlDto.url,
      shortUrl: UrlService.generateShortCode(),
      nbClick: 0,
    });

    return {
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
    };
  }

  async findByShortUrl(shortUrl: string): Promise<string> {
    const url = await this.urlModel.findOne({
      shortUrl,
    });

    if (!url) {
      throw new UrlNotFoundException();
    }

    url.nbClicks = url.nbClicks + 1;
    await url.save();
    return url.originalUrl;
  }

  async analytics(): Promise<Url[]> {
    const urls = await this.urlModel.find({}).lean();
    return urls.map((url) => ({
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      nbClicks: url.nbClicks,
    }));
  }

  static generateShortCode(): string {
    return Math.ceil(Math.random() * 1000000000000).toString(36);
  }
}
