import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

import api from '@services/api';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';
import formatCurrencyValue from '@utils/formatCurrencyValue';

import IRequestPickupOffer from '@models/RequestPickupOffer';

import LoadingScreen from '@components/atoms/LoadingScreen';
import TitleBar from '@components/atoms/TitleBar';
import FilledButton from '@components/atoms/FilledButton';
import AvatarImage from '@components/atoms/AvatarImage';

import { Rating } from 'react-native-elements';
import {
  Container,
  ListHeaderText,
  PickupOffersList,
  PickupOfferContainer,
  PickupOfferClickable,
  PickupOfferMeta,
  PickupOfferTextWrapper,
  PickupOfferUserFullName,
  PickupOfferUserUsername,
  PickupOfferInfo,
  PickupOfferValue,
  PickupOfferSelectButton,
  PickupOfferSelectButtonSelected,
  PickupOfferUserAvaluationStars,
  EmptyPickupOffersListContainer,
  EmptyPickupOffersListText,
} from './styles';

interface RouteParams {
  order_id: string;
}

const SelectDeliveryman: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const [pickupOffers, setPickupOffers] = useState<IRequestPickupOffer[]>([]);
  const [selectedDeliveryman, setSelectedDeliveryman] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const fetchPickupOffersFromTheApi = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get(
        `/orders/pickup-offers/${routeParams.order_id}`,
      );

      setPickupOffers(response.data);
    } catch (err) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao tentar recuperar as ofertas de entrega. Tente novamente mais tarde, por favor.',
      );

      console.log(String(err));
    } finally {
      setLoading(false);
    }
  }, [routeParams.order_id]);

  const handleRefreshPickupOffersList = useCallback(() => {
    setRefreshing(true);
    fetchPickupOffersFromTheApi();
    setRefreshing(false);
  }, [fetchPickupOffersFromTheApi]);

  const handleChooseDeliveryman = useCallback(async () => {
    if (!selectedDeliveryman) {
      Alert.alert('Aviso!', 'Você deve selecionar um entregador.');

      return;
    }

    setIsSubmiting(true);

    try {
      await api.patch(`/orders/deliveryman/${routeParams.order_id}`, {
        deliveryman_id: selectedDeliveryman,
      });

      setIsSubmiting(false);

      Alert.alert(
        'Oba!',
        'Seu entregador já foi notificado. Agora, é só aguardar por mais informações!\n\nUma sala de bate-papo entre você e seu entregador foi criada para que possam se comunicar melhor.',
      );

      navigation.navigate('OrderDetails', { id: routeParams.order_id });
    } catch (err) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao tentar salvar o entregador. Tente novamente mais tarde, por favor.',
      );

      console.log(String(err));

      setIsSubmiting(false);
    }
  }, [navigation, routeParams.order_id, selectedDeliveryman]);

  useEffect(() => {
    fetchPickupOffersFromTheApi();
  }, [fetchPickupOffersFromTheApi]);

  const refreshIndicator = useMemo(() => {
    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefreshPickupOffersList}
        progressBackgroundColor="#2b2831"
        colors={['#6f7bae', '#ff8c42']}
        tintColor="#6f7bae"
      />
    );
  }, [refreshing, handleRefreshPickupOffersList]);

  const pickupOffersListHeaderComponent = useMemo(() => {
    if (pickupOffers.length) {
      return (
        <ListHeaderText>{`Se ofereceram para entregar (${pickupOffers.length})`}</ListHeaderText>
      );
    }

    return <View style={{ height: parseHeightPercentage(24) }} />;
  }, [pickupOffers.length]);

  const pickupOffersListFooterComponent = useMemo(() => {
    if (pickupOffers.length && selectedDeliveryman) {
      return (
        <FilledButton
          showLoadingIndicator={isSubmiting}
          marginTop={24}
          onPress={handleChooseDeliveryman}
        >
          Escolher
        </FilledButton>
      );
    }

    return <View style={{ height: parseHeightPercentage(24) }} />;
  }, [pickupOffers, selectedDeliveryman, isSubmiting, handleChooseDeliveryman]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <TitleBar title="Selecionar Entregador" />

      <Container>
        <PickupOffersList
          showsVerticalScrollIndicator
          refreshControl={refreshIndicator}
          ListHeaderComponent={pickupOffersListHeaderComponent}
          ListFooterComponent={pickupOffersListFooterComponent}
          ItemSeparatorComponent={() => (
            <View style={{ height: parseHeightPercentage(8) }} />
          )}
          ListEmptyComponent={() => (
            <EmptyPickupOffersListContainer>
              <Feather
                name="truck"
                size={parseWidthPercentage(104)}
                color="#606060"
              />
              <EmptyPickupOffersListText>
                Ninguém se ofereceu para fazer a entrega ainda.
              </EmptyPickupOffersListText>
            </EmptyPickupOffersListContainer>
          )}
          data={pickupOffers}
          keyExtractor={pickupOffer => pickupOffer.id}
          renderItem={({ item: pickupOffer }) => (
            <PickupOfferContainer
              isSelected={selectedDeliveryman === pickupOffer.deliveryman.id}
            >
              <PickupOfferClickable
                rippleColor="#ebebeb10"
                onPress={() => {
                  setSelectedDeliveryman(pickupOffer.deliveryman.id);
                }}
              >
                <AvatarImage user={pickupOffer.deliveryman} />

                <PickupOfferMeta>
                  <PickupOfferTextWrapper>
                    <PickupOfferUserFullName
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {pickupOffer.deliveryman.name}
                    </PickupOfferUserFullName>
                    <PickupOfferUserUsername
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {`@${pickupOffer.deliveryman.username}`}
                    </PickupOfferUserUsername>
                  </PickupOfferTextWrapper>

                  <PickupOfferInfo>
                    <PickupOfferTextWrapper>
                      <Feather
                        name="truck"
                        size={parseWidthPercentage(12)}
                        color="#ff8c42"
                      />
                      <PickupOfferValue>
                        {formatCurrencyValue(pickupOffer.delivery_value)}
                      </PickupOfferValue>
                    </PickupOfferTextWrapper>

                    <PickupOfferUserAvaluationStars>
                      <Rating
                        readonly
                        type="custom"
                        startingValue={3.5}
                        ratingBackgroundColor="#606060"
                        ratingColor="#feca57"
                        tintColor="#312e38"
                        imageSize={parseWidthPercentage(16)}
                      />
                    </PickupOfferUserAvaluationStars>
                  </PickupOfferInfo>
                </PickupOfferMeta>

                <PickupOfferSelectButton
                  isSelected={
                    selectedDeliveryman === pickupOffer.deliveryman.id
                  }
                >
                  {selectedDeliveryman === pickupOffer.deliveryman.id && (
                    <PickupOfferSelectButtonSelected />
                  )}
                </PickupOfferSelectButton>
              </PickupOfferClickable>
            </PickupOfferContainer>
          )}
        />
      </Container>
    </>
  );
};

export default SelectDeliveryman;
