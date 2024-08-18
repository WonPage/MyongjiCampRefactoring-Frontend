import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,ScrollView } from 'react-native';
import useNotification from '../../hook/useNotification';
import { heightPercentageToDP as hp } from "react-native-responsive-screen";


import Loading from '../(other)/Loading';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

const Notification = ({navigation}) => {
  const {getNotifications, notificationRead} = useNotification();
  const [page, setPage] = useState(0);
  const [notifications, setNotifications] = useState([])

  const isFocused = useIsFocused();
  useEffect(() => {
    if(isFocused){
      getNotifications(page).then(notifi=>{
        console.log(notifi)
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
    }
  }, [isFocused]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            <TouchableOpacity activeOpacity={0.5} key={index} onPress={() => { notificationRead(item.id, item.targetBoardId,item.notificationStatus)}}>
              <View style={{
                borderRadius: 10, height: hp('10%'), width: hp('40%'), marginTop: hp('2%'), elevation: 1,
                backgroundColor: item.read ? 'lightgray' : 'white', padding: hp('1.5%'), justifyContent: 'space-between'
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="chatbox-outline" size={18} color="black" style={{ marginRight: 5, paddingTop: 5 }} />
                  <Text style={{ fontSize: 15 }}>{item.content}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12 }}>{dateFormat}</Text>
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