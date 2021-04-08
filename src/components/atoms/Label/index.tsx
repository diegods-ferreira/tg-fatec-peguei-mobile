import React from 'react';

import { parseHeightPercentage } from '@utils/screenPercentage';

import { Text } from './styles';

interface LabelProps {
  marginTop?: number;
  marginBottom?: number;
}

const Label: React.FC<LabelProps> = ({
  marginTop = 0,
  marginBottom = 8,
  children,
}) => {
  return (
    <Text
      marginTop={parseHeightPercentage(marginTop)}
      marginBottom={parseHeightPercentage(marginBottom)}
    >
      {children}
    </Text>
  );
};

export default Label;
