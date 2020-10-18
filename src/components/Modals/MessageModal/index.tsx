import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';
import { parseWidthPercentage } from '../../../utils/screenPercentage';

import {
  Container,
  ModalTitleContainer,
  ModalTitleIcon,
  ModalTitleText,
  ModalTitle,
  ModalSubtitle,
  ModalMessage,
  ModalDismissButton,
  ModalDismissButtonText,
} from './styles';

interface MessageModalProps {
  title?: string;
  subtitle?: string;
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  isVisible: boolean;
  setIsVisible: () => void;
}

const iconsSize = parseWidthPercentage(32);

const icons = {
  info: <Feather name="info" size={iconsSize} color="#686de0" />,
  success: <Feather name="check-circle" size={iconsSize} color="#6ab04c" />,
  error: <Feather name="alert-circle" size={iconsSize} color="#e74c3c" />,
  warning: <Feather name="alert-triangle" size={iconsSize} color="#f6b93b" />,
};

const MessageModal: React.FC<MessageModalProps> = ({
  title,
  subtitle,
  message,
  type = 'info',
  isVisible,
  setIsVisible,
}) => {
  const [isModalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    setModalVisible(isVisible);
  }, [isVisible]);

  return (
    <Modal
      isVisible={isModalVisible}
      onBackButtonPress={setIsVisible}
      onBackdropPress={setIsVisible}
      swipeDirection="down"
      onSwipeComplete={setIsVisible}
      hideModalContentWhileAnimating
      coverScreen
      avoidKeyboard
    >
      <Container>
        <ModalTitleContainer>
          <ModalTitleIcon>{icons[type]}</ModalTitleIcon>

          <ModalTitleText>
            <ModalTitle>{title}</ModalTitle>

            <ModalSubtitle>{subtitle}</ModalSubtitle>
          </ModalTitleText>
        </ModalTitleContainer>

        <ModalMessage>{message}</ModalMessage>

        <ModalDismissButton type={type} onPress={setIsVisible}>
          <ModalDismissButtonText>Ok</ModalDismissButtonText>
        </ModalDismissButton>
      </Container>
    </Modal>
  );
};

export default MessageModal;
