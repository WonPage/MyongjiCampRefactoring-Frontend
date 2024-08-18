import NetInfo from '@react-native-community/netinfo';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, TouchableOpacity, View, Platform  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState, useRef } from 'react';
import NetworkErrorModal from './modal/NetworkErrorModal';
import MainNavigation from './navigation/Navigation';
// import messaging from '@react-native-firebase/messaging';


const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function App() {
  const requestUserPermission = async () => {
    const settings = await Notifications.requestPermissionsAsync();
    const enabled = settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', settings);
    }

    return enabled;
  };

  const setupNotificationHandler = async () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  };

/*   async function deleteExpoToken(){
    //ASYNCSTORAGE에 삭제 & DB도 삭제
    const expoToken = JSON.parse(await AsyncStorage.getItem('expoToken'))
    const token = JSON.parse(await AsyncStorage.getItem('token'))

    try {
      const res = await fetch(`${API_URL}/delete/expoToken`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: expoToken }),
      })
      const result = await res.json()
      console.log('result',result)
    } catch (error) {
      console.error('Error deleting expo token:', error)
    }
    AsyncStorage.removeItem('expoToken')
      .then(() => {
        console.log('Item deleted successfully')
      })
      .catch((error) => {
        console.error('Error deleting item:', error)
      })
    const result = await res.json()
    console.log('delete',result)
  } */

/*   async function checkNotificationPermisssion() {
    if (Device.isDevice) {
      const expoToken = JSON.parse(await AsyncStorage.getItem('expoToken'))
      if ((await Notifications.getPermissionsAsync()).status === 'granted') { 
        // 뒤늦게 어플리케이션에서 알림 설정을 권한 허용으로 바꾼 경우
        if (expoToken === null) {
          // if(AsyncStorage) ASYNCSTORAGE에서 EXPO토큰 있나 확인하고 있으면 걍 넘어감 없으면 아래 코드 실행
          console.log('notification existingStatus is granted but not have expotoken')
          registerForPushNotificationsAsync()
            .then(token => {
              if (token !== '') { //expoToken 받으면
                sendPushToken(token)
                .then(
                  console.log('send to Notifications Expo Token to backend')
                )
              }
              else {
                console.log('App 33 : ', token)
              }
            })
        }
      }
      else{// 나중에 어플리케이션에서 알림 권한을 없애는 경우
        if(expoToken !== null && expoToken !== ''){ //권한은 없는데 expoToken은 있으면
            deleteExpoToken()
        }
      }
    }
  } */
  /** 네트워크 처리 로직 */
  const [isConnected, setIsConnected] = useState(true);


  useEffect(() => {
    (async () => {
 /*     await setupNotificationHandler();
 
      const permissionGranted = await requestUserPermission();
      if (permissionGranted) {
        const token = await messaging().getToken();
        await AsyncStorage.setItem('expoToken', JSON.stringify(token));
        console.log(token);
      } else {
        //여기여기
        //grant가 아닌데 토큰이 있으면 여기서 기기 내 저장된 fcm 삭제 및 서버에 redis에서 삭제 요청?
        console.log('Permission not granted');
      }

      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        console.log('Notification caused app to open from quit state:', initialNotification.notification);
      }

      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification caused app to open from background state:', remoteMessage.notification);
      });

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
      });

      const unsubscribe = messaging().onMessage(async remoteMessage => {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            data: remoteMessage.data,
          },
          trigger: null,
        });
      }); */

      const unsubscribeNetwork = NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected);
      })
      return () => {
        unsubscribe();
        unsubscribeNetwork();
      };
    })();
  }, [])



  return (
    <>
      <StatusBar style="auto" />
      <MainNavigation />
      <NetworkErrorModal visible={!isConnected} />
    </>
  );
}
