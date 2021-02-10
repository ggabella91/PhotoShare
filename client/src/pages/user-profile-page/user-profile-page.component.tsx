import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';
import { User, Error } from '../../redux/user/user.types';
import {
  selectCurrentUser,
  selectOtherUser,
  selectOtherUserError,
} from '../../redux/user/user.selectors';
import { getOtherUserStart } from '../../redux/user/user.actions';

import {
  Post,
  PostFileReq,
  PostFile,
  PostError,
  UserType,
} from '../../redux/post/post.types';
import {
  selectPostData,
  selectPostFiles,
  selectPostError,
  selectPostConfirm,
  selectGetPostDataConfirm,
  selectGetPostDataError,
  selectGetPostFileConfirm,
  selectGetPostFileError,
  selectOtherUserProfilePhotoFile,
} from '../../redux/post/post.selectors';
import {
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
} from '../../redux/post/post.actions';

import {
  Follower,
  FollowError,
  WhoseUsersFollowing,
  UsersFollowingRequest,
} from '../../redux/follower/follower.types';
import {
  selectFollowConfirm,
  selectFollowError,
  selectFollowers,
  selectCurrentUserUsersFollowing,
  selectOtherUserUsersFollowing,
  selectGetUsersFollowingConfirm,
  selectUnfollowConfirm,
  selectUnfollowError,
} from '../../redux/follower/follower.selectors';
import {
  followNewUserStart,
  getFollowersStart,
  getUsersFollowingStart,
  unfollowUserStart,
  clearFollowState,
} from '../../redux/follower/follower.actions';

import PostTile from '../../components/post-tile/post-tile.component';
import PostModal from '../../components/post-modal/post-modal.component';
import PostOptionsModal from '../../components/post-options-modal/post-options-modal.component';
import NotFoundPage from '../../pages/not-found/not-found-page.component';
import UnfollowModal from '../../components/unfollow-modal/unfollow-modal.component';

import '../my-profile/profile-page.styles.scss';

interface UserProfilePageProps {
  username: string;
  otherUser: User | null;
  otherUserError: Error | null;
  profilePhotoFile: string | null;
  postData: Post[] | null;
  postFiles: PostFile[];
  postConfirm: string | null;
  postError: PostError | null;
  getPostDataConfirm: string | null;
  getPostDataError: PostError | null;
  getPostFileConfirm: string | null;
  getPostFileError: PostError | null;
  followConfirm: string | null;
  followers: Follower[] | null;
  currentUserUsersFollowing: Follower[] | null;
  otherUserUsersFollowing: Follower[] | null;
  getUsersFollowingConfirm: string | null;
  currentUser: User | null;
  unfollowConfirm: string | null;
  unfollowError: FollowError | null;
  getPostDataStart: typeof getPostDataStart;
  getPostFileStart: typeof getPostFileStart;
  getOtherUserStart: typeof getOtherUserStart;
  followNewUserStart: typeof followNewUserStart;
  getFollowersStart: typeof getFollowersStart;
  getUsersFollowingStart: typeof getUsersFollowingStart;
  unfollowUserStart: typeof unfollowUserStart;
  clearFollowState: typeof clearFollowState;
}

interface PostModalProps {
  id: string;
  s3Key: string;
  caption: string;
  location: string;
  createdAt: Date | null;
  fileString: string;
}

