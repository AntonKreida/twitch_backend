import { BadRequestException, ValidationPipe } from '@nestjs/common';

class ValidationPipeConfig extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((acc, error) => {
          const { property, constraints } = error;

          acc[property] = Object.values(constraints).join(', ');

          return acc;
        }, {} as Record<string, string>);

        const jsonString = JSON.stringify(formattedErrors);

        return new BadRequestException(jsonString);
      },
    });
  }
}

export const validationPipeConfig = new ValidationPipeConfig();
