import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationContextData {
  location: Location;
}

const LocationContext = createContext<LocationContextData>(
  {} as LocationContextData,
);

const LocationProvider: React.FC = ({ children }) => {
  const [location, setLocation] = useState<Location>({} as Location);

  const hasLocationPermissionIOS = useCallback(async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Erro', 'Não pudemos abrir as configurações');
      });
    };

    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Aviso!', 'Permissão de localização negada');
    }

    if (status === 'disabled') {
      Alert.alert(
        'Aviso!',
        'Ative o serviço de localização do seu dispositivo para que possamos determinar sua localização',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location" },
        ],
      );
    }

    return false;
  }, []);

  const hasLocationPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Permissão de localização negada pelo usuário.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Permissão de localização revogada pelo usuário.',
        ToastAndroid.LONG,
      );
    }

    return false;
  }, [hasLocationPermissionIOS]);

  const getCurrentLocation = useCallback(async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        Alert.alert(
          'Erro',
          `Houve um erro ao tentar acessar os serviços de localização deste dispositivo.\n\nERROR_CODE: ${error.code}`,
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, [hasLocationPermission]);

  useEffect(() => {
    async function loadLocation() {
      await getCurrentLocation();
    }

    loadLocation();
  }, [getCurrentLocation]);

  return (
    <LocationContext.Provider value={{ location }}>
      {children}
    </LocationContext.Provider>
  );
};

function useLocation(): LocationContextData {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error('useLocation must be used within an LocationProvider');
  }

  return context;
}

export { LocationProvider, useLocation };