interface FollowersAndUsersFollowing {
  followers: Follower[] | null;
  usersFollowing: Follower[] | null;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  username,
  otherUser,
  otherUserError,
  profilePhotoFile,
  postData,
  postFiles,
  currentUserUsersFollowing,
  otherUserUsersFollowing,
  currentUser,
  followConfirm,
  followers,
  getUsersFollowingConfirm,
  getOtherUserStart,
  getPostDataStart,
  getPostFileStart,
  followNewUserStart,
  getFollowersStart,
  getUsersFollowingStart,
  unfollowUserStart,
  unfollowConfirm,
  unfollowError,
  clearFollowState,
}) => {
  const [user, setUser] = useState({ id: '', name: '', username: '', bio: '' });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const [
    followersAndUsersFollowing,
    setFollowersAndUsersFollowing,
  ] = useState<FollowersAndUsersFollowing>({
    followers: null,
    usersFollowing: null,
  });
  const [isFollowing, setIsFollowing] = useState(false);

  const [postDataArray, setPostDataArray] = useState<Post[]>([]);
  const [postFileArray, setPostFileArray] = useState<PostFile[]>([]);

  const [postModalShow, setPostModalShow] = useState(false);
  const [postModalProps, setPostModalProps] = useState<PostModalProps>({
    id: '',
    s3Key: '',
    caption: '',
    location: '',
    createdAt: null,
    fileString: '',
  });

  const [postOptionsModalShow, setPostOptionsModalShow] = useState(false);

  const [unfollowModalShow, setUnfollowModalShow] = useState(false);

  let postsBucket: string, profileBucket: string;

  if (process.env.NODE_ENV === 'production') {
    postsBucket = 'photo-share-app';
    profileBucket = 'photo-share-app-profile-photos';
  } else {
    postsBucket = 'photo-share-app-dev';
    profileBucket = 'photo-share-app-profile-photos-dev';
  }
  useEffect(() => {
    getOtherUserStart(username);
  }, [username]);

  useEffect(() => {
    if (currentUser) {
      getUsersFollowingStart({
        userId: currentUser.id,
        whoseUsersFollowing: WhoseUsersFollowing.CURRENT_USER,
      });
      if (otherUser) {
        getFollowersStart(otherUser.id);
      }
    }
  }, [followConfirm]);

  useEffect(() => {
    if (otherUser) {
      setUser({
        id: otherUser.id,
        name: otherUser.name,
        username: otherUser.username,
        bio: otherUser.bio || '',
      });

      getFollowersStart(otherUser.id);
      getUsersFollowingStart({
        userId: otherUser.id,
        whoseUsersFollowing: WhoseUsersFollowing.OTHER_USER,
      });
    }
  }, [otherUser]);

  useEffect(() => {
    if (
      (followers && followers.length) ||
      (followers &&
        followersAndUsersFollowing.followers &&
        followers.length !== followersAndUsersFollowing.followers.length)
    ) {
      setFollowersAndUsersFollowing({
        ...followersAndUsersFollowing,
        followers: followers,
      });
    }

    if (otherUserUsersFollowing && otherUserUsersFollowing.length) {
      setFollowersAndUsersFollowing({
        ...followersAndUsersFollowing,
        usersFollowing: otherUserUsersFollowing,
      });
    }
    clearFollowState();
  }, [
    followers,
    followers?.length,
    otherUserUsersFollowing,
    otherUserUsersFollowing?.length,
  ]);

  useEffect(() => {
    if (user.id) {
      getPostDataStart(user.id);
    }
  }, [user.id]);

  useEffect(() => {
    if (otherUser && otherUser.photo) {
      getPostFileStart({
        s3Key: otherUser.photo,
        bucket: profileBucket,
        user: UserType.other,
      });
    } else if (!profilePhotoFile && otherUser && otherUser.photo) {
      getPostFileStart({
        s3Key: otherUser.photo,
        bucket: profileBucket,
        user: UserType.other,
      });
    }
  }, [otherUser]);

  useEffect(() => {
    if (profilePhotoFile) {
      setProfilePhoto(profilePhotoFile);
    }
  }, [profilePhotoFile]);

  useEffect(() => {
    if (postData && postData.length) {
      setPostDataArray(postData);
    }
  }, [postData]);

  useEffect(() => {
    if (postData && postDataArray.length === postData.length) {
      for (let post of postDataArray) {
        getPostFileStart({
          s3Key: post.s3Key,
          bucket: postsBucket,
          user: UserType.other,
        });
      }
    }
  }, [postDataArray]);

  useEffect(() => {
    if (postData && postFiles.length === postData.length) {
      const orderedFiles: PostFile[] = [];

      for (let post of postDataArray) {
        const fileMatch = postFiles.find((el) => post.s3Key === el.s3Key);

        if (fileMatch) {
          orderedFiles.push(fileMatch);
        }
      }

      setPostFileArray(orderedFiles);
    }
  }, [postFiles]);

  const handleRenderPostModal = (file: PostFile) => {
    const postData = postDataArray.find((el) => el.s3Key === file.s3Key);

    if (postData) {
      const caption = postData.caption || '';
      const location = postData.postLocation || '';
      const { createdAt } = postData;

      setPostModalProps({
        id: postData.id,
        caption,
        s3Key: postData.s3Key,
        location,
        createdAt,
        fileString: file.fileString,
      });
      setPostModalShow(true);
    }
  };

  useEffect(() => {
    if (currentUserUsersFollowing?.length) {
      for (let userFollowing of currentUserUsersFollowing) {
        if (userFollowing.userId === user.id) {
          setIsFollowing(true);
        }
      }
    }
  }, [getUsersFollowingConfirm]);

  useEffect(() => {
    if (unfollowConfirm) {
      setIsFollowing(false);
      getFollowersStart(otherUser!.id);
      clearFollowState();
    }
  }, [unfollowConfirm]);

  const handleRenderFollowOrFollowingButton = (narrow: boolean) => {
    return (
      <div
        className={narrow ? 'follow-profile-narrow-screen' : 'follow-profile'}
      >
        <span
          className={narrow ? 'follow-narrow-text' : 'follow-text'}
          onClick={
            isFollowing!
              ? () => setUnfollowModalShow(true)
              : () => followNewUserStart(user.id)
          }
        >
          {isFollowing! ? 'Following' : 'Follow'}
        </span>
      </div>
    );
  };

  if (otherUserError) {
    return <NotFoundPage />;
  }

  return (
    <div className='profile-page'>
      <div className='user-bio'>
        <div className='avatar-and-details'>
          <div className='avatar'>
            {profilePhoto ? (
              <img
                className='profile-photo'
                src={`data:image/jpeg;base64,${profilePhoto}`}
                alt='profile-pic'
              />
            ) : null}
            {!profilePhoto ? (
              <div className='user-bio-photo-placeholder'>
                <span className='user-bio-photo-placeholder-text'>
                  No photo
                </span>
              </div>
            ) : null}
          </div>
          <div className='user-details'>
            <div className='username-and-follow'>
              <span className='user-username'>{user.username}</span>
              {handleRenderFollowOrFollowingButton(false)}
            </div>
            {handleRenderFollowOrFollowingButton(true)}
            <div className='posts-followers-following-stats'>
              <span className='user-stat'>{postDataArray.length} Posts</span>
              <span className='user-stat'>
                {followersAndUsersFollowing.followers
                  ? followersAndUsersFollowing.followers.length
                  : 0}{' '}
                Followers
              </span>
              <span className='user-stat'>
                {followersAndUsersFollowing.usersFollowing
                  ? followersAndUsersFollowing.usersFollowing.length
                  : 0}{' '}
                Following
              </span>
            </div>
            <div className='name-and-bio'>
              <span className='user-name'>{user.name}</span>
              <span className='user-bio'>{user.bio}</span>
            </div>
          </div>
        </div>
        <div className='name-and-bio-narrow-screen'>
          <span className='user-name-narrow'>{user.name}</span>
          <span className='user-bio-narrow'>{user.bio}</span>
        </div>
        <div className='posts-followers-following-stats-narrow-screen'>
          <ul className='stats-list'>
            <li className='stats-item'>{postDataArray.length} Posts</li>
            <li className='stats-item'>
              {followersAndUsersFollowing.followers
                ? followersAndUsersFollowing.followers.length
                : 0}{' '}
              Followers
            </li>
            <li className='stats-item'>
              {followersAndUsersFollowing.usersFollowing
                ? followersAndUsersFollowing.usersFollowing.length
                : 0}{' '}
              Following
            </li>
          </ul>
        </div>
      </div>
      <div className='posts-grid'>
        {postFileArray.length
          ? postFileArray.map((file, idx) => (
              <PostTile
                fileString={file.fileString}
                key={idx}
                onClick={() => handleRenderPostModal(file)}
              />
            ))
          : null}
      </div>
      <PostModal
        show={postModalShow}
        fileString={postModalProps.fileString}
        caption={postModalProps.caption}
        location={postModalProps.location}
        createdAt={
          postModalProps.createdAt || new Date('2021-01-09T22:39:39.945Z')
        }
        onHide={() => setPostModalShow(false)}
        onOptionsClick={() => setPostOptionsModalShow(true)}
        userProfilePhotoFile={profilePhoto || ''}
        userName={user.username}
      />
      <PostOptionsModal
        show={postOptionsModalShow}
        onHide={() => setPostOptionsModalShow(false)}
        archive={() =>
          archivePostStart({
            postId: postModalProps.id,
            s3Key: postModalProps.s3Key,
          })
        }
      />
      <UnfollowModal
        show={unfollowModalShow}
        onHide={() => setUnfollowModalShow(false)}
        unfollow={() => {
          unfollowUserStart(otherUser!.id);
          setUnfollowModalShow(false);
        }}
        username={username}
        profilePhoto={profilePhotoFile}
      />
    </div>
  );
};

