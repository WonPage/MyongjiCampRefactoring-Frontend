import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import useApply from "../hook/useApply";

export default function PrevReceivedResumeModal({navigation, route}){
    const {data, boardId} = route.params;
    const iconPath = {
        1 : require('../assets/profile-icon/ai.jpg'),
        2 : require('../assets/profile-icon/cloud.jpg'),
        3 : require('../assets/profile-icon/design.jpg'),
        4 : require('../assets/profile-icon/dog.jpg'),
        5 : require('../assets/profile-icon/rabbit.jpg'),
    }
        const {getReceivedResumeList} = useApply();
        const handleCloseModal = async() => {
            getReceivedResumeList(boardId)
            .then(res => {
                navigation.goBack();
                navigation.navigate('ReceivedResumeModal', {data:res.data, boardId:boardId});
            })
        }
        const handleClose = async() => {
            getReceivedResumeList(boardId)
            .then(res => {
                navigation.goBack();
                navigation.navigate('ReceivedResumeModal', {data:res.data, boardId:boardId});
            })
        }
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}  />
                <View style={{ width: '85%', backgroundColor: 'white', borderRadius: 30, elevation:10 }}>
                    <View style={{justifyContent:'space-between', alignItems:'center', padding:'6%'}}>
                        <TouchableOpacity onPress={handleCloseModal} activeOpacity={0.5} style={{position:'absolute', top:'5%', left:'5%'}}>
                            <MaterialIcons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                                <Image source={iconPath[data.icon]} style={{borderRadius:100, height:hp('4.5%'), width:hp('4.5%'), marginRight:'4%'}}/>
                                <Text style={{fontSize:25}}>{`${data.nickname}`}</Text>
                        </View>
                        <Text style={{fontSize:17, marginTop:hp(2), color:'darkblue'}}>{
                        data.finalStatus==='PENDING'?"대기중":
                            data.finalStatus==="ACCEPTED"?"수락":
                            data.finalStatus==="REJECTED"?"거절":undefined}</Text>
                        <View style={{width:'100%'}}>
                            <View style={{marginTop:hp('2%')}}>
                                <Text>지원 직무</Text>
                                <View style={{borderWidth:1, borderRadius:8, justifyContent:'center', padding:16, marginTop:7}}>
                                    <Text>{data.role}</Text>
                                </View>
                            </View>
                            <View style={{marginTop:hp('2%')}}>
                                <Text>내용</Text>
                                <View style={{borderWidth:1, borderRadius:8, justifyContent:'center', padding:16, marginTop:7}}>
                                    <Text>{data.applyContent}</Text>
                                </View>
                            </View>
                            <View style={{marginTop:hp('2%')}}>
                                <Text>URL 링크</Text>
                                <View style={{borderWidth:1, borderRadius:8, justifyContent:'center', padding:16, marginTop:7}}>
                                    <Text>{data.applyUrl}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop:hp('5%'), marginBottom:hp('2%'), flexDirection:'row', justifyContent:"center", width:'100%'}}>
                            <TouchableOpacity onPress={handleClose}
                            style={{backgroundColor:'lightgray', paddingVertical:'4%', paddingHorizontal:'10%', borderRadius:13}}>
                                <Text style={{fontSize:18}}>닫기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }