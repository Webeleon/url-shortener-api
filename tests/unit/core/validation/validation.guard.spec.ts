import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { validationGuard } from "../../../../src/core/validation/validation.guard";

class UserDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsEmail()
  email: string;
}

describe("Validation guard: validate a payload against a dto using class-validator ", () => {
  it("throw a formatted error", async () => {
    await expect(validationGuard({}, UserDto)).rejects.toThrow(
      "username should not be empty, username must be a string, email must be an email"
    );
  });

  it("does not throw with a valid payload", async () => {
    expect(
      await validationGuard(
        {
          username: "coco",
          email: "coco@loiseau.com",
        },
        UserDto
      )
    ).not.toBeDefined();
  });
});
