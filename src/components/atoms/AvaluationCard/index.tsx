import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';
import { Rating } from 'react-native-elements';

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

interface Avaluation {
  user: {
    name: string;
    username: string;
    avatar_url: string;
  };
  rating: number;
  text: string;
}

interface AvaluationCardProps extends RectButtonProperties {
  avaluation: Avaluation;
  ellipsizeText: boolean;
  smallCard: boolean;
}

const AvaluationCard: React.FC<AvaluationCardProps> = ({
  avaluation,
  ellipsizeText,
  smallCard,
}) => {
  return (
    <Container rippleColor="#ebebeb10" smallCard={smallCard}>
      <Header>
        <UserAvatar source={noUserAvatarImg} />

        <UserInfo>
          <UserFullName>{avaluation.user.name}</UserFullName>
          <Username>{avaluation.user.username}</Username>
          <Stars>
            <Rating
              readonly
              type="custom"
              startingValue={avaluation.rating}
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
        {avaluation.text}
      </Text>
    </Container>
  );
};

export default AvaluationCard;
