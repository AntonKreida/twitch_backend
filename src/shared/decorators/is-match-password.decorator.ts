import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsMatchPasswordConstraint implements ValidatorConstraintInterface {
  validate(passwordRepeat: string, args: ValidationArguments) {
    const objectRequest = args.object as { password: string };

    console.log(objectRequest);

    return passwordRepeat === objectRequest.password;
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'Пароли не совпадают';
  }
}

export function IsMatchPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMatchPasswordConstraint,
    });
  };
}
