import { PostFile } from './post.types';

export const addPostFileToArray = (fileArray: PostFile[], file: PostFile) => {
  return [...fileArray, file];
};
