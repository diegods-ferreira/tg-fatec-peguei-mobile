import styled, { css } from 'styled-components/native';

interface ContainerProps {
  size: number;
}

export const Image = styled.Image<ContainerProps>`
  ${props =>
    props.size &&
    css`
      width: ${props.size}px;
      height: ${props.size}px;
      border-radius: ${props.size / 2}px;
    `}
`;
