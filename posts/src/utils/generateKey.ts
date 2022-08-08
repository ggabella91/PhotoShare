import { v4 } from 'uuid';
import slugify from 'slugify';

const generateKey = (
  fileName: string,
  dropExtension: boolean = true
): string => {
  const id = v4();

  let newFileName = fileName;
  let extension: string = '';

  [newFileName, extension] = fileName.split('.');

  const slugName = slugify(newFileName, { lower: true, strict: true });

  const key = `${id}-${slugName}${dropExtension ? '' : `.${extension}`}`;

  return key;
};

export { generateKey };
