import NetInfo from '@react-native-community/netinfo';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import NetworkErrorModal from './modal/NetworkErrorModal';
import MainNavigation from './navigation/Navigation';
export default function App() {
  /** 네트워크 처리 로직 */
  const [isConnected, setIsConnected] = useState(true);
  useEffect(()=>{
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    })
    return () => unsubscribe();
  },[])

  return (
    <>
      <StatusBar style="auto" />
      <MainNavigation/> 
      <NetworkErrorModal visible={!isConnected}/>
    </>
  );
}
