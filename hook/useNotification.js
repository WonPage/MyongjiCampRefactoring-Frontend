import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {  useNavigation } from "@react-navigation/native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const useNotification = () => {
  const navigation = useNavigation();
  const getNotifications = async (pageNum) => {
    const token = JSON.parse(await AsyncStorage.getItem('token'));
    const params = new URLSearchParams();
    params.append('pageNum', pageNum);
    const result = axios.get(`${API_URL}/get/notifications?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token.token}` }
    })
      .then(res => {
        console.log(res.data.data)
        return res.data.data;
      })
      .catch(error => {
        console.log(error);
      })
    return result;
  }
  async function notificationRead(notificationId, boardId) {
    const token = JSON.parse(await AsyncStorage.getItem('token'));
    const result = axios.post(`${API_URL}/read/notification/${notificationId}`, {}, {
      headers: { Authorization: `Bearer ${token.token}` }
    })
      .then(res => {
        return res.data.data;
      })
      .catch(error => {
        console.log(error);
      })
      navigation.navigate('PostDetail', {boardId:boardId, title:'게시글'})

    return result;

  }

  return { getNotifications, notificationRead }
}
export default useNotification;



/*     async function sendPushNotification(expoPushToken) {
        const message = {
          to: expoPushToken,
          sound: 'default',
          title: 'Original Title',
          body: 'And here is the body!',
          data: {} //여기로 다른 페이지 이동 가능할지도
        };
        const res = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
        const result = await res.json();
        console.log(result); 
      } */