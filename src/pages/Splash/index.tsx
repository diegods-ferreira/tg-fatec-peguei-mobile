import React from 'react';
import { ImageBackground } from 'react-native';

import backgroundImg from '../../assets/bg-image.png';
import splashLogo from '../../assets/splash.png';

import { Container, LogoImage } from './styles';

const Splash: React.FC = () => {
  return (
    <ImageBackground source={backgroundImg} style={{ flex: 1 }}>
      <Container>
        <LogoImage source={splashLogo} />
      </Container>
    </ImageBackground>
  );
};

export default Splash;
