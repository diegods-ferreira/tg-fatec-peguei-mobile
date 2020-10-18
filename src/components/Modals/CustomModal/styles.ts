import styled from 'styled-components/native';
import { parseHeightPercentage } from '../../../utils/screenPercentage';

export const Container = styled.View`
  width: 100%;
  padding: ${parseHeightPercentage(24)}px ${parseHeightPercentage(24)}px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #312e38;
`;
