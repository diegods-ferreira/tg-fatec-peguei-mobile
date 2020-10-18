import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';

import { Container } from './styles';

interface CustomModalProps {
  children: any;
  isVisible: boolean;
  setIsVisible: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  children,
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
      <Container>{children}</Container>
    </Modal>
  );
};

export default CustomModal;
