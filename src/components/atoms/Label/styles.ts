import styled, { css } from 'styled-components/native';

import { parseWidthPercentage } from '@utils/screenPercentage';

interface LabelProps {
  marginTop: number;
  marginBottom: number;
}

export const Text = styled.Text<LabelProps>`
  color: #ff8c42;
  font-size: ${parseWidthPercentage(14)}px;

  ${props =>
    (props.marginTop || props.marginBottom) &&
    css`
      margin: ${props.marginTop}px 0px ${props.marginBottom}px 0px;
    `}
`;
