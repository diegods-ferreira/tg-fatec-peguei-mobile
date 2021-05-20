import React from 'react';

import { Container, Dash, LabelTextWrapper, LabelText } from './styles';

interface EndOfListLabelProps {
  onPress?: () => void;
}

const EndOfListLabel: React.FC<EndOfListLabelProps> = ({
  onPress = () => {},
}) => {
  return (
    <Container onPress={onPress}>
      <Dash />
      <LabelTextWrapper>
        <LabelText>Fim da linha!</LabelText>
        <LabelText>Clique aqui para atualizar a lista</LabelText>
      </LabelTextWrapper>
      <Dash />
    </Container>
  );
};

export default EndOfListLabel;
