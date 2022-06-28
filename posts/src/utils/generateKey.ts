import { v4 } from 'uuid';
import slugify from 'slugify';

const generateKey = (
  fileName: string,
  dropExtension: boolean = true
): string => {
  const id = v4();

  let newFileName = fileName;

  if (dropExtension) {
    newFileName = fileName.substring(0, fileName.indexOf('.'));
  }

  const slugName = slugify(newFileName, { lower: true, strict: true });

  const key = `${id}-${slugName}`;

  return key;
};

export { generateKey };
