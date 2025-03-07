import { BadRequestException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import * as Upload from 'graphql-upload/GraphQLUpload.js';

import { validateFileFormat, validateFileSize } from '@shared';

interface IsMatchFileOptions {
  listExtensions: string[];
  maxSize: number;
}

@ValidatorConstraint({ async: false })
export class IsMatchFileConstraint implements ValidatorConstraintInterface {
  async validate(value: Upload, args: ValidationArguments): Promise<boolean> {
    const [listExtensions, maxSize] = args.constraints;
    const { filename, createReadStream } = await value;

    console.log(value);

    const isCorrectFormat = validateFileFormat({
      filename,
      formats: listExtensions,
    });

    if (!isCorrectFormat) {
      throw new BadRequestException('Неверный формат файла!');
    }

    const stream = createReadStream();

    const isValidSize = validateFileSize({
      fileSizeInBytes: maxSize,
      fileStream: stream,
    });

    if (!isValidSize) {
      throw new BadRequestException('Файл слишком большой!');
    }

    return true;
  }
}

export function IsMatchFile(
  fileOptions: IsMatchFileOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [fileOptions.listExtensions, fileOptions.maxSize],
      validator: IsMatchFileConstraint,
    });
  };
}
