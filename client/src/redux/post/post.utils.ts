import { PostFile } from './post.types';

export const addPostFileToArray = (fileArray: PostFile[], file: PostFile) => {
  for (let el of fileArray) {
    if (el.s3Key === file.s3Key) {
      return [...fileArray];
    }
  }

  return [file, ...fileArray];
};

export const addSuggestedUserPhotoFileToArray = (
  fileArray: PostFile[],
  file: PostFile
) => {
  for (let el of fileArray) {
    if (el.s3Key === file.s3Key) {
      return [...fileArray];
    }
  }

  return [...fileArray, file];
};
