import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { List } from 'immutable';

import { AppState } from '../../redux/root-reducer';
import {
  User,
  Error,
  OtherUserType,
  OtherUserRequest,
} from '../../redux/user/user.types';
import {
  selectCurrentUser,
  selectOtherUser,
  selectOtherUserError,
  selectIsCurrentUserProfilePage,
} from '../../redux/user/user.selectors';
import {
  getOtherUserStart,
  clearFollowersAndFollowing,
  setIsCurrentUserProfilePage,
} from '../../redux/user/user.actions';

import {
  Post,
  DataRequestType,
  FileRequestType,
  PostDataReq,
  PostFileReq,
  PostFile,
  PostError,
  UserType,
  DeleteReactionReq,
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
  selectCommentToDelete,
  selectShowCommentOptionsModal,
  selectPostLikingUsersArray,
} from '../../redux/post/post.selectors';
import {
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
  clearFollowPhotoFileArray,
  clearPostFilesAndData,
  setShowCommentOptionsModal,
  deleteReactionStart,
} from '../../redux/post/post.actions';

import {
  Follower,
  FollowError,
  WhoseUsersFollowing,
  UsersFollowingRequest,
} from '../../redux/follower/follower.types';
import {
  selectFollowConfirm,
  selectFollowers,
  selectCurrentUserUsersFollowing,
  selectOtherUserUsersFollowing,
  selectGetFollowersConfirm,
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
import PostOrCommentOptionsModal from '../../components/post-or-comment-options-modal/post-or-comment-options-modal.component';
import NotFoundPage from '../../pages/not-found/not-found-page.component';
import UnfollowModal from '../../components/unfollow-modal/unfollow-modal.component';
import FollowersOrFollowingOrLikesModal from '../../components/followers-or-following-or-likes-modal/followers-or-following-or-likes-modal.component';
import { UserInfoAndOtherData } from '../../components/user-info/user-info.component';

import '../my-profile/profile-page.styles.scss';

interface UserProfilePageProps {
  username: string;
  otherUser: User | null;
  otherUserError: Error | null;
  profilePhotoFile: PostFile | null;
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
  getFollowersConfirm: string | null;
  getUsersFollowingConfirm: string | null;
  currentUser: User | null;
  unfollowConfirm: string | null;
  unfollowError: FollowError | null;
  isCurrentUserProfilePage: boolean;
  commentToDelete: DeleteReactionReq | null;
  showCommentOptionsModal: boolean;
  postLikingUsersArray: UserInfoAndOtherData[] | null;
  getPostDataStart: typeof getPostDataStart;
  getPostFileStart: typeof getPostFileStart;
  clearFollowPhotoFileArray: typeof clearFollowPhotoFileArray;
  getOtherUserStart: typeof getOtherUserStart;
  followNewUserStart: typeof followNewUserStart;
  getFollowersStart: typeof getFollowersStart;
  getUsersFollowingStart: typeof getUsersFollowingStart;
  unfollowUserStart: typeof unfollowUserStart;
  clearFollowersAndFollowing: typeof clearFollowersAndFollowing;
  clearPostFilesAndData: typeof clearPostFilesAndData;
  clearFollowState: typeof clearFollowState;
  setIsCurrentUserProfilePage: typeof setIsCurrentUserProfilePage;
  setShowCommentOptionsModal: typeof setShowCommentOptionsModal;
  deleteReactionStart: typeof deleteReactionStart;
}

interface PostModalProps {
  id: string;
  s3Key: string;
  caption: string;
  location: string;
  createdAt: Date | null;
  fileString: string;
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
  getFollowersConfirm,
  getUsersFollowingConfirm,
  isCurrentUserProfilePage,
  getOtherUserStart,
  getPostDataStart,
  getPostFileStart,
  clearFollowPhotoFileArray,
  followNewUserStart,
  getFollowersStart,
  getUsersFollowingStart,
  unfollowUserStart,
  unfollowConfirm,
  unfollowError,
  clearFollowersAndFollowing,
  clearPostFilesAndData,
  clearFollowState,
  setIsCurrentUserProfilePage,
  commentToDelete,
  showCommentOptionsModal,
  setShowCommentOptionsModal,
  deleteReactionStart,
  postLikingUsersArray,
}) => {
  const [user, setUser] = useState({ id: '', name: '', username: '', bio: '' });
  const [profilePhotoString, setProfilePhoto] = useState<string>('');

  const [followersList, setFollowersList] = useState<List<Follower>>(List());
  const [usersFollowingList, setUsersFollowingList] = useState<List<Follower>>(
    List()
  );

  const [isFollowing, setIsFollowing] = useState(false);

  const [postDataList, setPostDataList] = useState<List<Post>>(List());
  const [postFileList, setPostFileList] = useState<List<PostFile>>(List());

  const [postModalShow, setPostModalShow] = useState(false);
  const [postModalProps, setPostModalProps] = useState<PostModalProps>({
    id: '',
    s3Key: '',
    caption: '',
    location: '',
    createdAt: null,
    fileString: '',
  });

  const [clearPostModalLocalState, setClearPostModalLocalState] =
    useState(false);

  const [postOptionsModalShow, setPostOptionsModalShow] = useState(false);

  const [unfollowModalShow, setUnfollowModalShow] = useState(false);
  const [isFollowersModal, setIsFollowersModal] = useState(true);

  const [followersOrFollowingModalShow, setFollowersOrFollowingModalShow] =
    useState(false);

  const [currentUserPostOrComment, setCurrentUserPostOrComment] =
    useState<boolean>(false);

  const [showPostLikingUsersModal, setShowPostLikingUsersModal] =
    useState(false);

  const [postLikersList, setPostLikersList] = useState<
    List<UserInfoAndOtherData>
  >(List());

  let postsBucket: string, profileBucket: string;

  if (process.env.NODE_ENV === 'production') {
    postsBucket = 'photo-share-app';
    profileBucket = 'photo-share-app-profile-photos';
  } else {
    postsBucket = 'photo-share-app-dev';
    profileBucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    if (isCurrentUserProfilePage) {
      setIsCurrentUserProfilePage(false);
    }
    setFollowersOrFollowingModalShow(false);
    clearFollowersAndFollowing();
    clearPostFilesAndData();

    getOtherUserStart({ type: OtherUserType.OTHER, usernameOrId: username });
  }, [username, isCurrentUserProfilePage]);

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
    }
  }, [otherUser]);

  useEffect(() => {
    if (user) {
      getFollowersStart(user.id);
      getUsersFollowingStart({
        userId: user.id,
        whoseUsersFollowing: WhoseUsersFollowing.OTHER_USER,
      });
    }
  }, [user]);

  useEffect(() => {
    if (followers && followers.length) {
      setFollowersList(List(followers));
    } else {
      setFollowersList(List());
    }

    if (otherUserUsersFollowing && otherUserUsersFollowing.length) {
      setUsersFollowingList(List(otherUserUsersFollowing));
    } else {
      setUsersFollowingList(List());
    }
  }, [followers, otherUserUsersFollowing]);

  useEffect(() => {
    if (user.username === username && user.id) {
      getPostDataStart({
        userId: user.id,
        dataReqType: DataRequestType.single,
      });
    }
  }, [user]);

  useEffect(() => {
    if (otherUser && otherUser.photo) {
      getPostFileStart({
        s3Key: otherUser.photo,
        bucket: profileBucket,
        user: UserType.other,
        fileRequestType: FileRequestType.singlePost,
      });
    } else if (!profilePhotoFile && otherUser && otherUser.photo) {
      getPostFileStart({
        s3Key: otherUser.photo,
        bucket: profileBucket,
        user: UserType.other,
        fileRequestType: FileRequestType.singlePost,
      });
    }
  }, [otherUser]);

  useEffect(() => {
    if (profilePhotoFile && profilePhotoFile.fileString) {
      setProfilePhoto(profilePhotoFile.fileString);
    }
  }, [profilePhotoFile]);

  useEffect(() => {
    if (postData && postData.length) {
      setPostDataList(List(postData));
    }
  }, [postData]);

  useEffect(() => {
    if (user && postData && postDataList.size === postData.length) {
      postDataList.forEach((post) => {
        getPostFileStart({
          s3Key: post.s3Key,
          bucket: postsBucket,
          user: UserType.other,
          fileRequestType: FileRequestType.singlePost,
        });
      });
    }
  }, [postDataList]);

  useEffect(() => {
    if (postData && postFiles.length === postData.length) {
      let orderedFiles: List<PostFile> = List();

      postDataList.forEach((post) => {
        const fileMatch = postFiles.find((el) => post.s3Key === el.s3Key);

        if (fileMatch) {
          orderedFiles = orderedFiles.push(fileMatch);
        }
      });

      setPostFileList(orderedFiles);
    }
  }, [postFiles]);

  const handleRenderPostModal = (file: PostFile) => {
    const postData = postDataList.find((el) => el.s3Key === file.s3Key);

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
      setClearPostModalLocalState(false);
      setPostModalShow(true);
    }
  };

  const handleHidePostModal = () => {
    setPostModalProps({
      id: '',
      s3Key: '',
      caption: '',
      location: '',
      createdAt: null,
      fileString: '',
    });
    setPostModalShow(false);
    setClearPostModalLocalState(true);
  };

  useEffect(() => {
    handleDetermineIfFollowing();
  }, [getUsersFollowingConfirm]);

  const handleDetermineIfFollowing = () => {
    if (currentUserUsersFollowing && currentUserUsersFollowing.length) {
      for (let userFollowing of currentUserUsersFollowing) {
        if (userFollowing.userId === user.id) {
          setIsFollowing(true);
          return;
        }
      }

      setIsFollowing(false);
      return;
    }
  };

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

  const handleRenderFollowersModal = () => {
    if (followersList.size) {
      setIsFollowersModal(true);
      setFollowersOrFollowingModalShow(true);
    }
  };

  const handleRenderFollowingModal = () => {
    if (usersFollowingList.size) {
      setIsFollowersModal(false);
      setFollowersOrFollowingModalShow(true);
    }
  };

  const handleMakeStatClickable = (type: string, baseClassName: string) => {
    if (type === 'followers') {
      return followersList.size
        ? `${baseClassName} clickable`
        : `${baseClassName}`;
    } else if (type === 'following') {
      return usersFollowingList.size
        ? `${baseClassName} clickable`
        : `${baseClassName}`;
    }
  };

  useEffect(() => {
    handleSetIsCurrentUserComment();
  }, [showCommentOptionsModal]);

  const handleSetIsCurrentUserComment = () => {
    if (currentUser && commentToDelete && commentToDelete.reactingUserId) {
      if (commentToDelete.reactingUserId === currentUser.id) {
        setCurrentUserPostOrComment(true);
      } else {
        setCurrentUserPostOrComment(false);
      }
    }
  };

  useEffect(() => {
    if (postLikingUsersArray) {
      setPostLikersList(List(postLikingUsersArray));
    }
  }, [postLikingUsersArray]);

  if (otherUserError) {
    return <NotFoundPage />;
  }

  return (
    <div className='profile-page'>
      <div className='user-bio'>
        <div className='avatar-and-details'>
          <div className='avatar'>
            {profilePhotoString ? (
              <img
                className='profile-photo'
                src={`data:image/jpeg;base64,${profilePhotoString}`}
                alt='profile-pic'
              />
            ) : null}
            {!profilePhotoString ? (
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
              <span className='user-stat'>{postDataList.size} Posts</span>
              <span
                className={handleMakeStatClickable('followers', 'user-stat')}
                onClick={handleRenderFollowersModal}
              >
                {followersList.size ? followersList.size : 0} Followers
              </span>
              <span
                className={handleMakeStatClickable('following', 'user-stat')}
                onClick={handleRenderFollowingModal}
              >
                {usersFollowingList.size ? usersFollowingList.size : 0}{' '}
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
            <li className='stats-item'>{postDataList.size} Posts</li>
            <li
              className={handleMakeStatClickable('followers', 'stats-item')}
              onClick={handleRenderFollowersModal}
            >
              {followersList.size ? followersList.size : 0} Followers
            </li>
            <li
              className={handleMakeStatClickable('following', 'stats-item')}
              onClick={handleRenderFollowingModal}
            >
              {usersFollowingList.size ? usersFollowingList.size : 0} Following
            </li>
          </ul>
        </div>
      </div>
      <div className='posts-grid'>
        {postFileList.size
          ? postFileList.map((file, idx) => (
              <PostTile
                fileString={file.fileString}
                key={idx}
                onClick={() => handleRenderPostModal(file)}
              />
            ))
          : null}
      </div>
      <PostModal
        postId={postModalProps.id}
        show={postModalShow}
        fileString={postModalProps.fileString}
        caption={postModalProps.caption}
        location={postModalProps.location}
        createdAt={postModalProps.createdAt || ''}
        onHide={() => handleHidePostModal()}
        onOptionsClick={() => setPostOptionsModalShow(true)}
        onPostLikingUsersClick={() => setShowPostLikingUsersModal(true)}
        userProfilePhotoFile={profilePhotoString}
        userName={user.username}
        userId={user.id}
        clearLocalState={clearPostModalLocalState}
      />
      <PostOrCommentOptionsModal
        show={postOptionsModalShow}
        onHide={() => setPostOptionsModalShow(false)}
        isCurrentUserPostOrComment={false}
        archive={() =>
          archivePostStart({
            postId: postModalProps.id,
            s3Key: postModalProps.s3Key,
          })
        }
      />
      <PostOrCommentOptionsModal
        show={showCommentOptionsModal}
        onHide={() => setShowCommentOptionsModal(false)}
        archive={() => {
          if (commentToDelete) {
            deleteReactionStart(commentToDelete);
            setShowCommentOptionsModal(false);
          }
        }}
        isCurrentUserPostOrComment={currentUserPostOrComment}
      />
      <UnfollowModal
        show={unfollowModalShow}
        onHide={() => setUnfollowModalShow(false)}
        unfollow={() => {
          unfollowUserStart(otherUser!.id);
          setUnfollowModalShow(false);
        }}
        username={username}
        profilePhoto={profilePhotoString}
      />
      <FollowersOrFollowingOrLikesModal
        users={
          isFollowersModal
            ? followersList.toArray()
            : usersFollowingList.toArray()
        }
        show={followersOrFollowingModalShow}
        onHide={() => {
          setFollowersOrFollowingModalShow(false);
          clearFollowersAndFollowing();
          clearFollowPhotoFileArray();
        }}
        isFollowersModal={isFollowersModal}
      />
      {postLikersList.size ? (
        <FollowersOrFollowingOrLikesModal
          users={null}
          show={showPostLikingUsersModal}
          onHide={() => setShowPostLikingUsersModal(false)}
          isFollowersModal={false}
          isPostLikingUsersModal={true}
          postLikingUsersList={postLikersList}
        />
      ) : null}
    </div>
  );
};

interface LinkStateProps {
  otherUser: User | null;
  otherUserError: Error | null;
  postData: Post[] | null;
  postFiles: PostFile[];
  profilePhotoFile: PostFile | null;
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
  getFollowersConfirm: string | null;
  getUsersFollowingConfirm: string | null;
  currentUser: User | null;
  unfollowConfirm: string | null;
  unfollowError: FollowError | null;
  isCurrentUserProfilePage: boolean;
  commentToDelete: DeleteReactionReq | null;
  showCommentOptionsModal: boolean;
  postLikingUsersArray: UserInfoAndOtherData[] | null;
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
  getFollowersConfirm: selectGetFollowersConfirm,
  getUsersFollowingConfirm: selectGetUsersFollowingConfirm,
  currentUser: selectCurrentUser,
  unfollowConfirm: selectUnfollowConfirm,
  unfollowError: selectUnfollowError,
  isCurrentUserProfilePage: selectIsCurrentUserProfilePage,
  commentToDelete: selectCommentToDelete,
  showCommentOptionsModal: selectShowCommentOptionsModal,
  postLikingUsersArray: selectPostLikingUsersArray,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getOtherUserStart: (otherUserRequest: OtherUserRequest) =>
    dispatch(getOtherUserStart(otherUserRequest)),
  getPostDataStart: (postDataReq: PostDataReq) =>
    dispatch(getPostDataStart(postDataReq)),
  getPostFileStart: (fileReq: PostFileReq) =>
    dispatch(getPostFileStart(fileReq)),
  clearFollowPhotoFileArray: () => dispatch(clearFollowPhotoFileArray()),
  followNewUserStart: (userToFollowId: string) =>
    dispatch(followNewUserStart(userToFollowId)),
  getFollowersStart: (userId: string) => dispatch(getFollowersStart(userId)),
  getUsersFollowingStart: (usersFollowingObj: UsersFollowingRequest) =>
    dispatch(getUsersFollowingStart(usersFollowingObj)),
  unfollowUserStart: (userId: string) => dispatch(unfollowUserStart(userId)),
  clearFollowersAndFollowing: () => dispatch(clearFollowersAndFollowing()),
  clearPostFilesAndData: () => dispatch(clearPostFilesAndData()),
  clearFollowState: () => dispatch(clearFollowState()),
  setIsCurrentUserProfilePage: (isCurrentUserProfilePage: boolean) =>
    dispatch(setIsCurrentUserProfilePage(isCurrentUserProfilePage)),
  setShowCommentOptionsModal: (showCommentOptionsModal: boolean) =>
    dispatch(setShowCommentOptionsModal(showCommentOptionsModal)),
  deleteReactionStart: (deleteReactionReq: DeleteReactionReq) =>
    dispatch(deleteReactionStart(deleteReactionReq)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfilePage);
