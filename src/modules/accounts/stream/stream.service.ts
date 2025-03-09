import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Upload from 'graphql-upload/GraphQLUpload.js';

import { StreamRepository } from './repositories';
import { StreamModel } from './models';
import { ChangeInfoStreamInput, SearchStreamInput } from './inputs';
import { deleteFile, uploadFileStream } from '@shared';

@Injectable()
export class StreamService {
  constructor(
    private readonly streamRepository: StreamRepository,
    private readonly configService: ConfigService,
  ) {}

  async findMany(searchStream: SearchStreamInput): Promise<StreamModel[]> {
    return await this.streamRepository.findMany(searchStream);
  }

  async findRandomStream(): Promise<StreamModel[]> {
    const countStream = this.configService.getOrThrow<number>(
      'COUNT_RANDOM_STREAM',
    );

    return await this.streamRepository.findRandomStream(countStream);
  }

  async changeInfoStream(
    userId: string,
    data: ChangeInfoStreamInput,
  ): Promise<StreamModel> {
    return await this.streamRepository.updateStream(userId, data);
  }

  async changePreviewStream(
    userId: string,
    file: Upload,
  ): Promise<StreamModel> {
    const stream = await this.streamRepository.findStreamUserById(userId);

    const filePath = await uploadFileStream({
      readStream: file.createReadStream,
      uploadDir: `${this.configService.getOrThrow<string>(
        'UPLOAD_DIR_NAME',
      )}/stream`,
      filename: `stream-preview-${stream.id}.${file.mimetype.split('/')[1]}`,
      sharpSetting: {
        width: 512,
        height: 512,
        fit: 'cover',
        toFormat: file.mimetype.split('/')[1],
        quality: 50,
      },
    });

    if (stream.streamPreview) {
      await deleteFile({
        pathFile: stream.streamPreview,
      });
    }

    await this.streamRepository.changePreviewStream(stream.id, filePath);

    return await this.streamRepository.findStreamUserById(userId);
  }
}
