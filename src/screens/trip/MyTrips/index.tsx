import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { endOfMonth, format, isAfter, isSameMonth, parseISO } from 'date-fns';
import Feather from 'react-native-vector-icons/Feather';

import api from '@services/api';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

import ITrip from '@models/Trip';

import TripListItem from '@components/organisms/TripListItem';
import FloatingButton from '@components/atoms/FloatingButton';
import Label from '@components/atoms/Label';
import LoadingScreen from '@components/atoms/LoadingScreen';

import {
  Container,
  TripsListContainer,
  TripsList,
  EmptyTripsListContainer,
  EmptyTripsListText,
} from './styles';

export interface ITripExtended extends ITrip {
  formatted_created_at: string;
  formatted_departure_date: string;
  formatted_return_date: string;
}

interface Section {
  title: string;
  data: ITripExtended[];
}

const MyTrips: React.FC = () => {
  const navigation = useNavigation();

  const [trips, setTrips] = useState<ITripExtended[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTripsFromApi = useCallback(() => {
    setLoading(true);

    api
      .get('/trips/me')
      .then(response => {
        setTrips(
          response.data.map((trip: ITripExtended) => ({
            ...trip,
            formatted_created_at: format(
              parseISO(trip.created_at),
              'dd/MM/yyyy',
            ),
            formatted_departure_date: format(
              parseISO(trip.departure_date),
              'dd/MM/yyyy',
            ),
            formatted_return_date: format(
              parseISO(trip.return_date),
              'dd/MM/yyyy',
            ),
          })),
        );
      })
      .catch(err => {
        Alert.alert(
          'Erro',
          `Ocorreu um erro ao tentar recuperar suas viagens. Tente novamente mais tarde, por favor.\n\n${err.response.data.message}`,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onRefreshTripsList = useCallback(async () => {
    setRefreshing(true);
    fetchTripsFromApi();
    setRefreshing(false);
  }, [fetchTripsFromApi]);

  const handleNavigateToCreateTrip = useCallback(async () => {
    // navigation.navigate('CreateTrip');
  }, [navigation]);

  useEffect(() => {
    const inSameMonthTrips = trips.filter(
      trip =>
        trip.status === 1 &&
        isSameMonth(new Date(), parseISO(trip.departure_date)),
    );
    const futureTrips = trips.filter(
      trip =>
        trip.status === 1 &&
        isAfter(parseISO(trip.departure_date), endOfMonth(new Date())),
    );
    const finishedTrips = trips.filter(trip => trip.status === 2);
    const canceledTrips = trips.filter(trip => trip.status === 3);

    const parsedSections: Section[] = [];

    if (inSameMonthTrips.length > 0) {
      parsedSections.push({ title: 'No mês', data: inSameMonthTrips });
    }

    if (futureTrips.length > 0) {
      parsedSections.push({ title: 'Futuras', data: futureTrips });
    }

    if (finishedTrips.length > 0) {
      parsedSections.push({ title: 'Finalizadas', data: finishedTrips });
    }

    if (canceledTrips.length > 0) {
      parsedSections.push({ title: 'Canceladas', data: canceledTrips });
    }

    setSections(parsedSections);
  }, [trips]);

  useEffect(() => {
    fetchTripsFromApi();
  }, [fetchTripsFromApi]);

  const refreshIndicator = useMemo(() => {
    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefreshTripsList}
        progressBackgroundColor="#2b2831"
        colors={['#6f7bae', '#ff8c42']}
        tintColor="#6f7bae"
      />
    );
  }, [refreshing, onRefreshTripsList]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container>
        <TripsListContainer>
          <TripsList
            sections={sections}
            showsVerticalScrollIndicator
            refreshControl={refreshIndicator}
            renderSectionHeader={({ section: { title } }) => (
              <Label marginTop={24}>{title}</Label>
            )}
            ListFooterComponent={() => (
              <View style={{ height: parseHeightPercentage(24) }} />
            )}
            ItemSeparatorComponent={() => (
              <View style={{ height: parseHeightPercentage(8) }} />
            )}
            ListEmptyComponent={() => (
              <EmptyTripsListContainer>
                <Feather
                  name="map"
                  size={parseWidthPercentage(104)}
                  color="#606060"
                />
                <EmptyTripsListText>
                  Você não cadastrou nenhuma viagem ainda!
                </EmptyTripsListText>
              </EmptyTripsListContainer>
            )}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({ item: trip }) => <TripListItem trip={trip} />}
          />
        </TripsListContainer>
      </Container>

      <FloatingButton iconName="plus" onPress={handleNavigateToCreateTrip} />
    </>
  );
};

export default MyTrips;
