import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import ImagePicker from 'react-native-image-picker';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-community/async-storage';
import Feather from 'react-native-vector-icons/Feather';

import api from '@services/api';

import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '@utils/screenPercentage';
import getValidationErrors from '@utils/getValidationErrors';

import IOrderItemUnitMeasure from '@models/OrderItemUnitMeasure';
import IOrderItemCategory from '@models/OrderItemCategory';

import LoadingScreen from '@components/atoms/LoadingScreen';
import { OrderItemToSave } from '@screens/order/CreateOrder';

import TitleBar from '@components/atoms/TitleBar';
import TitledBox from '@components/atoms/TitledBox';
import InputGroup from '@components/molecules/InputGroup';
import PickerSelectGroup from '@components/molecules/PickerSelectGroup';
import FilledButton from '@components/atoms/FilledButton';

import noItemImg from '@assets/no-item-image.png';

import { Alert } from 'react-native';
import {
  Container,
  ItemImageWrapper,
  ItemImagePicker,
  ItemImage,
  PickItemImageIndicator,
  PickItemImageIndicatorText,
  ItemInfoWrappersContainer,
  ItemInfoWrapper,
  ItemInfoLabel,
  ItemInfoValueContainer,
  TextInput,
  ItemAlterQuantityButton,
  StyledPickerSelect,
} from './styles';

interface AddItemToOrderFormData {
  name: string;
  description: string;
  width: string;
  height: string;
  depth: string;
  packing: string;
}

interface RouteParams {
  item_id: number;
}

