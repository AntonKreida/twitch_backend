import fs from 'fs';
import { join } from 'path';

interface IDeleteFileArgs {
  pathFile: string;
}

export const deleteFile = async ({
  pathFile,
}: IDeleteFileArgs): Promise<boolean> => {
  const path = join(process.cwd(), pathFile);

  return new Promise<boolean>((resolve, reject) => {
    fs.unlink(path, (error) => {
      if (error) {
        if (error.code === 'ENOENT') resolve(true);

        reject(false);
      }

      resolve(true);
    });
  });
};
