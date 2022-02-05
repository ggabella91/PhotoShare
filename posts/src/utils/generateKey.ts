import { v4 } from 'uuid';
import slugify from 'slugify';

const generateKey = (fileName: string): string => {
  const id = v4();

  const fileNameWithoutExt = fileName.substring(0, fileName.indexOf('.'));

  const slugName = slugify(fileNameWithoutExt, { lower: true, strict: true });

  const key = `${id}-${slugName}`;

  return key;
};

export { generateKey };
