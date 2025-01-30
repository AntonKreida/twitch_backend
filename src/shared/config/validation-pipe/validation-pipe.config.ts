import { ValidationPipe } from '@nestjs/common';

class ValidationPipeConfig extends ValidationPipe {
  constructor() {
    super({
      transform: true,
    });
  }
}

export const validationPipeConfig = new ValidationPipeConfig();
