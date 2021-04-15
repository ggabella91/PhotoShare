import { Post, PostFile, Reaction } from './post.types';

export const addPostFileToArray = (fileArray: PostFile[], file: PostFile) => {
  for (let el of fileArray) {
    if (el.s3Key === file.s3Key) {
      return [...fileArray];
    }
  }

  return [file, ...fileArray];
};

export const addPostDataToFeedArray = (
  postDataFeedArray: Post[][],
  postData: Post[]
) => {
  for (let el of postDataFeedArray) {
    if (el.length && el[0].s3Key === postData[0].s3Key) {
      return [...postDataFeedArray];
    }
  }

  return [postData, ...postDataFeedArray];
};

export const addPostReactionsToOuterReactionsArray = (
  postReactionsOuterArray: Reaction[][],
  postReactions: Reaction[]
) => {
  for (let el of postReactionsOuterArray) {
    if (el.length && el[0].postId === postReactions[0].postId) {
      return [...postReactionsOuterArray];
    }
  }

  return [postReactions, ...postReactionsOuterArray];
};

export const addUserPhotoFileToArray = (
  fileArray: PostFile[] | null,
  file: PostFile
) => {
  if (fileArray) {
    for (let el of fileArray) {
      if (el.s3Key === file.s3Key) {
        return [...fileArray];
      }
    }

    return [...fileArray, file];
  } else {
    if (file) {
      return [file];
    } else {
      return [];
    }
  }
};
