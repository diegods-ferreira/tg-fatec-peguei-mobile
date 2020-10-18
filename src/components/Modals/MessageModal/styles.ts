import styled, { css } from 'styled-components/native';
import {
  parseHeightPercentage,
  parseWidthPercentage,
} from '../../../utils/screenPercentage';

interface ModalDismissButtonProps {
  type: string;
}

export const Container = styled.View`
  width: 100%;
  padding: ${parseHeightPercentage(24)}px ${parseHeightPercentage(24)}px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #312e38;
`;

export const ModalTitleContainer = styled.View`
  width: 100%;
  flex-direction: row;
  margin-bottom: ${parseHeightPercentage(16)}px;
`;

export const ModalTitleIcon = styled.View`
  justify-content: center;
  align-items: center;
  margin-right: ${parseWidthPercentage(24)}px;
`;

export const ModalTitleText = styled.View`
  flex: 1;
`;

export const ModalTitle = styled.Text`
  margin-bottom: ${parseHeightPercentage(8)}px;
  font-weight: bold;
  font-size: ${parseWidthPercentage(24)}px;
  color: #ebebeb;
`;

export const ModalSubtitle = styled.Text`
  font-size: ${parseWidthPercentage(20)}px;
  color: #ebebeb;
`;

export const ModalMessage = styled.Text`
  font-size: ${parseWidthPercentage(16)}px;
  color: #ebebeb;
`;

export const ModalDismissButton = styled.TouchableOpacity<
  ModalDismissButtonProps
>`
  align-self: flex-end;
  height: ${parseHeightPercentage(56)}px;
  width: ${parseWidthPercentage(56)}px;
  border-radius: 8px;
  margin-top: ${parseHeightPercentage(24)}px;
  justify-content: center;
  align-items: center;

  ${props =>
    props.type === 'info' &&
    css`
      background: #686de0;
    `}

  ${props =>
    props.type === 'success' &&
    css`
      background: #6ab04c;
    `}

      ${props =>
    props.type === 'error' &&
    css`
      background: #e74c3c;
    `}

        ${props =>
    props.type === 'warning' &&
    css`
      background: #f6b93b;
    `}
`;

export const ModalDismissButtonText = styled.Text`
  color: #312e38;
  font-size: ${parseWidthPercentage(16)}px;
  font-weight: bold;
`;
