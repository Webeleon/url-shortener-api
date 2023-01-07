import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { ValidationException } from "./Validation.exception";

/**
 * Validate a payload against a DTO
 *
 * Nested validation is not implemented since it's not used in this project.
 * Can be implemented easily by looking at the children property in the ValidationError and recursively formatting errors.
 *
 * @param payload payload to validate
 * @param target dto class using class-validator annotations
 * @returns {Promise<void>}
 */
export const validationGuard = async (
  payload: any,
  target: any
): Promise<void> => {
  const toValidate = plainToInstance(target, payload);
  const errors = await validate(toValidate, {
    forbidNonWhitelisted: true,
  });
  if (errors.length > 0) {
    const messages: string[] = errors.reduce(
      (errorMessages: string[], error: ValidationError): string[] => {
        const { constraints } = error;
        return [...errorMessages, ...Object.values(constraints)];
      },
      []
    );
    throw new ValidationException(messages.join(", "));
  }
};
