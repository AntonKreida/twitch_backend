interface IValidateFileFormatArgs {
  filename: string;
  formats: string[];
}

export const validateFileFormat = ({
  filename,
  formats,
}: IValidateFileFormatArgs): boolean => {
  const extension = filename.split('.').pop();
  const isCorrectFormat = formats.includes(extension);

  return isCorrectFormat;
};
