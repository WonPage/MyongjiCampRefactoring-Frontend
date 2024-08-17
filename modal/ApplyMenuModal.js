/** 담당자 채윤 
 * 240811 - 지현현황 창에 있는 지원이력 메뉴 */

import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import useApply from "../hook/useApply";

export default function ApplyMenuModal({navigation, route}){
    const {boardId} = route.params;
    const {cancleApply} = useApply();
    const handleMoveToBoard = () => {
        navigation.navigate("PostDetail", {boardId:boardId, title:"지원한 게시글"});
    }
    const handleCancleApply = () => {
        cancleApply(boardId);
    }
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]} onPress={navigation.goBack} />
            <View style={{ width: wp('50%'), height: hp('25%'), backgroundColor: '#F0EBE3', borderRadius:10,
                paddingHorizontal: wp('5%'), paddingVertical: hp('2%')
             }}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <Text style={{ fontSize:20, color:'#A0937D', paddingBottom:3 }}>지원 메뉴</Text>
                    <TouchableOpacity onPress={()=>{navigation.goBack()}} 
                    style={{backgroundColor:'#DBB5B5', padding:wp(2), justifyContent:'center', alignItems:'center', borderRadius:30}}>
                        <Text style={{ color: 'white', fontWeight:'500' }}>닫기</Text>
                    </TouchableOpacity>
                </View>
                <View style={{borderWidth:0.5, marginTop:hp(2), flex:1, alignItems:'center', justifyContent:'space-evenly'}}>
                    <TouchableOpacity onPress={handleMoveToBoard}>
                        <Text>게시글 이동</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCancleApply}>
                        <Text>지원 취소</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}