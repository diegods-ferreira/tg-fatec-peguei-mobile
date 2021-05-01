import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import Feather from 'react-native-vector-icons/Feather';

import api from '@services/api';

import { useAuth } from '@hooks/auth';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';

import ITrip from '@models/Trip';

import LoadingScreen from '@components/atoms/LoadingScreen';
import TitleBar from '@components/atoms/TitleBar';
import AvatarImage from '@components/atoms/AvatarImage';
import TitledBox from '@components/atoms/TitledBox';
import FilledButton from '@components/atoms/FilledButton';
import OutlinedButton from '@components/atoms/OutlinedButton';

import { differenceInDays, format, parseISO } from 'date-fns';
import {
  Container,
  TravellerContainer,
  TravellerFullName,
  TravellerUsername,
  TripInfoContainer,
  TripInfoWrapper,
  TripInfoText,
  StatusIndicatorContainer,
  StatusIndicatorText,
  ContextMenuModal,
  ContextMenuOption,
  ContextMenuOptionText,
  ContextMenuOptionSubmiting,
} from './styles';

export interface ITripExtended extends ITrip {
  formatted_departure_date: string;
  formatted_return_date: string;
  days_count: number;
}

interface RouteParams {
  id: string;
}

const TripDetails: React.FC = () => {
  const tripOptionsModalRef = useRef<Modalize>(null);

  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const { user: authUser } = useAuth();

  const [trip, setTrip] = useState<ITripExtended>({} as ITripExtended);
  const [loading, setLoading] = useState(true);
  const [isSubmiting, setIsSubmiting] = useState<
    'FinishTrip' | 'CancelTrip' | null
  >(null);

  const handleSetTripAsFinished = useCallback(() => {
    Alert.alert(
      'Tem certeza?',
      'Só marque uma viagem como finalizada se ela realmente estiver finalizada e nenhum pedido esteja pendente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {},
        {
          text: 'Finalizar',
          onPress: async () => {
            setIsSubmiting('FinishTrip');

            try {
              const tripToSave = {
                destination_city: trip.destination_city,
                destination_state: trip.destination_state,
                departure_date: trip.departure_date,
                return_city: trip.return_city,
                return_state: trip.return_state,
                return_date: trip.return_date,
                status: 2,
              };

              await api.put(`/trips/${trip.id}`, tripToSave);

              setIsSubmiting(null);

              Alert.alert(
                'Finalizada!',
                'A viagem foi finalizada com sucesso.',
              );

              navigation.goBack();
            } catch (err) {
              Alert.alert(
                'Ops...',
                `Ocorreu um erro ao tentar finalizar essa viagem, tente novamente mais tarde.\n\n${err.response.data.message}`,
              );
              setIsSubmiting(null);
            }
          },
        },
      ],
    );
  }, [navigation, trip]);

  const handleSetTripAsCanceled = useCallback(() => {
    Alert.alert(
      'Tem certeza?',
      'Uma vez cancelada a viagem, não será possível recuperá-la.',
      [
        { text: 'Voltar', style: 'cancel' },
        {},
        {
          text: 'Cancelar',
          style: 'destructive',
          onPress: async () => {
            setIsSubmiting('CancelTrip');

            try {
              const tripToSave = {
                destination_city: trip.destination_city,
                destination_state: trip.destination_state,
                departure_date: trip.departure_date,
                return_city: trip.return_city,
                return_state: trip.return_state,
                return_date: trip.return_date,
                status: 3,
              };

              await api.put(`/trips/${trip.id}`, tripToSave);

              setIsSubmiting(null);

              Alert.alert('Cancelada!', 'A viagem foi cancelada com sucesso.');

              navigation.goBack();
            } catch (err) {
              Alert.alert(
                'Ops...',
                `Ocorreu um erro ao tentar finalizar essa viagem, tente novamente mais tarde.\n\n${err.response.data.message}`,
              );
              setIsSubmiting(null);
            }
          },
        },
      ],
    );
  }, [navigation, trip]);

  useEffect(() => {
    async function loadTrip() {
      setLoading(true);

      try {
        const response = await api.get(`/trips/${routeParams.id}`);

        if (response.data) {
          setTrip({
            ...response.data,
            formatted_departure_date: format(
              parseISO(response.data.departure_date),
              'dd/MM/yyyy',
            ),
            formatted_return_date: format(
              parseISO(response.data.return_date),
              'dd/MM/yyyy',
            ),
            days_count: differenceInDays(
              parseISO(response.data.return_date),
              parseISO(response.data.departure_date),
            ),
          });
        }
      } catch (err) {
        Alert.alert(
          'Erro',
          `Ocorreu um erro ao tentar consultar essa viagem. Tente novamente mais tarde, por favor.\n\n${err.response.data.message}`,
        );
      } finally {
        setLoading(false);
      }
    }

    loadTrip();
  }, [routeParams.id]);

  const countOfOrdersMadeByAuthUser = useMemo(() => {
    if (trip.user?.id !== authUser.id || !trip.orders?.length) {
      return 0;
    }

    return trip.orders.filter(order => order.requester_id === authUser.id)
      .length;
  }, [trip, authUser.id]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <TitleBar
        title="Detalhes da Viagem"
        showContextMenuButton={
          authUser.id === trip.user.id && trip.status === 1
        }
        onContextMenuButtonPress={() => tripOptionsModalRef.current?.open()}
      />

      {trip.status === 1 && !!countOfOrdersMadeByAuthUser && (
        <StatusIndicatorContainer backgroundColor="#ff8c42">
          <StatusIndicatorText>
            {countOfOrdersMadeByAuthUser === 1
              ? 'Você fez um pedido para essa viagem'
              : `Você fez ${countOfOrdersMadeByAuthUser} pedidos para essa viagem`}
          </StatusIndicatorText>
        </StatusIndicatorContainer>
      )}

      {trip.status === 2 && (
        <StatusIndicatorContainer backgroundColor="#3498db">
          <StatusIndicatorText>Viagem finalizada!</StatusIndicatorText>
        </StatusIndicatorContainer>
      )}

      {trip.status === 3 && (
        <StatusIndicatorContainer backgroundColor="#EB4D4B">
          <StatusIndicatorText>Viagem cancelada</StatusIndicatorText>
        </StatusIndicatorContainer>
      )}

      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
        <Container>
          <TravellerContainer>
            <AvatarImage user={trip.user} size={120} navigateToProfileOnPress />
            <TravellerFullName>{trip.user.name}</TravellerFullName>
            <TravellerUsername>{`@${trip.user.username}`}</TravellerUsername>
          </TravellerContainer>

          <TripInfoContainer>
            <TitledBox title="Partida">
              <TripInfoWrapper>
                <Feather
                  name="map-pin"
                  size={parseWidthPercentage(24)}
                  color="#6f7bae"
                />
                <TripInfoText>{`de ${trip.return_city}, ${trip.return_state}`}</TripInfoText>
              </TripInfoWrapper>

              <TripInfoWrapper>
                <Feather
                  name="calendar"
                  size={parseWidthPercentage(24)}
                  color="#6f7bae"
                />
                <TripInfoText>
                  {`em ${trip.formatted_departure_date}\nretorno em ${trip.formatted_return_date}`}
                </TripInfoText>
              </TripInfoWrapper>
            </TitledBox>

            <TitledBox title="Destino">
              <TripInfoWrapper>
                <Feather
                  name="navigation"
                  size={parseWidthPercentage(24)}
                  color="#ff8c42"
                />
                <TripInfoText>{`para ${trip.destination_city}, ${trip.destination_state}`}</TripInfoText>
              </TripInfoWrapper>

              <TripInfoWrapper>
                <Feather
                  name="calendar"
                  size={parseWidthPercentage(24)}
                  color="#ff8c42"
                />
                <TripInfoText>
                  {trip.days_count === 1
                    ? 'por um dia'
                    : `por ${trip.days_count} dias`}
                </TripInfoText>
              </TripInfoWrapper>
            </TitledBox>

            {authUser.id !== trip.user.id && trip.status === 1 && (
              <FilledButton onPress={() => {}}>Fazer pedido</FilledButton>
            )}

            {authUser.id === trip.user.id && trip.status === 1 && (
              <OutlinedButton
                color="#6f7bae"
                marginTop={8}
                onPress={() => tripOptionsModalRef.current?.open()}
              >
                Opções da viagem
              </OutlinedButton>
            )}
          </TripInfoContainer>
        </Container>
      </ScrollView>

      {authUser.id === trip.user.id && trip.status === 1 && (
        <Modalize
          ref={tripOptionsModalRef}
          adjustToContentHeight
          overlayStyle={{ backgroundColor: '#00000090' }}
        >
          <ContextMenuModal>
            <ContextMenuOption rippleColor="#ebebeb10" onPress={() => {}}>
              <Feather
                name="truck"
                color="#ebebeb"
                size={parseHeightPercentage(24)}
              />
              <ContextMenuOptionText color="#ebebeb">
                Ver pedidos pendentes
              </ContextMenuOptionText>
            </ContextMenuOption>

            <ContextMenuOption
              rippleColor="#ebebeb10"
              onPress={handleSetTripAsFinished}
            >
              {isSubmiting === 'FinishTrip' ? (
                <ContextMenuOptionSubmiting>
                  <ActivityIndicator size="small" color="#3498db" />
                </ContextMenuOptionSubmiting>
              ) : (
                <>
                  <Feather
                    name="check-square"
                    color="#3498db"
                    size={parseHeightPercentage(24)}
                  />
                  <ContextMenuOptionText color="#3498db">
                    Finalizar viagem
                  </ContextMenuOptionText>
                </>
              )}
            </ContextMenuOption>

            <ContextMenuOption
              rippleColor="#ebebeb10"
              onPress={handleSetTripAsCanceled}
            >
              {isSubmiting === 'CancelTrip' ? (
                <ContextMenuOptionSubmiting>
                  <ActivityIndicator size="small" color="#EB4D4B" />
                </ContextMenuOptionSubmiting>
              ) : (
                <>
                  <Feather
                    name="check-square"
                    color="#EB4D4B"
                    size={parseHeightPercentage(24)}
                  />
                  <ContextMenuOptionText color="#EB4D4B">
                    Cancelar viagem
                  </ContextMenuOptionText>
                </>
              )}
            </ContextMenuOption>
          </ContextMenuModal>
        </Modalize>
      )}
    </>
  );
};

export default TripDetails;
