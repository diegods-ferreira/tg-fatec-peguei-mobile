import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';
import { Rating } from 'react-native-elements';

import IUserRate from '@models/UserRate';

import { parseWidthPercentage } from '@utils/screenPercentage';

import noUserAvatarImg from '@assets/no-user-avatar.png';

import {
  Container,
  Header,
  UserAvatar,
  UserInfo,
  UserFullName,
  Username,
  Stars,
  Text,
} from './styles';

interface AvaluationCardProps extends RectButtonProperties {
  rate: IUserRate;
  getUserInfoFrom: 'requester' | 'deliveryman';
  ellipsizeText: boolean;
  smallCard?: boolean;
  onPress?: () => void;
}

const AvaluationCard: React.FC<AvaluationCardProps> = ({
  rate,
  getUserInfoFrom,
  ellipsizeText,
  smallCard = false,
  onPress,
}) => {
  return (
    <Container rippleColor="#ebebeb10" smallCard={smallCard} onPress={onPress}>
      <Header>
        <UserAvatar
          source={
            rate[getUserInfoFrom]?.avatar_url
              ? { uri: rate[getUserInfoFrom]?.avatar_url }
              : noUserAvatarImg
          }
        />

        <UserInfo>
          <UserFullName>{rate[getUserInfoFrom]?.name}</UserFullName>
          <Username>{rate[getUserInfoFrom]?.username}</Username>
          <Stars>
            <Rating
              readonly
              type="custom"
              startingValue={rate.rate / 2}
              ratingBackgroundColor="#606060"
              ratingColor="#feca57"
              tintColor="#312e38"
              imageSize={parseWidthPercentage(8)}
            />
          </Stars>
        </UserInfo>
      </Header>

      <Text
        smallCard={smallCard}
        numberOfLines={ellipsizeText ? 1 : undefined}
        ellipsizeMode={ellipsizeText ? 'tail' : undefined}
      >
        {rate.comment}
      </Text>
    </Container>
  );
};

export default AvaluationCard;
