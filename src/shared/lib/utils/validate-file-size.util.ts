import { type ReadStream } from 'fs';

interface IValidateFileSizeArgs {
  fileStream: ReadStream;
  fileSizeInBytes: number;
}

export const validateFileSize = ({
  fileSizeInBytes,
  fileStream,
}: IValidateFileSizeArgs): Promise<boolean> =>
  new Promise((resolve, reject) => {
    let size = 0;

    fileStream
      .on('data', (chunk: Buffer) => {
        size = chunk.byteLength;
      })
      .on('end', () => {
        resolve(size <= fileSizeInBytes);
      })
      .on('error', () => {
        reject(false);
      });
  });
