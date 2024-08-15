/** 담당자 채윤 
 * 240809 - 댓글 삭제 확인 구현 */
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import useComment from "../hook/useComment";

export default function CommentDeleteModal({navigation, route}){
    const {deleteComment} = useComment();
    const {boardId, commentId, callback} = route.params;
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]} onPress={navigation.goBack} />
            <View style={{ width: wp('80%'), height: hp('25%'), backgroundColor: '#F0EBE3', borderRadius:10,
                paddingHorizontal: wp('5%'), paddingVertical: hp('3%'), justifyContent:'space-between'
             }}>
                <View style={{marginTop:hp('1.5%'), paddingBottom:hp('1%')}}>
                    <Text style={{ fontSize:20, marginLeft: 3, color:'#A0937D' }}>정말 댓글을 삭제하시겠습니까?</Text>
                </View>
                <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                    <TouchableOpacity onPress={()=>
                        deleteComment(boardId, commentId).then(data=>{
                            if (!data.isFailed) {
                                navigation.goBack();
                                callback();
                            }
                        })
                    }
                    style={{backgroundColor:'#BACD92', width:wp('16%'), height:hp('5%'), justifyContent:'center', alignItems:'center', paddingBottom:hp('0.5%'), borderRadius:30}}>
                        <Text style={{ color: 'white', fontWeight:'500' }}>확인</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{navigation.goBack()}} 
                    style={{marginHorizontal:wp('2%'), backgroundColor:'#DBB5B5', width:wp('16%'), height:hp('5%'), justifyContent:'center', alignItems:'center', paddingBottom:hp('0.5%'), borderRadius:30}}>
                        <Text style={{ color: 'white', fontWeight:'500' }}>취소</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}