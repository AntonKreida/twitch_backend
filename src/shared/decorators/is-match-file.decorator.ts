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
  validate(value: Upload, args: ValidationArguments): boolean {
    const [listExtensions, maxSize] = args.constraints;
    const { fileName, createReadStream } = value;

    const isCorrectFormat = validateFileFormat({
      filename: fileName,
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
