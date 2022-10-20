import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { List, Map } from 'immutable';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import slugify from 'slugify';

import { AppState } from '../../redux/root-reducer';

import { User, OtherUserType } from '../../redux/user/user.types';

import { getOtherUserStart } from '../../redux/user/user.actions';

import {
  Reaction,
  Post,
  FileRequestType,
  PostFile,
  ReactionRequestType,
  UserType,
  Location,
} from '../../redux/post/post.types';
import {
  getSinglePostDataStart,
  createPostReactionStart,
  getPostReactionsStart,
  getPostFileStart,
  getUserPhotoForReactorArraySuccess,
  archivePostStart,
  deleteReactionStart,
  clearPostReactions,
  setPostLikingUsersArray,
  setShowPostEditForm,
  clearPostState,
  setShowCommentOptionsModal,
  setIsPostPage,
  setLocationCoordinates,
} from '../../redux/post/post.actions';

import UserInfo, {
  StyleType,
  UserInfoAndOtherData,
} from '../../components/user-info/user-info.component';

import FollowersOrFollowingOrLikesModal from '../../components/followers-or-following-or-likes-modal/followers-or-following-or-likes-modal.component';
import PostOrCommentOptionsModal from '../../components/post-or-comment-options-modal/post-or-comment-options-modal.component';
import Button from '../../components/button/button.component';
import { ExpandableFormInput } from '../../components/form-input/form-input.component';
import EditPostForm from '../../components/edit-post-form/edit-post-form.component';

import {
  compareUserOrPostOrReactionLists,
  compareUserInfoAndDataObjLists,
} from '../../pages/feed-page/feed-page.utils';

import './post-page.styles.scss';

export interface ImmutableMap<T> extends Map<string, any> {
  get<K extends keyof T>(name: K): T[K];
}

export interface AlreadyLikedAndReactionId {
  alreadyLikedPost: boolean;
  reactionId: string;
}

