import styled from 'styled-components/native';

import { parseHeightPercentage } from '@utils/screenPercentage';

export const Container = styled.View`
  width: 100%;
  margin-top: ${parseHeightPercentage(16)}px;
`;
