import NetInfo from '@react-native-community/netinfo';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState, useRef } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import NetworkErrorModal from './modal/NetworkErrorModal';
import MainNavigation from './navigation/Navigation';
// import messaging from '@react-native-firebase/messaging'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function App() {
  // expo Notification 권한 허용
  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError('Project ID not found');
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        return pushTokenString;
      } catch (e) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError('Must use physical device for push notifications');
    }
  }

  async function sendPushToken(expoToken) {
    const token = JSON.parse(await AsyncStorage.getItem('token'))
     if (token !== null) {
       try {
         const res = await fetch(`${API_URL}/send/expoToken`, {
           method: 'POST',
           headers: {
             Authorization: `Bearer ${token.token}`,
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({ token: expoToken }),
         })
         const result = await res.json()
        //  console.log('result',result)
       } catch (error) {
         console.error('Error sending push token:', error)
       }
       AsyncStorage.setItem('expoToken', JSON.stringify(expoToken))
    } 
  }

  async function deleteExpoToken(){
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
  }

  async function checkNotificationPermisssion() {
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


  }
  /** 네트워크 처리 로직 */
  const [isConnected, setIsConnected] = useState(true);


  useEffect(() => {
    // check 잘 되는지 확인 필요 -> 채윤이 폰으로?
    checkNotificationPermisssion()
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    })
    return () => {
      unsubscribe();
    }
  }, [])



  return (
    <>
      <StatusBar style="auto" />
      <MainNavigation />
      <NetworkErrorModal visible={!isConnected} />
    </>
  );
}
