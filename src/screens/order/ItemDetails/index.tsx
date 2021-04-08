import React, { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

import api from '@services/api';

import { parseWidthPercentage } from '@utils/screenPercentage';

import TitleBar from '@components/TitleBar';
import TitledBox from '@components/TitledBox';
import LoadingScreen from '@components/LoadingScreen';

import noItemImg from '@assets/no-item-image.png';

import {
  Container,
  ItemImage,
  ItemInfoWrappersContainer,
  ItemInfoWrapper,
  ItemInfoLabel,
  ItemInfoValueContainer,
  ItemInfoValueIcon,
  ItemInfoValueText,
  ItemInfoDataType,
  HorizontalLine,
  ItemInfoCategoryIcon,
} from './styles';

interface RouteParams {
  id: string;
}

interface Item {
  id: string;
  name: string;
  quantity: number;
  width: number;
  weight: number;
  height: number;
  depth: number;
  packing: string;
  description: string;
  category: {
    name: string;
    icon: string;
  };
  weight_unit_measure: {
    initials: string;
  };
  dimension_unit_measure: {
    initials: string;
    description: string;
  };
  image_url: string;
}

const ItemDetails: React.FC = () => {
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const [item, setItem] = useState<Item>({} as Item);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api
      .get(`/items/${routeParams.id}`)
      .then(response => {
        setItem(response.data);
      })
      .catch(err => {
        Alert.alert(
          'Erro',
          'Ocorreu um erro ao tentar carregar esse item. Tente novamente mais tarde, por favor.',
        );

        console.log(String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [routeParams]);

  const formattedWeight = useMemo(() => {
    return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 }).format(
      item.weight,
    );
  }, [item.weight]);

  const formattedWidth = useMemo(() => {
    return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(
      item.width,
    );
  }, [item.width]);

  const formattedHeight = useMemo(() => {
    return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(
      item.height,
    );
  }, [item.height]);

  const formattedDepth = useMemo(() => {
    return Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(
      item.depth,
    );
  }, [item.depth]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <TitleBar title="Detalhes do Item" />

      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
        <Container>
          <ItemImage
            style={{ resizeMode: 'contain' }}
            defaultSource={noItemImg}
            source={item.image_url ? { uri: item.image_url } : noItemImg}
          />

          <TitledBox title="Informações do Produto">
            <ItemInfoWrapper>
              <ItemInfoLabel>Nome do Produto</ItemInfoLabel>
              <ItemInfoValueContainer>
                <ItemInfoValueIcon
                  name="package"
                  size={parseWidthPercentage(24)}
                  color="#606060"
                />

                <ItemInfoValueText textBreakStrategy="balanced">
                  {item.name}
                </ItemInfoValueText>
              </ItemInfoValueContainer>
            </ItemInfoWrapper>

            <ItemInfoWrapper>
              <ItemInfoLabel>Descrição do produto</ItemInfoLabel>
              <ItemInfoValueContainer>
                <ItemInfoValueIcon
                  name="file-text"
                  size={parseWidthPercentage(24)}
                  color="#606060"
                />

                <ItemInfoValueText textBreakStrategy="balanced">
                  {item.description}
                </ItemInfoValueText>
              </ItemInfoValueContainer>
            </ItemInfoWrapper>

            <ItemInfoWrappersContainer>
              <ItemInfoWrapper width={92} marginRight={8}>
                <ItemInfoLabel>Quantidade</ItemInfoLabel>
                <ItemInfoValueContainer>
                  <ItemInfoValueText
                    textBreakStrategy="balanced"
                    textAlign="center"
                  >
                    {item.quantity}
                  </ItemInfoValueText>
                </ItemInfoValueContainer>
              </ItemInfoWrapper>

              <ItemInfoWrapper flex={1}>
                <ItemInfoLabel>Peso unitário estimado</ItemInfoLabel>
                <ItemInfoValueContainer>
                  <ItemInfoDataType>
                    {item.weight_unit_measure.initials}
                  </ItemInfoDataType>

                  <ItemInfoValueText
                    textBreakStrategy="balanced"
                    textAlign="right"
                  >
                    {formattedWeight}
                  </ItemInfoValueText>
                </ItemInfoValueContainer>
              </ItemInfoWrapper>
            </ItemInfoWrappersContainer>

            <HorizontalLine />

            <ItemInfoWrapper>
              <ItemInfoLabel>Unidade de Medida</ItemInfoLabel>
              <ItemInfoValueContainer>
                <ItemInfoValueIcon
                  name="move"
                  size={parseWidthPercentage(24)}
                  color="#606060"
                />

                <ItemInfoValueText textBreakStrategy="balanced">
                  {`${item.dimension_unit_measure.description} (${item.dimension_unit_measure.initials})`}
                </ItemInfoValueText>
              </ItemInfoValueContainer>
            </ItemInfoWrapper>

            <ItemInfoWrappersContainer>
              <ItemInfoWrapper width={88} marginRight={8}>
                <ItemInfoLabel>Largura</ItemInfoLabel>
                <ItemInfoValueContainer>
                  <ItemInfoValueText
                    textBreakStrategy="balanced"
                    textAlign="right"
                  >
                    {formattedWidth}
                  </ItemInfoValueText>
                </ItemInfoValueContainer>
              </ItemInfoWrapper>

              <ItemInfoWrapper width={88} marginRight={8}>
                <ItemInfoLabel>Altura</ItemInfoLabel>
                <ItemInfoValueContainer>
                  <ItemInfoValueText
                    textBreakStrategy="balanced"
                    textAlign="right"
                  >
                    {formattedHeight}
                  </ItemInfoValueText>
                </ItemInfoValueContainer>
              </ItemInfoWrapper>

              <ItemInfoWrapper flex={1}>
                <ItemInfoLabel>Profundidade</ItemInfoLabel>
                <ItemInfoValueContainer>
                  <ItemInfoValueText
                    textBreakStrategy="balanced"
                    textAlign="right"
                  >
                    {formattedDepth}
                  </ItemInfoValueText>
                </ItemInfoValueContainer>
              </ItemInfoWrapper>
            </ItemInfoWrappersContainer>

            <HorizontalLine />

            <ItemInfoWrapper>
              <ItemInfoLabel>Embalagem</ItemInfoLabel>
              <ItemInfoValueContainer>
                <ItemInfoValueIcon
                  name="package"
                  size={parseWidthPercentage(24)}
                  color="#606060"
                />

                <ItemInfoValueText textBreakStrategy="balanced">
                  {item.packing}
                </ItemInfoValueText>
              </ItemInfoValueContainer>
            </ItemInfoWrapper>

            <ItemInfoWrapper>
              <ItemInfoLabel>Categoria</ItemInfoLabel>
              <ItemInfoValueContainer>
                <ItemInfoCategoryIcon
                  name={item.category.icon}
                  size={parseWidthPercentage(24)}
                  color="#ebebeb"
                />

                <ItemInfoValueText textBreakStrategy="balanced">
                  {item.category.name}
                </ItemInfoValueText>
              </ItemInfoValueContainer>
            </ItemInfoWrapper>
          </TitledBox>
        </Container>
      </ScrollView>
    </>
  );
};

export default ItemDetails;
