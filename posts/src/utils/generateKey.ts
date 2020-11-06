import { v4 } from 'uuid';
import slugify from 'slugify';

const generateKey = (fileName: string): string => {
  const id = v4();
  const slugName = slugify(fileName);

  const key = `${id}-${slugName}`;

  return key;
};

export { generateKey };
