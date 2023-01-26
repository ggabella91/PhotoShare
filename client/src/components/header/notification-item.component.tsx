import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Button, Typography, Avatar } from '@mui/material';
import { Notification } from '../../redux/follower/follower.types';
import { User } from '../../redux/user/user.types';
import { PostFile } from '../../redux/post/post.types';

interface NotificationItemProps {
  notification: Notification;
  user: User;
  photoInfo: PostFile | null;
}

// TODO Add logic to show previews of comments that are
// above a certain lenght, with an ellipsis

const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  user,
  photoInfo,
}) => {
  const { message, createdAt, postId } = notification;
  const navigate = useNavigate();

  const handleClickNotificationItem = () => {
    if (postId) {
      navigate(`/p/${postId}`);
    }
  };

  return (
    <Grid
      sx={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: '85px',
        borderBottom: '1px solid rgb(219,219,219)',
      }}
    >
      <Grid
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Avatar
          src={
            photoInfo?.fileString
              ? `data:image/jpeg;base64,${photoInfo.fileString}`
              : ''
          }
          alt={''}
          sx={{ height: '56px', width: '56px', marginLeft: '10px' }}
        />
      </Grid>
      <Button
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
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
        onClick={handleClickNotificationItem}
      >
        <Typography sx={{ width: 'inherit', fontSize: '14px ' }}>
          {message}
        </Typography>
        <Typography sx={{ width: 'inherit', fontSize: '12px ' }}>
          {new Date(createdAt).toDateString()}
        </Typography>
      </Button>
      <Grid
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Avatar
          src={''}
          alt={''}
          sx={{ height: '56px', width: '56px', marginRight: '10px' }}
          variant='square'
        />
      </Grid>
    </Grid>
  );
};

export default NotificationItem;
