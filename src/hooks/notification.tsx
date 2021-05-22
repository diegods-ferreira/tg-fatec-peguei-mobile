import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Alert, Linking } from 'react-native';
import OneSignal, { OpenedEvent } from 'react-native-onesignal';

import { ONE_SIGNAL_APP_ID } from '@env';
import { useAuth } from './auth';

interface Notification {
  isSubscribed: boolean;
}

interface NotificationContextData {
  notification: Notification;
  subscribePushNotifications: () => void;
  unsubscribePushNotifications: () => void;
}

interface NotificationAdditionalData {
  deep_link?: string;
}

const NotificationContext = createContext<NotificationContextData>(
  {} as NotificationContextData,
);

const NotificationProvider: React.FC = ({ children }) => {
  const { user } = useAuth();

  const [notification, setNotification] = useState<Notification>(
    {} as Notification,
  );

  const subscribePushNotifications = useCallback(() => {
    OneSignal.disablePush(false);

    setNotification(state => ({
      ...state,
      isSubscribed: true,
    }));
  }, []);

  const unsubscribePushNotifications = useCallback(() => {
    OneSignal.disablePush(true);

    setNotification(state => ({
      ...state,
      isSubscribed: false,
    }));
  }, []);

  const handleOnSignalNotificationOpened = useCallback(
    async (notificationParam: OpenedEvent) => {
      const { deep_link } = notificationParam.notification
        .additionalData as NotificationAdditionalData;

      if (deep_link) {
        try {
          await Linking.openURL(deep_link);
        } catch {
          Alert.alert(
            'Erro!',
            'Ocorreu um erro ao tentar abrir essa notificação.',
          );
        }
      }
    },
    [],
  );

  useEffect(() => {
    async function setUpOneSignal() {
      OneSignal.setLogLevel(6, 0);
      OneSignal.setAppId(ONE_SIGNAL_APP_ID);

      if (user) {
        OneSignal.setExternalUserId(user.id);
      }

      OneSignal.setNotificationOpenedHandler(notificationParam => {
        handleOnSignalNotificationOpened(notificationParam);
      });

      const deviceState = await OneSignal.getDeviceState();

      setNotification(state => ({
        ...state,
        isSubscribed: deviceState.isSubscribed,
      }));
    }

    setUpOneSignal();

    return () => {
      OneSignal.clearHandlers();
    };
  }, [handleOnSignalNotificationOpened, user]);

  return (
    <NotificationContext.Provider
      value={{
        notification,
        subscribePushNotifications,
        unsubscribePushNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

function useNotification(): NotificationContextData {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotification must be used within an NotificationProvider',
    );
  }

  return context;
}

export { NotificationProvider, useNotification };
