/** 담당자 채윤 
 * 240815 - 지원했던 이력서 내용 확인하기 */
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function SentResumeModal({navigation, route}){
    const {data} = route.params;
    const content = data.data;
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]} onPress={navigation.goBack} />
            <View style={{ width: wp('90%'), height: hp('65%'), backgroundColor: '#F0EBE3', borderRadius:10,
                paddingHorizontal: wp('5%'), paddingVertical: hp('3%'), justifyContent:'space-between'
             }}>
                <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
                    <View style={{marginTop:hp('1.5%'), paddingBottom:hp('1%')}}>
                        <Text style={{ marginLeft: 3, color:'#A0937D' }}>역할</Text>
                        <Text style={{fontSize:28, color:'#776B5D'}}>{content.role}</Text>
                    </View>
                    <TouchableOpacity onPress={navigation.goBack} style={{backgroundColor:'#C7B7A3', width:wp('16%'), height:hp('5%'), justifyContent:'center', alignItems:'center', paddingBottom:hp('0.5%'), borderRadius:30}}>
                        <Text style={{ color: 'white', fontWeight:'500' }}>닫기</Text>
                    </TouchableOpacity>
                </View>
                <View style={{}}>
                    <Text style={{ marginLeft: 3, color:'#A0937D', marginBottom:hp('1.3%')}}>내용</Text>
                    <Text style={{fontSize:18, paddingHorizontal:wp('3%'),paddingVertical:hp('1%'), color:'#776B5D', borderWidth:1, height:hp('35%'), borderRadius:10, borderColor:'#A0937D'}}>{content.applyContent}</Text>
                </View>
                <View style={{}}>
                    <Text style={{ marginLeft: 3, color:'#A0937D' }}>URL 링크</Text>
                    <Text style={{fontSize:18, color:'#776B5D', marginTop:hp('0.4%'), marginLeft:wp('0.5%')}}>{content.applyUrl===''?'없음':content.applyUrl}</Text>
                </View>
            </View>
        </View>
    )
}