const AddItemToOrder: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as RouteParams;

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<OrderItemToSave>({} as OrderItemToSave);
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState(0);
  const [weightInputFocused, setWeightInputFocused] = useState(false);

  const [weightUnitsMeasure, setWeightUnitsMeasure] = useState<
    IOrderItemUnitMeasure[]
  >([]);

  const [dimensionUnitsMeasure, setDimensionUnitsMeasure] = useState<
    IOrderItemUnitMeasure[]
  >([]);

  const [categories, setCategories] = useState<IOrderItemCategory[]>([]);

  const [selectedWeightUnitMeasure, setSelectedWeightUnitMeasure] = useState(
    -1,
  );

  const [
    selectedDimensionUnitMeasure,
    setSelectedDimensionUnitMeasure,
  ] = useState(-1);

  const [selectedCategory, setSelectedCategory] = useState(-1);

  const [selectedItemImageUri, setSelectedItemImageUri] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const weightUnitsResponse = await api.get('/units_measure/type/2');
      setWeightUnitsMeasure(weightUnitsResponse.data);

      const dimensionUnitsResponse = await api.get('/units_measure/type/1');
      setDimensionUnitsMeasure(dimensionUnitsResponse.data);

      const categoriesResponse = await api.get('/categories');
      setCategories(categoriesResponse.data);

      if (routeParams && routeParams.item_id) {
        const storagedItem = await AsyncStorage.getItem(
          `@Peguei!:create-order-item-${routeParams.item_id}`,
        );

        if (!storagedItem) {
          Alert.alert('Ops...', 'Não encontramos esse item.');
          navigation.goBack();
          return;
        }

        const parsedItem = JSON.parse(storagedItem) as OrderItemToSave;

        setItem(parsedItem);

        setQuantity(parsedItem.quantity ? parsedItem.quantity : 1);

        setWeight(parsedItem.weight ? Number(parsedItem.weight) : 0);

        setSelectedWeightUnitMeasure(
          parsedItem.weight_unit_id ? parsedItem.weight_unit_id : -1,
        );

        setSelectedDimensionUnitMeasure(
          parsedItem.dimension_unit_id ? parsedItem.dimension_unit_id : -1,
        );

        setSelectedCategory(
          parsedItem.category_id ? parsedItem.category_id : -1,
        );

        setSelectedItemImageUri(
          parsedItem.image_uri ? parsedItem.image_uri : '',
        );
      }

      setLoading(false);
    }
    loadData();
  }, [routeParams, navigation]);

  const handleDecreaseItemQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }, [quantity]);

  const handleIncreaseItemQuantity = useCallback(() => {
    setQuantity(quantity + 1);
  }, [quantity]);

  const handleWeightInputFocus = useCallback(() => {
    setWeightInputFocused(true);
  }, []);

  const handleWeightInputBlur = useCallback(() => {
    setWeightInputFocused(false);
  }, []);

  const handleSelectWeightUnitMeasure = useCallback(
    (value: React.ReactText) => {
      setSelectedWeightUnitMeasure(Number(value));
    },
    [],
  );

  const handleSelectDimensionUnitMeasure = useCallback(
    (value: React.ReactText) => {
      setSelectedDimensionUnitMeasure(Number(value));
    },
    [],
  );

  const handleSelectCategory = useCallback((value: React.ReactText) => {
    setSelectedCategory(Number(value));
  }, []);

  const handleSelectItemImage = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione uma imagem',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar câmera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert(
            'Erro ao selecionar a imagem. Tente novamente, por favor.',
          );

          setSelectedItemImageUri('');
          return;
        }

        setSelectedItemImageUri(response.uri);
      },
    );
  }, []);

  const handleChangeWeightInput = useCallback((value: string) => {
    setWeight(Number(value.replace(',', '.')));
  }, []);

  const handleSaveOrdemItem = useCallback(
    async (data: AddItemToOrderFormData) => {
      try {
        formRef.current?.setErrors({});

        const parsedData = {
          ...data,
          quantity,
          weight,
          width: data.width ? Number(data.width.replace(',', '.')) : 0,
          height: data.height ? Number(data.height.replace(',', '.')) : 0,
          depth: data.depth ? Number(data.depth.replace(',', '.')) : 0,
        };

        const schema = Yup.object().shape({
          name: Yup.string()
            .required('Nome é obrigatório')
            .min(4, 'Mínimo de 4 caracteres'),
          description: Yup.string()
            .required('Descrição é obrigatória')
            .min(10, 'Mínimo de 10 caracteres'),
          quantity: Yup.number()
            .required('Quantidade é obrigatória')
            .min(1, 'Mínimo é 1'),
          width: Yup.number()
            .required('Quantidade é obrigatória')
            .moreThan(0, 'Maior que 0'),
          weight: Yup.number()
            .required('Quantidade é obrigatória')
            .moreThan(0, 'Maior que 0'),
          height: Yup.number()
            .required('Quantidade é obrigatória')
            .moreThan(0, 'Maior que 0'),
          depth: Yup.number()
            .required('Quantidade é obrigatória')
            .moreThan(0, 'Maior que 0'),
          packing: Yup.string(),
        });

        await schema.validate(parsedData, {
          abortEarly: false,
        });

        if (selectedWeightUnitMeasure === -1) {
          throw new Error(
            'Você deve selecionar uma unidade de medida para o peso unitário do produto.',
          );
        }

        if (selectedDimensionUnitMeasure === -1) {
          throw new Error(
            'Você deve selecionar uma unidade de medida para as dimensões do produto.',
          );
        }

        if (selectedCategory === -1) {
          throw new Error('Você deve selecionar uma categoria para o produto.');
        }

        const finalItem = {
          ...parsedData,
          ...(item.id ? { id: item.id } : { id: new Date().getTime() }),
          category_id: selectedCategory,
          weight_unit_id: selectedWeightUnitMeasure,
          dimension_unit_id: selectedDimensionUnitMeasure,
          image_uri: selectedItemImageUri,
        };

        await AsyncStorage.setItem(
          `@Peguei!:create-order-item-${finalItem.id}`,
          JSON.stringify(finalItem),
        );

        navigation.navigate('CreateOrder', {
          item_id: finalItem.id,
          updated_at: new Date().getTime(),
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert('Ops...', err.message);
      }
    },
    [
      navigation,
      selectedCategory,
      selectedWeightUnitMeasure,
      selectedDimensionUnitMeasure,
      selectedItemImageUri,
      quantity,
      weight,
      item.id,
    ],
  );

  const serializedItem = useMemo(() => {
    if (item.id) {
      return {
        ...item,
        weight: item.weight ? String(item.weight).replace('.', ',') : 0,
        width: item.width ? String(item.width).replace('.', ',') : 0,
        height: item.height ? String(item.height).replace('.', ',') : 0,
        depth: item.depth ? String(item.depth).replace('.', ',') : 0,
      };
    }

    return {};
  }, [item]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <TitleBar title="Incluir Item" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <Container>
          <ItemImageWrapper>
            <ItemImagePicker
              onPress={handleSelectItemImage}
              rippleColor="#ebebeb10"
            >
              {selectedItemImageUri !== '' ? (
                <ItemImage
                  style={{ resizeMode: 'contain' }}
                  defaultSource={noItemImg}
                  source={{ uri: selectedItemImageUri }}
                />
              ) : (
                <PickItemImageIndicator>
                  <Feather
                    name="image"
                    size={parseHeightPercentage(80)}
                    color="#606060"
                  />
                  <PickItemImageIndicatorText>
                    Anexar uma imagem
                  </PickItemImageIndicatorText>
                </PickItemImageIndicator>
              )}
            </ItemImagePicker>
          </ItemImageWrapper>

          <Form
            ref={formRef}
            initialData={serializedItem}
            onSubmit={handleSaveOrdemItem}
          >
            <TitledBox title="Informações do produto">
              <InputGroup
                label="Nome do produto"
                name="name"
                icon="package"
                placeholder="Digite o nome do produto"
                autoCapitalize="words"
                returnKeyType="done"
              />

              <InputGroup
                label="Descrição do produto"
                name="description"
                icon="file-text"
                placeholder="Descreva o produto"
                multiline
                numberOfLines={5}
                autoCapitalize="sentences"
                returnKeyType="done"
              />

              <ItemInfoWrappersContainer>
                <ItemInfoWrapper width={92} marginRight={8}>
                  <ItemInfoLabel>Quantidade</ItemInfoLabel>
                  <ItemInfoValueContainer paddingHorizontal={8}>
                    <ItemAlterQuantityButton
                      onPress={handleDecreaseItemQuantity}
                      disabled={quantity === 1}
                    >
                      <Feather
                        name="minus"
                        size={parseWidthPercentage(18)}
                        color={quantity > 1 ? '#6f7bae' : '#606060'}
                      />
                    </ItemAlterQuantityButton>

                    <TextInput
                      value={quantity.toString()}
                      editable={false}
                      textAlign="center"
                    />

                    <ItemAlterQuantityButton
                      onPress={handleIncreaseItemQuantity}
                    >
                      <Feather
                        name="plus"
                        size={parseWidthPercentage(18)}
                        color="#6f7bae"
                      />
                    </ItemAlterQuantityButton>
                  </ItemInfoValueContainer>
                </ItemInfoWrapper>

                <ItemInfoWrapper flex={1}>
                  <ItemInfoLabel>Peso unitário estimado</ItemInfoLabel>
                  <ItemInfoValueContainer
                    isFocused={weightInputFocused}
                    paddingLeft={8}
                  >
                    <StyledPickerSelect
                      selectedValue={selectedWeightUnitMeasure}
                      prompt="Selecione uma unidade de medida"
                      onValueChange={handleSelectWeightUnitMeasure}
                    >
                      <StyledPickerSelect.Item
                        key="NaN"
                        label="-"
                        value={-1}
                        color="#ff8c42"
                      />
                      {weightUnitsMeasure.map(weightUnit => (
                        <StyledPickerSelect.Item
                          key={weightUnit.id}
                          label={weightUnit.initials}
                          value={weightUnit.id}
                          color="#2f2f2f"
                        />
                      ))}
                    </StyledPickerSelect>

                    <TextInput
                      placeholder="0,000"
                      placeholderTextColor="#606060"
                      defaultValue={
                        serializedItem.weight
                          ? serializedItem.weight
                          : undefined
                      }
                      textAlign="right"
                      keyboardType="numeric"
                      onChangeText={handleChangeWeightInput}
                      onFocus={handleWeightInputFocus}
                      onBlur={handleWeightInputBlur}
                    />
                  </ItemInfoValueContainer>
                </ItemInfoWrapper>
              </ItemInfoWrappersContainer>
            </TitledBox>

            <TitledBox title="Dimensões do produto">
              <PickerSelectGroup
                label="Unidade de medida"
                prompt="Selecione uma unidade de medida"
                icon="move"
                defaultValue={-1}
                defaultValueLabel="Nenhuma"
                selectedValue={selectedDimensionUnitMeasure}
                onValueChange={handleSelectDimensionUnitMeasure}
              >
                {dimensionUnitsMeasure.map(dimensionUnit => (
                  <StyledPickerSelect.Item
                    key={dimensionUnit.id}
                    label={dimensionUnit.initials}
                    value={dimensionUnit.id}
                    color="#2f2f2f"
                  />
                ))}
              </PickerSelectGroup>

              <ItemInfoWrappersContainer>
                <InputGroup
                  label="Largura"
                  name="width"
                  placeholder="0,0"
                  textAlign="right"
                  keyboardType="numeric"
                  returnKeyType="done"
                  containerStyle={{
                    width: parseWidthPercentage(88),
                    marginRight: parseWidthPercentage(8),
                  }}
                />

                <InputGroup
                  label="Altura"
                  name="height"
                  placeholder="0,0"
                  textAlign="right"
                  keyboardType="numeric"
                  returnKeyType="done"
                  containerStyle={{
                    width: parseWidthPercentage(88),
                    marginRight: parseWidthPercentage(8),
                  }}
                />

                <InputGroup
                  label="Profundidade"
                  name="depth"
                  placeholder="0,0"
                  textAlign="right"
                  keyboardType="numeric"
                  returnKeyType="done"
                  containerStyle={{
                    flex: 1,
                  }}
                />
              </ItemInfoWrappersContainer>
            </TitledBox>

            <TitledBox title="Demais informações">
              <InputGroup
                label="Embalagem"
                name="packing"
                icon="package"
                placeholder="Descreva a embalagem"
                returnKeyType="done"
              />

              <PickerSelectGroup
                label="Categoria"
                prompt="Selecione uma categoria"
                defaultValue={-1}
                defaultValueLabel="Nenhuma"
                selectedValue={selectedCategory}
                onValueChange={handleSelectCategory}
              >
                {categories.map(category => (
                  <StyledPickerSelect.Item
                    key={category.id}
                    label={category.name}
                    value={category.id}
                    color="#2f2f2f"
                  />
                ))}
              </PickerSelectGroup>
            </TitledBox>

            <FilledButton onPress={() => formRef.current?.submitForm()}>
              Salvar
            </FilledButton>
          </Form>
        </Container>
      </ScrollView>
    </>
  );
};

export default AddItemToOrder;
