/** 담당자 채윤 
 * 240815 - 지원했던 이력서 내용 확인하기 */
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import useApply from "../hook/useApply";

export default function ReceivedResumeModal({navigation, route}){
    const {data, boardId} = route.params;
    const {getResumeDetail} = useApply();
    const iconPath = {
        1 : require('../assets/profile-icon/ai.jpg'),
        2 : require('../assets/profile-icon/cloud.jpg'),
        3 : require('../assets/profile-icon/design.jpg'),
        4 : require('../assets/profile-icon/dog.jpg'),
        5 : require('../assets/profile-icon/rabbit.jpg'),
    }
    const handleShowResume = async(resumeId) => {
        await getResumeDetail(resumeId)
        .then(res => {
            navigation.goBack();
            navigation.navigate('ReceivedResumeDetailModal', {data:res.data, boardId:boardId});
        })
    }
    const handleShowPrevResume = async(resumeId) => {
        await getResumeDetail(resumeId)
        .then(res => {
            navigation.goBack();
            navigation.navigate('PrevReceivedResumeModal', {data:res.data, boardId:boardId});
        })
    }
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]} onPress={navigation.goBack} />
            <View style={{ width: '90%',  backgroundColor: '#A1ADBC', borderRadius: 4, elevation:10}}>
                <View style={{alignItems:'center', paddingVertical:hp('2%')}}>
                    <Text style={{fontSize:25, color:'#251749', fontWeight:500, marginBottom:hp(1)}}>이력서 목록</Text>
                    {data.length===0 ? <Text style={{fontSize:20}}>없어요🤭</Text> : data.map((value, index) => {
                        console.log(value);
                        return (
                        <TouchableOpacity onPress={value.firstStatus === 'ACCEPTED'||value.firstStatus==='REJECTED' ? ()=>handleShowPrevResume(value.applicationId) : ()=>handleShowResume(value.applicationId)} 
                        activeOpacity={0.6} key={index} style={{marginVertical:hp('1%'), paddingHorizontal:'3%',
                            backgroundColor:'white', height:hp('8%'), justifyContent:'center', width:'90%'}}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems:'center'}}>
                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <Image style={{borderRadius:50, height:hp('5%'), width:hp('5%'), marginRight:'7%'}} source={iconPath[value.icon]}/>
                                    <View>
                                        <Text style={{fontSize:23}}>{value.nickname}</Text>
                                        <Text style={{fontSize:12}}>{value.role}</Text>
                                    </View>
                                </View>
                                <View style={{marginRight:'2%'}}>
                                    {value.firstStatus === 'ACCEPTED'||value.firstStatus==='REJECTED' ? (
                                        <MaterialCommunityIcons name="email-open-outline" size={30} color="black" />
                                    ):(
                                        <MaterialCommunityIcons name="email-outline" size={30} color="gray" />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )})}
                </View>
            </View>
        </View>
    )
}