export const PostPage: React.FC = () => {
  const userState = useSelector((state: AppState) => state.user);
  const postState = useSelector((state: AppState) => state.post);

  const dispatch = useDispatch();

  const { postId } = useParams();

  const { currentUser, otherUser, postReactingUsers } = userState;

  const {
    getSinglePostDataConfirm,
    postFiles,
    otherUserProfilePhotoFile,
    postReactionsArray,
    postReactionConfirm,
    deleteReactionConfirm,
    reactorPhotoFileArray,
    showPostEditForm,
    commentToDelete,
    showCommentOptionsModal,
    editPostDetailsConfirm,
    isLoadingPostData,
  } = postState;

  const [postData, setPostData] = useState<Post | null>(null);

  const [isCurrentUserPost, setIsCurrentUserPost] = useState(false);

  const [isCurrentUserComment, setIsCurrentUserComment] = useState(false);

  const [comment, setComment] = useState('');

  const [captionInfoList, setCaptionInfoList] = useState<
    List<UserInfoAndOtherData>
  >(List());

  const [reactionsList, setReactionsList] = useState<List<Reaction>>(List());

  const [uniqueReactingUsers, setUniqueReactingUsers] = useState<Set<string>>(
    new Set()
  );

  const [reactingUserInfoList, setReactingUsersInfoList] = useState<List<User>>(
    List()
  );

  const [userProfilePhotoList, setUserProfilePhotoList] = useState<
    List<PostFile>
  >(List());

  const [commentingUserList, setCommentingUserList] = useState<
    List<UserInfoAndOtherData>
  >(List());

  const [likingUsersList, setLikingUsersList] = useState<
    List<UserInfoAndOtherData>
  >(List());

  const [alreadyLikedPostAndReactionId, setAlreadyLikedPostAndReactionId] =
    useState<AlreadyLikedAndReactionId>({
      alreadyLikedPost: false,
      reactionId: '',
    });

  const [editPostDetails, setEditPostDetails] = useState({
    editCaption: '',
    editLocation: '',
  });

  const [areReactionsReadyForRendering, setAreReactionsReadyForRendering] =
    useState(false);

  const [showPostOptionsModal, setShowPostOptionsModal] = useState(false);

  const [showPostLikingUsersModal, setShowPostLikingUsersModal] =
    useState(false);

  const [slugifiedLocationLabel, setSlugifiedLocationLabel] = useState('');

  let postsBucket: string, profileBucket: string;

  if (process.env.NODE_ENV === 'production') {
    postsBucket = 'photo-share-app';
    profileBucket = 'photo-share-app-profile-photos';
  } else {
    postsBucket = 'photo-share-app-dev';
    profileBucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(
    // Clear post state when cleaning up before component
    // leaves the screen
    () => {
      dispatch(setIsPostPage(true));

      return () => {
        dispatch(clearPostState());
        dispatch(setIsPostPage(false));
      };
    },
    []
  );

  useEffect(() => {
    postId && dispatch(getSinglePostDataStart({ postId }));
  }, [postId]);

  useEffect(() => {
    if (getSinglePostDataConfirm) {
      setPostData(getSinglePostDataConfirm);
      setEditPostDetails({
        editCaption: getSinglePostDataConfirm.caption || '',
        editLocation: getSinglePostDataConfirm.postLocation?.label || '',
      });

      if (getSinglePostDataConfirm.postLocation) {
        dispatch(
          setLocationCoordinates({
            latitude: getSinglePostDataConfirm.postLocation.latitude,
            longitude: getSinglePostDataConfirm.postLocation.longitude,
          })
        );
      }

      const { userId } = getSinglePostDataConfirm;

      dispatch(
        getOtherUserStart({
          type: OtherUserType.POST_PAGE_USER,
          usernameOrId: userId,
        })
      );
    }
  }, [getSinglePostDataConfirm]);

  useEffect(() => {
    if (otherUser && otherUser.photo) {
      dispatch(
        getPostFileStart({
          user: UserType.other,
          fileRequestType: FileRequestType.singlePost,
          s3Key: otherUser.photo,
          bucket: profileBucket,
        })
      );
    }
  }, [otherUser]);

  useEffect(() => {
    if (postData) {
      handleSetIsCurrentUserPost(postData);

      if (postData.postLocation && postData.postLocation.label) {
        const slugifiedString = slugify(postData.postLocation.label, {
          lower: true,
          strict: true,
        });
        setSlugifiedLocationLabel(slugifiedString);
      }

      dispatch(
        getPostFileStart({
          s3Key: postData.s3Key,
          isVideo: postData.isVideo,
          videoThumbnailS3Key: postData.videoThumbnailS3Key,
          bucket: postsBucket,
          user: UserType.other,
          fileRequestType: FileRequestType.singlePost,
        })
      );
    }
  }, [postData]);

  useEffect(() => {
    if (postData && otherUser && otherUserProfilePhotoFile) {
      setCaptionInfoList(
        List([
          {
            username: otherUser.username,
            name: '',
            profilePhotoFileString: otherUserProfilePhotoFile.fileString,
            comment: postData.caption || '',
            location: {} as Location,
            commentDate: postData.createdAt,
          },
        ])
      );
    }
  }, [postData, otherUser, otherUserProfilePhotoFile]);

  useEffect(() => {
    if (editPostDetailsConfirm) {
      let newCaption = editPostDetailsConfirm.caption || '';
      let newLocation = editPostDetailsConfirm.postLocation || ({} as Location);

      if (postData && otherUser && otherUserProfilePhotoFile && newCaption) {
        setCaptionInfoList(
          List([
            {
              username: otherUser.username,
              name: '',
              profilePhotoFileString: otherUserProfilePhotoFile.fileString,
              comment: newCaption,
              location: newLocation,
              commentDate: postData.createdAt,
            },
          ])
        );

        setEditPostDetails({
          editCaption: newCaption,
          editLocation: newLocation.label || '',
        });

        if (editPostDetailsConfirm.postLocation) {
          if (editPostDetailsConfirm.postLocation.label) {
            const slugifiedString = slugify(
              editPostDetailsConfirm.postLocation.label,
              {
                lower: true,
                strict: true,
              }
            );
            setSlugifiedLocationLabel(slugifiedString);
          }

          dispatch(
            setLocationCoordinates({
              latitude: editPostDetailsConfirm.postLocation.latitude,
              longitude: editPostDetailsConfirm.postLocation.longitude,
            })
          );
        }
      } else {
        setCaptionInfoList(List());
      }

      getSinglePostDataStart({ postId: editPostDetailsConfirm.id });
    }
  }, [postData, otherUser, otherUserProfilePhotoFile, editPostDetailsConfirm]);

  useEffect(() => {
    if (!areReactionsReadyForRendering && postId) {
      dispatch(
        getPostReactionsStart({
          postId: postId,
          reactionReqType: ReactionRequestType.singlePost,
        })
      );
    }
  }, []);

  useEffect(() => {
    if (
      postReactionsArray &&
      postReactionsArray.length &&
      !areReactionsReadyForRendering
    ) {
      postReactionsArray.forEach((innerArray) => {
        let innerArrayAsList = List(innerArray);

        if (
          innerArrayAsList.size &&
          innerArrayAsList.get(0)!.postId === postId
        ) {
          if (
            !compareUserOrPostOrReactionLists(reactionsList, innerArrayAsList)
          ) {
            setReactionsList(innerArrayAsList);
          }
        }
      });
    } else if (postReactionsArray && !postReactionsArray.length) {
      setReactionsList(List());
      setUniqueReactingUsers(new Set());
      setReactingUsersInfoList(List());
      setUserProfilePhotoList(List());
      setLikingUsersList(List());
      setCommentingUserList(List());
    }
  }, [postReactionsArray]);

  useEffect(() => {
    if (currentUser && reactionsList.size && !areReactionsReadyForRendering) {
      const foundPost = reactionsList.find(
        (el) => el.reactingUserId === currentUser.id && el.likedPost
      );

      if (foundPost) {
        setAlreadyLikedPostAndReactionId({
          alreadyLikedPost: true,
          reactionId: foundPost.id,
        });
      } else {
        setAlreadyLikedPostAndReactionId({
          alreadyLikedPost: false,
          reactionId: 'no-post-found',
        });
      }
    }
  }, [reactionsList]);

  useEffect(() => {
    if (
      postReactionConfirm &&
      postReactionConfirm.message === 'Post liked successfully!' &&
      postId &&
      postReactionConfirm.postId === postId
    ) {
      dispatch(clearPostReactions());

      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: true,
        reactionId: postReactionConfirm.reactionId,
      });

      setLikingUsersList(List());
      setAreReactionsReadyForRendering(false);
      dispatch(
        getPostReactionsStart({
          postId: postId,
          reactionReqType: ReactionRequestType.singlePost,
        })
      );
    }
  }, [postReactionConfirm]);

  useEffect(() => {
    if (
      deleteReactionConfirm &&
      deleteReactionConfirm.message === 'Like removed successfully!' &&
      postId &&
      deleteReactionConfirm.postId === postId
    ) {
      dispatch(clearPostReactions());

      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: false,
        reactionId: '',
      });

      setLikingUsersList(List());
      setAreReactionsReadyForRendering(false);
      dispatch(
        getPostReactionsStart({
          postId: postId,
          reactionReqType: ReactionRequestType.singlePost,
        })
      );
    }
  }, [deleteReactionConfirm]);

  useEffect(() => {
    if (
      postReactionConfirm &&
      postReactionConfirm.message === 'Post comment created successfully!' &&
      postId &&
      postReactionConfirm.postId === postId
    ) {
      dispatch(clearPostReactions());

      setAreReactionsReadyForRendering(false);
      dispatch(
        getPostReactionsStart({
          postId: postId,
          reactionReqType: ReactionRequestType.singlePost,
        })
      );
    }
  }, [postReactionConfirm]);

  useEffect(() => {
    if (
      deleteReactionConfirm &&
      deleteReactionConfirm.message === 'Comment removed successfully!' &&
      postId &&
      deleteReactionConfirm.postId === postId
    ) {
      dispatch(clearPostReactions());

      setAreReactionsReadyForRendering(false);
      dispatch(
        getPostReactionsStart({
          postId: postId,
          reactionReqType: ReactionRequestType.singlePost,
        })
      );
    }
  }, [deleteReactionConfirm]);

  useEffect(() => {
    if (reactionsList.size && !areReactionsReadyForRendering) {
      reactionsList.forEach((el) => {
        dispatch(
          getOtherUserStart({
            type: OtherUserType.POST_REACTOR,
            usernameOrId: el.reactingUserId,
          })
        );

        setUniqueReactingUsers(uniqueReactingUsers.add(el.reactingUserId));
      });
    }
  }, [reactionsList]);

  useEffect(() => {
    if (postReactingUsers && postReactingUsers.length) {
      setReactingUsersInfoList(List(postReactingUsers));
    }
  }, [postReactingUsers]);

  useEffect(() => {
    if (reactingUserInfoList.size && !areReactionsReadyForRendering) {
      reactingUserInfoList.forEach((el) => {
        if (el.photo) {
          dispatch(
            getPostFileStart({
              s3Key: el.photo,
              bucket: profileBucket,
              user: UserType.postReactorsArray,
              fileRequestType: FileRequestType.singlePost,
            })
          );
        } else {
          dispatch(
            getUserPhotoForReactorArraySuccess({ s3Key: '', fileString: '' })
          );
        }
      });
    }
  }, [reactingUserInfoList]);

  useEffect(() => {
    if (reactorPhotoFileArray) {
      setUserProfilePhotoList(List(reactorPhotoFileArray));
    }
  }, [reactorPhotoFileArray]);

  useEffect(() => {
    if (
      reactionsList.size &&
      reactingUserInfoList.size &&
      uniqueReactingUsers.size &&
      reactingUserInfoList.size >= uniqueReactingUsers.size &&
      userProfilePhotoList.size &&
      reactingUserInfoList.size === userProfilePhotoList.size &&
      !areReactionsReadyForRendering
    ) {
      let commentsList: List<UserInfoAndOtherData> = List();
      let likesList: List<UserInfoAndOtherData> = List();

      reactionsList.forEach((reactionEl) => {
        const userId = reactionEl.reactingUserId;
        let username: string;
        let name: string;
        let comment = reactionEl.comment;
        let photoKey: string;
        let fileString: string;

        reactingUserInfoList.forEach((infoEl) => {
          if (infoEl.id === userId) {
            username = infoEl.username;
            name = infoEl.name;
            photoKey = infoEl.photo || '';
          }
        });

        userProfilePhotoList.forEach((photoEl) => {
          if (photoEl.s3Key === photoKey) {
            fileString = photoEl.fileString;
          }
        });

        if (!photoKey!) {
          fileString = '';
        }

        if (!comment) {
          comment = '';
        }

        if (reactionEl.likedPost) {
          likesList = likesList.push({
            username: username!,
            name: name!,
            profilePhotoFileString: fileString!,
            comment: '',
            location: {} as Location,
            reactionId: reactionEl.id,
            postId: postId,
          });
        } else {
          commentsList = commentsList.push({
            username: username!,
            name: name!,
            profilePhotoFileString: fileString!,
            comment,
            location: {} as Location,
            commentDate: reactionEl.createdAt,
            reactionId: reactionEl.id,
            reactingUserId: reactionEl.reactingUserId,
            postId: postId,
          });
        }
      });

      if (!compareUserInfoAndDataObjLists(commentingUserList, commentsList)) {
        setCommentingUserList(commentsList);
      }

      if (!compareUserInfoAndDataObjLists(likingUsersList, likesList)) {
        setLikingUsersList(likesList);
        setPostLikingUsersArray(likesList.toArray());
      }

      setAreReactionsReadyForRendering(true);
    }
  }, [
    reactionsList,
    uniqueReactingUsers,
    reactingUserInfoList,
    userProfilePhotoList,
  ]);

  const handleSetIsCurrentUserPost = (postData: Post) => {
    if (currentUser) {
      if (postData.userId === currentUser.id) {
        setIsCurrentUserPost(true);
      } else {
        setIsCurrentUserPost(false);
      }
    }
  };

  useEffect(() => {
    handleSetIsCurrentUserComment();
  }, [showCommentOptionsModal]);

  const handleSetIsCurrentUserComment = () => {
    if (currentUser && commentToDelete && commentToDelete.reactingUserId) {
      if (commentToDelete.reactingUserId === currentUser.id) {
        setIsCurrentUserComment(true);
      } else {
        setIsCurrentUserComment(false);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setComment(value);
  };

  const handleSubmitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (postId && currentUser && comment) {
      dispatch(
        createPostReactionStart({
          reactingUserId: currentUser.id,
          postId: postId,
          likedPost: false,
          comment,
        })
      );
    }
    setComment('');
  };

  const handleRenderLikeOrLikedButton = () => {
    return (
      <Button className='like-button' onClick={handleClickLikeButton}>
        {alreadyLikedPostAndReactionId.alreadyLikedPost ? (
          <FavoriteIcon htmlColor='red' />
        ) : (
          <FavoriteBorderIcon />
        )}
      </Button>
    );
  };

  const handleClickLikeButton = () =>
    alreadyLikedPostAndReactionId.alreadyLikedPost
      ? handleSubmitRemoveLike()
      : handleSubmitLike();

  const handleSubmitLike = () => {
    if (postId && currentUser) {
      dispatch(
        createPostReactionStart({
          reactingUserId: currentUser.id,
          postId: postId,
          likedPost: true,
          comment: '',
        })
      );
    }
  };

  const handleSubmitRemoveLike = () => {
    postId &&
      dispatch(
        deleteReactionStart({
          reactionId: alreadyLikedPostAndReactionId.reactionId,
          isLikeRemoval: true,
          postId: postId,
        })
      );
  };

  const handleRenderEditPostDetails = () => {
    if (isCurrentUserPost && !showPostEditForm) {
      return (
        <span className='post-page-edit-post' onClick={handleShowPostEditForm}>
          Edit post details
        </span>
      );
    } else if (postId && isCurrentUserPost && showPostEditForm) {
      return (
        <EditPostForm
          postId={postId}
          editCaption={editPostDetails.editCaption}
          editLocation={editPostDetails.editLocation}
        />
      );
    } else return null;
  };

  const handleShowPostEditForm = () => dispatch(setShowPostEditForm(true));

  const handleShowPostLikingUsersModal = () =>
    setShowPostLikingUsersModal(true);

  const handleSetShowPostOptionsModal = () => setShowPostOptionsModal(true);

  const handleArchivePost = () => {
    if (postId && postData) {
      dispatch(
        archivePostStart({
          postId,
          s3Key: postData.s3Key,
        })
      );
    }
  };

  const handleArchiveComment = () => {
    if (commentToDelete) {
      dispatch(deleteReactionStart(commentToDelete));
    }
    dispatch(setShowCommentOptionsModal(false));
  };

  const handleHidePostLikingUsersModal = () =>
    setShowPostLikingUsersModal(false);

  const handleHidePostOptionsModal = () => setShowPostOptionsModal(false);

  const handleHideCommentOptionsModal = () =>
    dispatch(setShowCommentOptionsModal(false));

  return (
    <div className='post-page' data-testid='post-page'>
      <div className='post-container'>
        <div className='post-media-container'>
          {postFiles.length && !postData?.isVideo ? (
            <img
              className='post-image'
              src={`data:image/jpeg;base64,${postFiles[0].fileString}`}
              alt='post-pic'
            />
          ) : null}
          {!postFiles.length && !postData?.isVideo && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '10px',
                paddingBottom: '10px',
                marginLeft: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {postData?.isVideo && (
            <video className='post-video' controls muted>
              <source src={`/api/video?s3Key=${postData.s3Key}`} />
            </video>
          )}
        </div>
        <div className='post-page-details'>
          <div className='post-page-user-and-location'>
            {otherUserProfilePhotoFile ? (
              <img
                className='user-photo'
                src={`data:image/jpeg;base64,${otherUserProfilePhotoFile.fileString}`}
                alt='user'
              />
            ) : null}
            {!otherUserProfilePhotoFile && isLoadingPostData ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  marginLeft: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                <CircularProgress />
              </Box>
            ) : null}
            {!otherUserProfilePhotoFile && !isLoadingPostData ? (
              <div className='user-photo-placeholder'>
                <p className='user-photo-placeholder-text'>No photo</p>
              </div>
            ) : null}
            <div className='text-and-options'>
              <div className='user-and-location'>
                {otherUser ? (
                  <span className='user-name'>{otherUser.username}</span>
                ) : null}
                <NavLink
                  to={`/explore/locations/${
                    postData?.postLocation?.id || ''
                  }/${slugifiedLocationLabel}`}
                  className='post-page-location'
                >
                  {editPostDetails?.editLocation || null}
                </NavLink>
              </div>
              <button
                className='post-page-options'
                onClick={handleSetShowPostOptionsModal}
              >
                <MoreHorizIcon className='ellipsis' />
              </button>
            </div>
          </div>
          <div className='post-page-caption-and-comments-container'>
            {captionInfoList.size && !showPostEditForm ? (
              <UserInfo
                styleType={StyleType.postPage}
                userInfoList={captionInfoList}
                isCaption
                isCaptionOwner={isCurrentUserPost ? true : false}
              />
            ) : (
              handleRenderEditPostDetails()
            )}
            {!areReactionsReadyForRendering && reactionsList.size ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                }}
              >
                <CircularProgress />
              </Box>
            ) : null}
            {commentingUserList.size ? (
              <UserInfo
                styleType={StyleType.postPage}
                userInfoList={commentingUserList}
              />
            ) : null}
          </div>
          {handleRenderLikeOrLikedButton()}
          {likingUsersList.size ? (
            <Button className='likes' onClick={handleShowPostLikingUsersModal}>
              <span>{`${likingUsersList.size} likes`}</span>
            </Button>
          ) : null}
          {postData ? (
            <span className='post-page-post-date'>
              {new Date(postData.createdAt).toDateString()}
            </span>
          ) : null}
          <form
            className='post-page-comment-form'
            onSubmit={handleSubmitComment}
          >
            <ExpandableFormInput
              tall={true}
              onChange={handleChange}
              name='comment'
              type='textarea'
              value={comment}
              label='Add a comment...'
            />
            <Button
              className={`${
                !comment ? 'greyed-out ' : ''
              }post-page-submit-comment-button`}
              disabled={comment ? false : true}
              onClick={handleSubmitComment}
            >
              <span>Post</span>
            </Button>
          </form>
        </div>
      </div>
      {likingUsersList.size ? (
        <FollowersOrFollowingOrLikesModal
          users={null}
          show={showPostLikingUsersModal}
          onHide={handleHidePostLikingUsersModal}
          isFollowersModal={false}
          isPostLikingUsersModal={true}
          postLikingUsersList={likingUsersList}
        />
      ) : null}
      <PostOrCommentOptionsModal
        show={showPostOptionsModal}
        onHide={handleHidePostOptionsModal}
        isCurrentUserPostOrComment={isCurrentUserPost}
        postOptionsModal={true}
        isInPostPage={true}
        archive={handleArchivePost}
      />
      <PostOrCommentOptionsModal
        show={showCommentOptionsModal}
        onHide={handleHideCommentOptionsModal}
        archive={handleArchiveComment}
        isCurrentUserPostOrComment={isCurrentUserComment}
        postOptionsModal={false}
      />
    </div>
  );
};

export default PostPage;
