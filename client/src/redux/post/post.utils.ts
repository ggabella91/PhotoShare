import { Post, PostFile, Reaction } from './post.types';

export const addToPostDataArray = (
  postDataArray: Post[] | null,
  postData: Post[]
) => {
  if (postDataArray) {
    return [...postDataArray, ...postData];
  } else {
    return [...postData];
  }
};

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
  if (!postData.length) {
    return [...postDataFeedArray];
  }

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
  if (!postReactions.length) {
    return [...postReactionsOuterArray];
  }

  for (let i = 0; i < postReactionsOuterArray.length; i++) {
    if (
      postReactionsOuterArray[i].length &&
      postReactions.length &&
      postReactionsOuterArray[i][0].postId === postReactions[0].postId
    ) {
      if (postReactionsOuterArray[i].length !== postReactions.length) {
        postReactionsOuterArray[i] = [...postReactions];
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

export const replaceSinglePostInDataArray = (
  dataArray: Post[] | null,
  singlePostData: Post
) => {
  if (dataArray) {
    const newDataArray = dataArray.map((el) => {
      if (el.id === singlePostData.id) {
        return singlePostData;
      } else {
        return el;
      }
    });

    return newDataArray;
  }

  return [singlePostData];
};
