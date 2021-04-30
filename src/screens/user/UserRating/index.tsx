import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import api from '@services/api';

import IUserRate from '@models/UserRate';

import { parseHeightPercentage } from '@utils/screenPercentage';

import LoadingScreen from '@components/atoms/LoadingScreen';
import TitleBar from '@components/atoms/TitleBar';
import Label from '@components/atoms/Label';
import AvaluationCard from '@components/atoms/AvaluationCard';

import { Container, RatingList, RatingListContainer } from './styles';

interface RouteParams {
  deliveryman_id: string;
}

const UserRating: React.FC = () => {
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const [rating, setRating] = useState<IUserRate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadRating() {
      setLoading(true);

      try {
        const response = await api.get(
          `/rating/deliveryman/${routeParams.deliveryman_id}`,
        );

        setRating(response.data);
      } catch (err) {
        Alert.alert(
          'Erro',
          `Ocorreu um erro ao tentar recuperar as avaliações do usuário. Tente novamente mais tarde, por favor.\n\n${err.response.data.message}`,
        );
      } finally {
        setLoading(false);
      }
    }

    loadRating();
  }, [routeParams.deliveryman_id]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <TitleBar title="Avaliações" />
      <Container>
        <RatingListContainer>
          <RatingList
            showsVerticalScrollIndicator
            ListHeaderComponent={() => (
              <Label marginTop={24}>
                {`${rating.length} ${
                  rating.length === 1 ? 'avaliação' : 'avaliações'
                }`}
              </Label>
            )}
            ListFooterComponent={() => (
              <View style={{ height: parseHeightPercentage(24) }} />
            )}
            ItemSeparatorComponent={() => (
              <View style={{ height: parseHeightPercentage(8) }} />
            )}
            data={rating}
            keyExtractor={rate => rate.id}
            renderItem={({ item: rate }) => (
              <AvaluationCard
                key={rate.id}
                getUserInfoFrom="requester"
                rate={rate}
              />
            )}
          />
        </RatingListContainer>
      </Container>
    </>
  );
};

export default UserRating;
