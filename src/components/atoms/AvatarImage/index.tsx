import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { parseWidthPercentage } from '@utils/screenPercentage';

import { useAuth } from '@hooks/auth';

import IUser from '@models/User';

import noUserAvatarImg from '@assets/no-user-avatar.png';

import { Image } from './styles';

interface AvatarImageProps {
  user?: IUser;
  size?: number;
  navigateToProfileOnPress?: boolean;
}

const AvatarImage: React.FC<AvatarImageProps> = ({
  user,
  size = 40,
  navigateToProfileOnPress = false,
}) => {
  const navigation = useNavigation();
  const { user: authUser } = useAuth();

  const handleNavigateToUserProfile = useCallback(() => {
    if (!user || !navigateToProfileOnPress) {
      return;
    }

    if (user.id === authUser.id) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('UserProfile', { user_id: user.id });
    }
  }, [user, navigateToProfileOnPress, authUser.id, navigation]);

  const imageComponent = useMemo(() => {
    return (
      <Image
        size={parseWidthPercentage(size)}
        source={user?.avatar_url ? { uri: user?.avatar_url } : noUserAvatarImg}
      />
    );
  }, [size, user]);

  if (!navigateToProfileOnPress) {
    return imageComponent;
  }

  return (
    <TouchableOpacity onPress={handleNavigateToUserProfile}>
      {imageComponent}
    </TouchableOpacity>
  );
};

export default AvatarImage;
