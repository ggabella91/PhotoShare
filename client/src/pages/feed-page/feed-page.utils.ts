import { Follower } from '../../redux/follower/follower.types';
import { User } from '../../redux/user/user.types';
import { Post, PostFile, Reaction } from '../../redux/post/post.types';

import { UserInfoAndPostFile } from './feed-page.component';
import { UserInfoAndOtherData } from '../../components/user-info/user-info.component';

export const prepareUserInfoAndFileArray = (
  followingInfoArray: User[],
  dataFeedArray: Post[][],
  followingProfilePhotoArray: PostFile[],
  postFileFeedArray: PostFile[]
) => {
  let userInfoAndPostObjArray: UserInfoAndPostFile[] = postFileFeedArray.map(
    (el) => {
      let location: string;
      let dateString: string;
      let dateInt: number;
      let id: string;
      let username: string;
      let postId: string;
      let postS3Key: string;
      let profilePhotoS3Key: string;
      let profilePhotoString: string;
      let caption: string;

      for (let innerArr of dataFeedArray) {
        for (let innerEl of innerArr) {
          if (innerEl.s3Key === el.s3Key) {
            let date = innerEl.createdAt;

            location = innerEl.postLocation || '';
            id = innerEl.userId;
            postId = innerEl.id;
            postS3Key = innerEl.s3Key;
            caption = innerEl.caption || '';
            dateString = new Date(date).toDateString();
            dateInt = new Date(date).getTime();
          }
        }
      }

      for (let userEl of followingInfoArray) {
        if (userEl.id === id!) {
          username = userEl.username;
          profilePhotoS3Key = userEl.photo || '';
        }
      }

      for (let userEl of followingProfilePhotoArray) {
        if (profilePhotoS3Key! && userEl.s3Key === profilePhotoS3Key) {
          profilePhotoString = userEl.fileString;
        }
      }

      if (!profilePhotoString!) {
        profilePhotoString = '';
      }
      if (!location!) {
        location = '';
      }

      if (!caption!) {
        caption = '';
      }

      if (!dateString!) {
        dateString = '';
      }

      if (!dateInt!) {
        dateInt = Date.now();
      }

      return {
        username: username!,
        userId: id!,
        profilePhotoFileString: profilePhotoString,
        location,
        postId: postId!,
        postS3Key: postS3Key!,
        postFileString: el.fileString,
        caption,
        dateString,
        dateInt,
      };
    }
  );

  return userInfoAndPostObjArray;
};

export const compareFollowerArrays = (
  array1: Follower[],
  array2: Follower[]
) => {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i].followerId !== array2[i].followerId) {
      return false;
    }
  }

  return true;
};

export const compareUserOrPostOrReactionArrays = (
  array1: User[] | Post[] | Reaction[],
  array2: User[] | Post[] | Reaction[]
) => {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i].id !== array2[i].id) {
      return false;
    }
  }

  return true;
};

export const comparePostFileArrays = (
  array1: PostFile[],
  array2: PostFile[]
) => {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i].s3Key !== array2[i].s3Key) {
      return false;
    }
  }

  return true;
};

export const compareUserInfoAndDataObjArrays = (
  array1: UserInfoAndPostFile[] | UserInfoAndOtherData[],
  array2: UserInfoAndPostFile[] | UserInfoAndOtherData[]
) => {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    let array1AtIdxValues = Object.values(array1[i]);
    let array2AtIdxValues = Object.values(array2[i]);

    for (let j = 0; j < array1AtIdxValues.length; j++) {
      if (array1AtIdxValues[j] !== array2AtIdxValues[j]) {
        return false;
      }
    }
  }

  return true;
};
