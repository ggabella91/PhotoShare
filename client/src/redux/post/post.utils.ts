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
  for (let i = 0; i < postDataFeedArray.length; i++) {
    if (
      postDataFeedArray[i].length &&
      postDataFeedArray[i][0].s3Key === postData[0].s3Key
    ) {
      return [...postDataFeedArray];
    }

    if (postDataFeedArray[i][0].id !== postData[0].id) {
      postDataFeedArray[i] = [...postDataFeedArray[i], ...postData];

      return [...postDataFeedArray];
    }
  }

  return [postData, ...postDataFeedArray];
};

export const addPostReactionsToOuterReactionsArray = (
  postReactionsOuterArray: Reaction[][],
  postReactions: Reaction[]
) => {
  for (let i = 0; i < postReactionsOuterArray.length; i++) {
    if (
      postReactionsOuterArray[i].length &&
      postReactionsOuterArray[i][0].postId === postReactions[0].postId
    ) {
      if (postReactionsOuterArray[i][0].id !== postReactions[0].id) {
        postReactionsOuterArray[i] = [
          ...postReactionsOuterArray[i],
          ...postReactions,
        ];
      }

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
