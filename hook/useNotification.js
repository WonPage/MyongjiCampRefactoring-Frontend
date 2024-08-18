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
  async function notificationRead(notificationId, boardId, notificationStatus) {
    console.log("hi")
    const token = JSON.parse(await AsyncStorage.getItem('token'));
    console.log(token)
    const result = axios.post(`${API_URL}/read/notification/${notificationId}`, {}, {
      headers: { Authorization: `Bearer ${token.token}` }
    })
      .then(res => {
        return res.data.data;
      })
      .catch(error => {
        console.log(error);
      })
      if(notificationStatus == 'APPLY'){
        navigation.navigate('Apply')
      }
      else{
        navigation.navigate('PostDetail', {boardId:boardId, title:'게시글'})
      }

    return result;

  }

  return { getNotifications, notificationRead }
}
export default useNotification;