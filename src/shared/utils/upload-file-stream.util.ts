import { createWriteStream, mkdirSync } from 'fs';
import { join } from 'path';
import * as sharp from 'sharp';
import { finished } from 'stream/promises';
import { TGetArgs } from '../types';

type TSharp = ReturnType<typeof sharp>;
type ISharpSetting = Pick<
  TGetArgs<TSharp['resize']>,
  'width' | 'height' | 'fit'
> & {
  quality: number;
  toFormat: TGetArgs<TSharp['toFormat']>;
};

interface IUploadFileStream {
  readStream: () => NodeJS.ReadableStream;
  uploadDir: string;
  filename: string;
  sharpSetting?: ISharpSetting;
}

export const uploadFileStream = async ({
  readStream,
  uploadDir,
  filename,
  sharpSetting,
}: IUploadFileStream): Promise<string> => {
  const fileName = filename;
  const filePath = join(uploadDir, fileName);

  mkdirSync(uploadDir, { recursive: true });

  const inStream = readStream();
  const outStream = createWriteStream(filePath);

  if (sharpSetting) {
    const { width, height, fit, toFormat, quality } = sharpSetting;

    const transform = sharp()
      .resize({
        width,
        height,
        fit: fit,
      })
      .toFormat(toFormat)
      .jpeg({ quality: quality });

    inStream.pipe(transform).pipe(outStream);
  } else {
    inStream.pipe(outStream);
  }

  await finished(outStream);

  return filePath;
};
