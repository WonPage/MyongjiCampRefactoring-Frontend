import { useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useReport from "../hook/useReport";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function ReportModal({navigation, route}){
    const {boardId, commentId, type} = route.params;
    const [reason, setReason] = useState(null);
    const {reportPost, reportComment} = useReport();
    const reportOption=[
        'ADVERTISEMENT', //광고
        'ABUSE', //욕설 및 비방
        'ILLEGAL_CONTENT', //불법 정보
        'HATE_SPEECH', //혐오 발언
        'OTHER' //기타
    ]
    const handleReport = () => {
        if (type=='Post') reportPost(boardId, reason);
        if (type=='Comment') reportComment(commentId, reason);
        navigation.goBack();
    }
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]} onPress={navigation.goBack} />
            <View style={{ width: wp('70%'), height: hp('50%'), backgroundColor: '#F0EBE3', borderRadius:10,
                paddingHorizontal: wp('5%'), paddingVertical: hp('3%'), justifyContent:'space-between'
             }}>
                <View>
                    <Text style={{fontSize:16, marginBottom:hp('2%'), fontWeight:600, color:'#251749'}}>
                        {`${reason===null ? "보기 중 하나를 선택하세요." : 
                        reason==='ADVERTISEMENT' ? "신고 사유 : 광고" :
                        reason==='ABUSE' ? '신고 사유 : 욕설 및 비방' :
                        reason=== 'ILLEGAL_CONTENT' ? '신고 사유 : 불법 정보' :
                        reason=== 'HATE_SPEECH' ? '신고 사유 : 혐오 발언' : '신고 사유 : 기타'}`}
                    </Text>
                </View>
                <View>
                    {reportOption.map((option, index) => (
                        <TouchableOpacity style={[reason==option?{backgroundColor:'#495579'}:{backgroundColor:'white',}, { borderRadius:5, margin:'1%',
                        justifyContent:'center', alignItems:'center', height:hp('6%')}]} key={index} onPress={() => setReason(option)}>
                                <Text style={[reason==option?{color:'white'}:{color:'black'}, {fontSize:15, fontWeight:'500'}]}>{option === 'ADVERTISEMENT' ? '광고' :
                                option === 'ABUSE' ? '욕설 및 비방' :
                                option === 'ILLEGAL_CONTENT' ? '불법 정보' :
                                option === 'HATE_SPEECH' ? '혐오 발언' : '기타'}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={{flexDirection:'row', justifyContent:'flex-end', marginVertical:hp(2)}}>
                    <TouchableOpacity disabled={reason===null ? true : false} onPress={handleReport}
                    style={{backgroundColor:'#BACD92', width:wp('16%'), height:hp('5%'), justifyContent:'center', alignItems:'center', paddingBottom:hp('0.5%'), borderRadius:30}}>
                        <Text>신고</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginLeft:wp(2), backgroundColor:'#DBB5B5', width:wp('16%'), height:hp('5%'), justifyContent:'center', alignItems:'center', paddingBottom:hp('0.5%'), borderRadius:30}}
                    onPress={navigation.goBack}>
                        <Text>취소</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}