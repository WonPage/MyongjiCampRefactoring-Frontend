import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useNotification from '../../hook/useNotification';
import { ScrollView } from 'react-native-gesture-handler';
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

import Loading from '../(other)/Loading';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

 
/*     useEffect(()=>{
        getFcmToken()
        const subscribe = messaging().onMessage(async remoteMessage => {
            Alert.alert('remote message ',JSON.stringify(remoteMessage))
        })
        // subscribe()
        return ()=>{
            subscribe()
        }
    },[]) 


     const getFcmToken = async ()=> {
        const token = await messaging().getToken();
        Alert.alert('FCM TOKEN', token)
    } */





const Notification = ({navigation}) => {
  const {getNotifications, notificationRead} = useNotification();
  const [page, setPage] = useState(0);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [notifications, setNotifications] = useState([])

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    getNotifications(page).then(notifi=>{
      let tmp = null;
            if(page === 0){
                tmp = notifi;
            }
            else{
               tmp = [...notifications];
               tmp = tmp.concat(notifi);
            }
            setNotifications(tmp)
    })

/*     return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    }; */

    /*     notificationListener.crㄱurrent = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    }); */
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <ScrollView showsVerticalScrollIndicato={false}>
        {notifications ? notifications.map((item, index)=>{
          const date = new Date(item?.createDate)
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const newMonth = month.toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const dateFormat = `${year}.${newMonth}.${day}  ${hours}:${minutes}`
          return(
            // <TouchableOpacity activeOpacity={0.5} key={index} onPress={()=>navigation.navigate('PostDetail', {boardId: item.targetBoardId})} >
            <TouchableOpacity activeOpacity={0.5} key={index} onPress={()=>{
              notificationRead(item.id, item.targetBoardId).finally(()=>{
                getNotifications(page).then(notifi => {
                  let tmp = null;
                  if (page === 0) {
                    tmp = notifi;
                  }
                  else {
                    tmp = [...notifications];
                    tmp = tmp.concat(notifi);
                  }
                  setNotifications(tmp)
                })
              }
              )}}>
              <View style={{ borderRadius: 10, height:hp('10%'),width:hp('40%'), marginTop:hp('2%'), elevation:1,
                    backgroundColor:item.read?'lightgray':'white', padding:hp('1.5%'), justifyContent:'space-between'}}>
                      <View>
                      <Text style={{fontSize:15}}>{item.content}</Text>
                      </View>
                      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                      <Text style={{fontSize:12}}>{dateFormat}</Text>
                      </View>
              </View>
            </TouchableOpacity>

          )
        }) : (<Loading />)}


      </ScrollView>

   
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
      // flex: 1,
      height:'100%',
  },

  comment_item_container:{
      borderWidth: 1
  }
});
/*       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      /> */
export default Notification;