interface LinkStateProps {
  otherUser: User | null;
  otherUserError: Error | null;
  postData: Post[] | null;
  postFiles: PostFile[];
  profilePhotoFile: string | null;
  postConfirm: string | null;
  postError: PostError | null;
  getPostDataConfirm: string | null;
  getPostDataError: PostError | null;
  getPostFileConfirm: string | null;
  getPostFileError: PostError | null;
  followConfirm: string | null;
  followers: Follower[] | null;
  currentUserUsersFollowing: Follower[] | null;
  otherUserUsersFollowing: Follower[] | null;
  getUsersFollowingConfirm: string | null;
  currentUser: User | null;
  unfollowConfirm: string | null;
  unfollowError: FollowError | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  otherUser: selectOtherUser,
  otherUserError: selectOtherUserError,
  postData: selectPostData,
  postFiles: selectPostFiles,
  profilePhotoFile: selectOtherUserProfilePhotoFile,
  postConfirm: selectPostConfirm,
  postError: selectPostError,
  getPostDataConfirm: selectGetPostDataConfirm,
  getPostDataError: selectGetPostDataError,
  getPostFileConfirm: selectGetPostFileConfirm,
  getPostFileError: selectGetPostFileError,
  followConfirm: selectFollowConfirm,
  followers: selectFollowers,
  currentUserUsersFollowing: selectCurrentUserUsersFollowing,
  otherUserUsersFollowing: selectOtherUserUsersFollowing,
  getUsersFollowingConfirm: selectGetUsersFollowingConfirm,
  currentUser: selectCurrentUser,
  unfollowConfirm: selectUnfollowConfirm,
  unfollowError: selectUnfollowError,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getOtherUserStart: (username: string) =>
    dispatch(getOtherUserStart(username)),
  getPostDataStart: (userId: string) => dispatch(getPostDataStart(userId)),
  getPostFileStart: (fileReq: PostFileReq) =>
    dispatch(getPostFileStart(fileReq)),
  followNewUserStart: (userToFollowId: string) =>
    dispatch(followNewUserStart(userToFollowId)),
  getFollowersStart: (userId: string) => dispatch(getFollowersStart(userId)),
  getUsersFollowingStart: (usersFollowingObj: UsersFollowingRequest) =>
    dispatch(getUsersFollowingStart(usersFollowingObj)),
  unfollowUserStart: (userId: string) => dispatch(unfollowUserStart(userId)),
  clearFollowState: () => dispatch(clearFollowState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfilePage);
