import { User } from '../../redux/user/user.types';
import { Post, PostFile } from '../../redux/post/post.types';

import { UserInfoAndPostFile } from './feed-page.component';

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
      let photoS3Key: string;
      let profilePhotoString: string;
      let caption: string;

      for (let innerArr of dataFeedArray) {
        for (let innerEl of innerArr) {
          if (innerEl.s3Key === el.s3Key) {
            let date = innerEl.createdAt;

            location = innerEl.postLocation || '';
            id = innerEl.userId;
            postId = innerEl.id;
            caption = innerEl.caption || '';
            dateString = new Date(date).toDateString();
            dateInt = new Date(date).getTime();
          }
        }
      }

      for (let userEl of followingInfoArray) {
        if (userEl.id === id!) {
          username = userEl.username;
          photoS3Key = userEl.photo || '';
        }
      }

      for (let userEl of followingProfilePhotoArray) {
        if (photoS3Key! && userEl.s3Key === photoS3Key) {
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
        postFileString: el.fileString,
        caption,
        dateString,
        dateInt,
      };
    }
  );

  return userInfoAndPostObjArray;
};
