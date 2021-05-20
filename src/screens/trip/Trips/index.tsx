import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import Feather from 'react-native-vector-icons/Feather';

import api from '@services/api';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

import ITrip from '@models/Trip';

import LoadingScreen from '@components/atoms/LoadingScreen';
import TripListItem from '@components/organisms/TripListItem';
import EndOfListLabel from '@components/atoms/EndOfListLabel';

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

const Trips: React.FC = () => {
  const [trips, setTrips] = useState<ITripExtended[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [page, setPage] = useState(1);
  const [endOfList, setEndOfList] = useState(false);
  const [refreshButtonVisible, setRefreshButtonVisible] = useState(false);

  const fetchNextPageTripsFromApi = useCallback(async () => {
    if (!endOfList && !loadingTrips) {
      setPage(state => state + 1);
    }
  }, [endOfList, loadingTrips]);

  const handleRefreshTripsList = useCallback(async () => {
    setPage(1);
    setEndOfList(false);
    setRefreshButtonVisible(false);
  }, []);

  useEffect(() => {
    async function loadTrips() {
      setLoading(page === 1);
      setRefreshing(page === 1);
      setLoadingTrips(page > 1);

      try {
        const response = await api.get('/trips', {
          params: { page },
        });

        const serializedTrips = response.data.map((trip: ITripExtended) => ({
          ...trip,
          formatted_created_at: format(parseISO(trip.created_at), 'dd/MM/yyyy'),
          formatted_departure_date: format(
            parseISO(trip.departure_date),
            'dd/MM/yyyy',
          ),
          formatted_return_date: format(
            parseISO(trip.return_date),
            'dd/MM/yyyy',
          ),
        }));

        if (serializedTrips) {
          setTrips(state =>
            page === 1 ? serializedTrips : [...state, ...serializedTrips],
          );

          if (serializedTrips.length === 0) {
            setEndOfList(true);
            setRefreshButtonVisible(true);
          }
        }
      } catch (err) {
        Alert.alert(
          'Erro',
          `Ocorreu um erro ao tentar recuperar as viagens. Tente novamente mais tarde, por favor.\n\n${err.response.data.message}`,
        );
      } finally {
        setLoadingTrips(false);
        setRefreshing(false);
        setLoading(false);
      }
    }

    loadTrips();
  }, [page]);

  const refreshIndicator = useMemo(() => {
    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefreshTripsList}
        progressBackgroundColor="#2b2831"
        colors={['#6f7bae', '#ff8c42']}
        tintColor="#6f7bae"
      />
    );
  }, [refreshing, handleRefreshTripsList]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container>
      <TripsListContainer>
        <TripsList
          showsVerticalScrollIndicator
          refreshControl={refreshIndicator}
          ListFooterComponent={() => {
            if (loadingTrips) {
              return (
                <View
                  style={{
                    marginTop: parseHeightPercentage(8),
                    marginBottom: parseHeightPercentage(24),
                  }}
                >
                  <ActivityIndicator size="small" color="#6f7bae" />
                </View>
              );
            }

            if (trips.length > 0 && refreshButtonVisible) {
              return <EndOfListLabel onPress={handleRefreshTripsList} />;
            }

            return <View style={{ height: parseHeightPercentage(24) }} />;
          }}
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
                Não há nenhuma viagem aqui ainda!
              </EmptyTripsListText>
            </EmptyTripsListContainer>
          )}
          onEndReached={fetchNextPageTripsFromApi}
          onEndReachedThreshold={0.1}
          data={trips}
          keyExtractor={trip => trip.id}
          renderItem={({ item: trip }) => <TripListItem trip={trip} />}
        />
      </TripsListContainer>
    </Container>
  );
};

export default Trips;
