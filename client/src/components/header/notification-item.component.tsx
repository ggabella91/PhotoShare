import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Button, Typography, Avatar } from '@mui/material';
import { Notification } from '../../redux/follower/follower.types';
import { User } from '../../redux/user/user.types';
import { PostFile } from '../../redux/post/post.types';

interface NotificationItemProps {
  notification: Notification;
  user: User;
  userPhotoInfo: PostFile | null;
  postPhotoInfo?: PostFile | null;
}

const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  user,
  userPhotoInfo,
  postPhotoInfo,
}) => {
  const { message, createdAt, postId } = notification;
  const navigate = useNavigate();

  const handleClickNotificationItem = () => {
    navigate(`/${user.username}`);
  };

  const handleClickNotificationPost = () => {
    if (postId) {
      navigate(`/p/${postId}`);
    }
  };

  const handleSetMessagePreviewForDisplay = (message: string) => {
    if (message.length >= 65) {
      const messagePreview = `${message.slice(0, 65)}...`;
      return messagePreview;
    }

    return message;
  };

  return (
    <Grid
      sx={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: '95px',
        width: '100%',
        borderBottom: '1px solid rgb(219,219,219)',
      }}
    >
      <Button
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: '270px',
          height: '100%',
          maxHeight: '95px',
          textTransform: 'unset',
          color: 'black',
          borderRadius: 0,
          textAlign: 'start',
          '&:hover': {
            backgroundColor: 'unset',
          },
        }}
        disableRipple
        onClick={handleClickNotificationItem}
      >
        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Avatar
            src={
              userPhotoInfo?.fileString
                ? `data:image/jpeg;base64,${userPhotoInfo.fileString}`
                : ''
            }
            alt={user.username}
            sx={{ height: '56px', width: '56px', marginRight: '10px' }}
          />
        </Grid>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '5px 8px',
          }}
        >
          <Typography
            sx={{ width: 'inherit', fontSize: '14px ', maxHeight: '67px' }}
          >
            {handleSetMessagePreviewForDisplay(message)}
          </Typography>
          <Typography sx={{ width: 'inherit', fontSize: '12px ' }}>
            {new Date(createdAt).toDateString()}
          </Typography>
        </Grid>
      </Button>
      {!!postPhotoInfo && (
        <Button
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 'fit-content',
            minWidth: 'unset',
            height: '100%',
            textTransform: 'unset',
            padding: 1,
            color: 'black',
            borderRadius: 0,
            textAlign: 'start',
            '&:hover': {
              backgroundColor: 'unset',
            },
          }}
          disableRipple
          onClick={handleClickNotificationPost}
        >
          <Avatar
            src={`data:image/jpeg;base64,${postPhotoInfo.fileString}`}
            alt={`Post ${notification.postId || ''}`}
            sx={{ height: '56px', width: '56px' }}
            variant='square'
          />
        </Button>
      )}
    </Grid>
  );
};

export default NotificationItem;
