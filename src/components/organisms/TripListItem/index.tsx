import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import Feather from 'react-native-vector-icons/Feather';

import { parseWidthPercentage } from '@utils/screenPercentage';

import ITrip from '@models/Trip';

import ListItemCard from '@components/atoms/ListItemCard';

import AvatarImage from '@components/atoms/AvatarImage';
import {
  TripMeta,
  TripTextWrapper,
  TripTravellerFullName,
  TripTravellerUsername,
  TripDeliveryInfo,
  TripFromToText,
  TripDateTime,
  TripInfoContainer,
} from './styles';

interface TripListItemProps {
  trip: ITrip;
}

const TripListItem: React.FC<TripListItemProps> = ({ trip }) => {
  const navigation = useNavigation();

  const handleNavigateToTripDetails = useCallback(() => {
    navigation.navigate('TripDetails', { id: trip.id });
  }, [navigation, trip.id]);

  return (
    <ListItemCard
      flexDirection="column"
      padding={0}
      height={96}
      onPress={handleNavigateToTripDetails}
    >
      <TripInfoContainer>
        <AvatarImage user={trip.user} />

        <TripMeta>
          <TripTextWrapper>
            <TripTravellerFullName>{trip.user.name}</TripTravellerFullName>
            <TripTravellerUsername>{`@${trip.user.username}`}</TripTravellerUsername>
          </TripTextWrapper>

          <TripDeliveryInfo>
            <TripTextWrapper>
              <Feather
                name="map-pin"
                size={parseWidthPercentage(12)}
                color="#adadad"
              />
              <TripFromToText color="#adadad" marginRight={8}>
                {`${trip.return_city}, ${trip.return_state}`}
              </TripFromToText>

              <Feather
                name="navigation"
                size={parseWidthPercentage(12)}
                color="#ff8c42"
              />
              <TripFromToText color="#ff8c42" textBold>
                {`${trip.destination_city}, ${trip.destination_state}`}
              </TripFromToText>
            </TripTextWrapper>

            <TripTextWrapper>
              <TripDateTime marginRight={8}>
                {`Partida em ${format(
                  parseISO(trip.departure_date),
                  'dd/MM/yyyy',
                )}`}
              </TripDateTime>
              <TripDateTime>
                {`Retorno em ${format(
                  parseISO(trip.return_date),
                  'dd/MM/yyyy',
                )}`}
              </TripDateTime>
            </TripTextWrapper>
          </TripDeliveryInfo>
        </TripMeta>
      </TripInfoContainer>
    </ListItemCard>
  );
};

export default TripListItem;
