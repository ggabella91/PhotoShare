import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { List } from 'immutable';

import { AppState } from '../../redux/root-reducer';
import { User } from '../../redux/user/user.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import {
  clearFollowersAndFollowing,
  setIsCurrentUserProfilePage,
} from '../../redux/user/user.actions';

import {
  Post,
  DataRequestType,
  FileRequestType,
  PostDataReq,
  PostFileReq,
  ArchivePostReq,
  PostFile,
  PostError,
  UserType,
  DeleteReactionReq,
} from '../../redux/post/post.types';
import {
  selectProfilePhotoKey,
  selectProfilePhotoFile,
  selectPostData,
  selectPostFiles,
  selectPostError,
  selectPostConfirm,
  selectGetPostDataConfirm,
  selectGetPostDataError,
  selectGetPostFileConfirm,
  selectGetPostFileError,
  selectArchivePostConfirm,
  selectArchivePostError,
  selectCommentToDelete,
  selectShowCommentOptionsModal,
  selectPostLikingUsersArray,
  selectGetSinglePostDataConfirm,
} from '../../redux/post/post.selectors';
import {
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
  clearArchivePostStatuses,
  clearFollowPhotoFileArray,
  clearPostState,
  setShowCommentOptionsModal,
  deleteReactionStart,
  setShowPostEditForm,
} from '../../redux/post/post.actions';

import {
  Follower,
  WhoseUsersFollowing,
  UsersFollowingRequest,
} from '../../redux/follower/follower.types';
import {
  selectFollowers,
  selectCurrentUserUsersFollowing,
  selectGetUsersFollowingConfirm,
} from '../../redux/follower/follower.selectors';
import {
  getFollowersStart,
  getUsersFollowingStart,
  clearFollowState,
} from '../../redux/follower/follower.actions';

import PostTile from '../../components/post-tile/post-tile.component';
import PostModal from '../../components/post-modal/post-modal.component';
import PostOrCommentOptionsModal from '../../components/post-or-comment-options-modal/post-or-comment-options-modal.component';
import FollowersOrFollowingOrLikesModal from '../../components/followers-or-following-or-likes-modal/followers-or-following-or-likes-modal.component';
import { UserInfoAndOtherData } from '../../components/user-info/user-info.component';

import './profile-page.styles.scss';

interface MyProfilePageProps {
  currentUser: User | null;
  profilePhotoKey: string | null;
  profilePhotoFile: PostFile | null;
  postData: Post[] | null;
  postFiles: PostFile[];
  postConfirm: string | null;
  postError: PostError | null;
  getPostDataConfirm: string | null;
  getPostDataError: PostError | null;
  getPostFileConfirm: string | null;
  getPostFileError: PostError | null;
  archivePostConfirm: string | null;
  archivePostError: PostError | null;
  followers: Follower[] | null;
  currentUserUsersFollowing: Follower[] | null;
  getUsersFollowingConfirm: string | null;
  commentToDelete: DeleteReactionReq | null;
  showCommentOptionsModal: boolean;
  postLikingUsersArray: UserInfoAndOtherData[] | null;
  getSinglePostDataConfirm: Post | null;
  getPostDataStart: typeof getPostDataStart;
  getPostFileStart: typeof getPostFileStart;
  archivePostStart: typeof archivePostStart;
  clearArchivePostStatuses: typeof clearArchivePostStatuses;
  clearPostState: typeof clearPostState;
  clearFollowPhotoFileArray: typeof clearFollowPhotoFileArray;
  getFollowersStart: typeof getFollowersStart;
  getUsersFollowingStart: typeof getUsersFollowingStart;
  clearFollowersAndFollowing: typeof clearFollowersAndFollowing;
  clearFollowState: typeof clearFollowState;
  setIsCurrentUserProfilePage: typeof setIsCurrentUserProfilePage;
  setShowCommentOptionsModal: typeof setShowCommentOptionsModal;
  deleteReactionStart: typeof deleteReactionStart;
  setShowPostEditForm: typeof setShowPostEditForm;
}

