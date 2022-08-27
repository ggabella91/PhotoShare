import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Grid, Typography } from '@mui/material';
import { RadioButtonUnchecked, CheckCircle } from '@mui/icons-material';
import CustomAvatarGroup, {
  StyleVariation,
} from './custom-avatar-group.component';
import { Conversation } from '../../redux/message/message.types';
import { generateDefaultConvoName } from '../../pages/messages-page/messages-page.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';

interface ForwardConvoDetailsProps {
  key: string;
  conversation: Conversation;
  convosToReceiveMessage: Conversation[];
  setConvosToReceiveMessage: React.Dispatch<
    React.SetStateAction<Conversation[]>
  >;
}

const ForwardConvoDetails = ({
  conversation,
  convosToReceiveMessage,
  setConvosToReceiveMessage,
}: ForwardConvoDetailsProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    const convoChipFound = convosToReceiveMessage.find(
      (convo) => convo.id === conversation.id
    );

    if (!convoChipFound) {
      setIsChecked(false);
    } else {
      setIsChecked(true);
    }
  }, [conversation.id, convosToReceiveMessage]);

  const handleClick = () => {
    const convoChipFound = convosToReceiveMessage.find(
      (convo) => convo.id === conversation.id
    );

    let newConvosToReceiveMessage: Conversation[];

    if (!convoChipFound) {
      newConvosToReceiveMessage = [...convosToReceiveMessage, conversation];
      setConvosToReceiveMessage(newConvosToReceiveMessage);
    } else {
      newConvosToReceiveMessage = convosToReceiveMessage.filter(
        (convo) => convo.id !== conversation.id
      );
      setConvosToReceiveMessage(newConvosToReceiveMessage);
    }
  };

  return (
    <Grid
      sx={{
        width: '100%',
        height: '60px',
        padding: '5px 15px',
        display: 'flex',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <Grid
        item
        xs={2}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: '12px',
          width: '15%',
        }}
      >
        <CustomAvatarGroup
          avatarS3Keys={conversation.avatarS3Keys}
          conversationName={conversation.name}
          styleVariation={StyleVariation.forwardMessage}
        />
      </Grid>
      <Grid
        item
        xs={8}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '75%',
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 520 }}>
          {conversation.name}
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 300 }}>
          {currentUser &&
            generateDefaultConvoName(
              conversation.connectedUserNames,
              currentUser
            )}
        </Typography>
      </Grid>
      <Grid
        item
        xs={2}
        fontSize='large'
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '10%',
        }}
      >
        {isChecked ? (
          <CheckCircle sx={{ color: 'rgb(0, 149, 246)' }} />
        ) : (
          <RadioButtonUnchecked />
        )}
      </Grid>
    </Grid>
  );
};

export default ForwardConvoDetails;
