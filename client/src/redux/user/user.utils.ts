import { User } from './user.types';

export const addUserToFollowersOrFollowingArray = (
  followersOrFollowingArray: User[] | null,
  followerOrFollowing: User
) => {
  if (followersOrFollowingArray) {
    for (let el of followersOrFollowingArray) {
      if (el.id === followerOrFollowing.id) {
        return [...followersOrFollowingArray];
      }
    }

    return [followerOrFollowing, ...followersOrFollowingArray];
  } else {
    if (followerOrFollowing) {
      return [followerOrFollowing];
    } else {
      return [];
    }
  }
};
