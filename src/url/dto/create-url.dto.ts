import { IsUrl } from "class-validator";

export class CreateUrlDto {
  @IsUrl(
    {},
    {
      message: "invalid url",
    }
  )
  url: string;
}