interface PostModalProps {
  id: string;
  s3Key: string;
  caption: string;
  location: string;
  createdAt: Date | null;
  fileString: string;
}

export const MyProfilePage: React.FC<MyProfilePageProps> = ({
  currentUser,
  profilePhotoKey,
  profilePhotoFile,
  postData,
  postFiles,
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
  archivePostConfirm,
  clearArchivePostStatuses,
  clearFollowPhotoFileArray,
  clearPostState,
  followers,
  currentUserUsersFollowing,
  getFollowersStart,
  getUsersFollowingStart,
  getUsersFollowingConfirm,
  clearFollowersAndFollowing,
  clearFollowState,
  setIsCurrentUserProfilePage,
  commentToDelete,
  showCommentOptionsModal,
  setShowCommentOptionsModal,
  deleteReactionStart,
  postLikingUsersArray,
  getSinglePostDataConfirm,
  setShowPostEditForm,
}) => {
  const [user, setUser] = useState({ id: '', name: '', username: '', bio: '' });
  const [profilePhotoString, setProfilePhotoString] = useState<string>('');

  const [followersList, setFollowersList] = useState<List<Follower>>(List());
  const [usersFollowingArray, setUsersFollowingArray] = useState<
    Follower[] | null
  >(null);

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

  const [clearPostModalLocalState, setClearPostModalLocalState] =
    useState(false);

  const [postOptionsModalShow, setPostOptionsModalShow] = useState(false);

  const [isFollowersModal, setIsFollowersModal] = useState(true);

  const [followersOrFollowingModalShow, setFollowersOrFollowingModalShow] =
    useState(false);

  const [currentUserPostOrComment, setCurrentUserPostOrComment] = useState<
    boolean | null
  >(null);

  const [showPostLikingUsersModal, setShowPostLikingUsersModal] =
    useState(false);

  const [postLikersList, setPostLikersList] =
    useState<List<UserInfoAndOtherData> | null>(null);

  let postsBucket: string, profileBucket: string;

  if (process.env.NODE_ENV === 'production') {
    postsBucket = 'photo-share-app';
    profileBucket = 'photo-share-app-profile-photos';
  } else {
    postsBucket = 'photo-share-app-dev';
    profileBucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    if (currentUser && !user.name) {
      clearPostState();
      clearFollowState();
      clearFollowersAndFollowing();
      setIsCurrentUserProfilePage(true);

      setUser({
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        bio: currentUser.bio || '',
      });
      getPostDataStart({
        userId: currentUser.id,
        dataReqType: DataRequestType.single,
      });
      getFollowersStart(currentUser.id);
      getUsersFollowingStart({
        userId: currentUser.id,
        whoseUsersFollowing: WhoseUsersFollowing.CURRENT_USER,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (followers) {
      setFollowersList(List(followers));
    } else {
      setFollowersList(List());
    }

    if (currentUserUsersFollowing) {
      setUsersFollowingArray(currentUserUsersFollowing);
    } else {
      setUsersFollowingArray(null);
    }
  }, [followers, currentUserUsersFollowing]);

  useEffect(() => {
    if (profilePhotoKey) {
      getPostFileStart({
        s3Key: profilePhotoKey,
        bucket: profileBucket,
        user: UserType.self,
        fileRequestType: FileRequestType.singlePost,
      });
    } else if (!profilePhotoFile && currentUser && currentUser.photo) {
      getPostFileStart({
        s3Key: currentUser.photo,
        bucket: profileBucket,
        user: UserType.self,
        fileRequestType: FileRequestType.singlePost,
      });
    }
  }, [profilePhotoKey]);

  useEffect(() => {
    if (profilePhotoFile && profilePhotoFile.fileString) {
      setProfilePhotoString(profilePhotoFile.fileString);
    }
  }, [profilePhotoFile]);

  useEffect(() => {
    if (postData && postData.length) {
      setPostDataArray(postData);
    }
  }, [postData]);

  useEffect(() => {
    if (getSinglePostDataConfirm) {
      const postDataArrayCopy = postDataArray.map((el) => {
        if (el.id === getSinglePostDataConfirm.id) {
          return getSinglePostDataConfirm;
        } else {
          return el;
        }
      });

      setPostDataArray(postDataArrayCopy);
    }
  }, [getSinglePostDataConfirm]);

  useEffect(() => {
    if (
      postData &&
      postDataArray.length === postData.length &&
      !getSinglePostDataConfirm
    ) {
      postDataArray.forEach((post) => {
        getPostFileStart({
          s3Key: post.s3Key,
          bucket: postsBucket,
          user: UserType.self,
          fileRequestType: FileRequestType.singlePost,
        });
      });
    }
  }, [postDataArray]);

  useEffect(() => {
    if (postData && postFiles.length === postData.length) {
      const orderedFiles: PostFile[] = [];

      postDataArray.forEach((post) => {
        const fileMatch = postFiles.find((el) => post.s3Key === el.s3Key);

        if (fileMatch) {
          orderedFiles.push(fileMatch);
        }
      });

      setPostFileArray(orderedFiles);
    }
  }, [postFiles]);

  useEffect(() => {
    if (archivePostConfirm) {
      clearArchivePostStatuses();
      setPostOptionsModalShow(false);
      setPostModalShow(false);
      setClearPostModalLocalState(true);

      const newDataArray = postDataArray.filter(
        (el) => el.id !== postModalProps.id
      );
      setPostDataArray(newDataArray);

      const newFileArray = postFileArray.filter(
        (el) => el.s3Key !== postModalProps.s3Key
      );
      setPostFileArray(newFileArray);
    }
  }, [archivePostConfirm]);

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
      setClearPostModalLocalState(false);
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
    setShowPostEditForm(false);
  };

  useEffect(() => {
    if (currentUserUsersFollowing?.length) {
      currentUserUsersFollowing.forEach((userFollowing) => {
        if (userFollowing.userId === user.id) {
          setIsFollowing(true);
        }
      });
    }
  }, [getUsersFollowingConfirm]);

  const handleRenderFollowersModal = () => {
    if (followersList.size) {
      setIsFollowersModal(true);
      setFollowersOrFollowingModalShow(true);
    }
  };

  const handleRenderFollowingModal = () => {
    if (usersFollowingArray && usersFollowingArray.length) {
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
      return usersFollowingArray && usersFollowingArray.length
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

  return (
    <div className='profile-page'>
      <div className='user-bio'>
        <div className='avatar-and-details'>
          <div className='avatar'>
            {profilePhotoString.length ? (
              <img
                className='profile-photo'
                src={`data:image/jpeg;base64,${profilePhotoString}`}
                alt='profile-pic'
              />
            ) : null}
            {!profilePhotoString.length ? (
              <div className='user-bio-photo-placeholder'>
                <span className='user-bio-photo-placeholder-text'>
                  No photo
                </span>
              </div>
            ) : null}
          </div>
          <div className='user-details'>
            <div className='username-and-edit'>
              <span className='user-username'>{user.username}</span>
              <NavLink className='edit-profile' to='/settings'>
                <span className='edit-text'>Edit profile</span>
              </NavLink>
            </div>
            <NavLink to='/settings' className='edit-profile-narrow-screen'>
              <span className='edit-narrow-text'>Edit profile</span>
            </NavLink>
            <div className='posts-followers-following-stats'>
              <span className='user-stat'>{postDataArray.length} Posts</span>
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
                {usersFollowingArray ? usersFollowingArray.length : 0} Following
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
              {usersFollowingArray ? usersFollowingArray.length : 0} Following
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
        isCurrentUserPost
      />
      <PostOrCommentOptionsModal
        show={postOptionsModalShow}
        onHide={() => setPostOptionsModalShow(false)}
        isCurrentUserPostOrComment={true}
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
          }
          setShowCommentOptionsModal(false);
        }}
        isCurrentUserPostOrComment={currentUserPostOrComment}
      />
      <FollowersOrFollowingOrLikesModal
        users={isFollowersModal ? followersList.toArray() : usersFollowingArray}
        show={followersOrFollowingModalShow}
        onHide={() => {
          setFollowersOrFollowingModalShow(false);
          clearFollowersAndFollowing();
          clearFollowPhotoFileArray();
        }}
        isFollowersModal={isFollowersModal}
      />
      {postLikersList ? (
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
  currentUser: User | null;
  postData: Post[] | null;
  postFiles: PostFile[];
  profilePhotoKey: string | null;
  profilePhotoFile: PostFile | null;
  postConfirm: string | null;
  postError: PostError | null;
  getPostDataConfirm: string | null;
  getPostDataError: PostError | null;
  getPostFileConfirm: string | null;
  getPostFileError: PostError | null;
  archivePostConfirm: string | null;
  archivePostError: PostError | null;
  followers: Follower[] | null;
  currentUserUsersFollowing: Follower[] | null;
  getUsersFollowingConfirm: string | null;
  commentToDelete: DeleteReactionReq | null;
  showCommentOptionsModal: boolean;
  postLikingUsersArray: UserInfoAndOtherData[] | null;
  getSinglePostDataConfirm: Post | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  postData: selectPostData,
  postFiles: selectPostFiles,
  profilePhotoKey: selectProfilePhotoKey,
  profilePhotoFile: selectProfilePhotoFile,
  postConfirm: selectPostConfirm,
  postError: selectPostError,
  getPostDataConfirm: selectGetPostDataConfirm,
  getPostDataError: selectGetPostDataError,
  getPostFileConfirm: selectGetPostFileConfirm,
  getPostFileError: selectGetPostFileError,
  archivePostConfirm: selectArchivePostConfirm,
  archivePostError: selectArchivePostError,
  followers: selectFollowers,
  currentUserUsersFollowing: selectCurrentUserUsersFollowing,
  getUsersFollowingConfirm: selectGetUsersFollowingConfirm,
  commentToDelete: selectCommentToDelete,
  showCommentOptionsModal: selectShowCommentOptionsModal,
  postLikingUsersArray: selectPostLikingUsersArray,
  getSinglePostDataConfirm: selectGetSinglePostDataConfirm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getPostDataStart: (postDataReq: PostDataReq) =>
    dispatch(getPostDataStart(postDataReq)),
  getPostFileStart: (fileReq: PostFileReq) =>
    dispatch(getPostFileStart(fileReq)),
  archivePostStart: (archiveReq: ArchivePostReq) =>
    dispatch(archivePostStart(archiveReq)),
  clearArchivePostStatuses: () => dispatch(clearArchivePostStatuses()),
  clearPostState: () => dispatch(clearPostState()),
  getFollowersStart: (userId: string) => dispatch(getFollowersStart(userId)),
  getUsersFollowingStart: (usersFollowingObj: UsersFollowingRequest) =>
    dispatch(getUsersFollowingStart(usersFollowingObj)),
  clearFollowPhotoFileArray: () => dispatch(clearFollowPhotoFileArray()),
  clearFollowersAndFollowing: () => dispatch(clearFollowersAndFollowing()),
  clearFollowState: () => dispatch(clearFollowState()),
  setIsCurrentUserProfilePage: (isCurrentUserProfilePage: boolean) =>
    dispatch(setIsCurrentUserProfilePage(isCurrentUserProfilePage)),
  setShowCommentOptionsModal: (showCommentOptionsModal: boolean) =>
    dispatch(setShowCommentOptionsModal(showCommentOptionsModal)),
  deleteReactionStart: (deleteReactionReq: DeleteReactionReq) =>
    dispatch(deleteReactionStart(deleteReactionReq)),
  setShowPostEditForm: (showPostEditForm: boolean) =>
    dispatch(setShowPostEditForm(showPostEditForm)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyProfilePage);
