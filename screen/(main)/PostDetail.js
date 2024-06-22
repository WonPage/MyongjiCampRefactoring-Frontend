/** 담당자 채윤 
 * 240622 - 글 상세보기 UI, 조회 기능 구현 완료 */
import { useEffect, useRef, useState } from "react";
import useBoard from "../../hook/useBoard";
import useUsers from "../../hook/useUsers";
import { useFocusEffect } from "@react-navigation/native";
import { Image, Keyboard, Pressable, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import Loading from "../(other)/Loading";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Entypo, FontAwesome } from "@expo/vector-icons";

const PostDetail = ({navigation, route}) => {
    const scrollViewRef = useRef();
    const boxRef = useRef();
    const {boardId} = route.params;
    const {sessionCheck} = useUsers();
    const {getBoardDetail, checkScrap, deleteBoard} = useBoard();
    const [userId, setUserId] = useState();
    const [postData, setPostData] = useState();
    const [isScrap, setIsScrap] = useState();
    useFocusEffect(()=>{
        sessionCheck(route);
    })
    const refreshBoardDetail = () => {
        getBoardDetail(boardId).then(data=>{
            if (!data.isFailed) {
                setUserId(data.userId);
                setPostData(data.postData);
                checkScrap(boardId).then(data=>{
                    if (!data.isFailed) {
                        setIsScrap(data.isScrap);
                    }
                })
            }
        })
    }
    useEffect(()=>{
        refreshBoardDetail();
    },[])

    const iconPath = {
        1 : require('../../assets/profile-icon/ai.jpg'),
        2 : require('../../assets/profile-icon/cloud.jpg'),
        3 : require('../../assets/profile-icon/design.jpg'),
        4 : require('../../assets/profile-icon/dog.jpg'),
        5 : require('../../assets/profile-icon/rabbit.jpg')
    }
    const date = new Date(postData?.modifiedDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const newMonth = month.toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const dateFormat = `${year}.${newMonth}.${day} ${hours}:${minutes}`

    // 대댓글 기능
    const [replyMode, setReplyMode] = useState(false);
    const [replyId, setReplyId] = useState();
    const [replyNickname, setReplyNickname] = useState();
    const handleReply = (commentId, commentUserNickname) => {
        setReplyMode(true);
        setReplyId(commentId);
        setReplyNickname(commentUserNickname);
        boxRef.current.focus();
    }
    const handleReplyModeCancle = () => {
        if (replyMode){
            Keyboard.dismiss();
            setReplyMode(false);
            setReplyId(null);
            setReplyNickname(null);
            setTimeout(() => {
                ToastAndroid.show('대댓글이 취소되었습니다.', ToastAndroid.SHORT);
            }, 5);
        }
    }
    const handleRecruitComplete = () => {}
    const handleApply = () => {
        //Modal로 구현
    }
    const handleBoardShare = () => {}
    const handleScrap = () => {}
    return(
        <View>
           <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps={'handled'} contentContainerStyle={{backgroundColor: 'white'}} showsVerticalScrollIndicator={false} >
                <Pressable onPress={handleReplyModeCancle}>
                {/* BOARD_DETAIL Part START */}
                <View style={postData? {marginHorizontal: wp('5%'), marginTop: hp('4%')} : {height:hp('80%')}}>
                {postData ? (
                <View>
                    <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems:'center'}} >
                            <Image source={iconPath[postData.profileIcon]} style={{marginRight:wp('3%'), borderRadius:100, height:hp('4%'), width:wp('8%')}}/>
                            <Text style={{marginRight:wp('2%'), marginBottom:hp('0.5%')}}>{postData.nickname}</Text>
                            <Text style={{fontSize:12, color:'gray'}}>{ postData.modifiedDate === postData.createDate ? dateFormat : `${dateFormat} (수정됨)`}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems:'center'}}>
                            { postData.writerId === userId ? (<>
                                {/* 사용자 본인의 글 */}
                                <TouchableOpacity onPress={()=>{
                                    navigation.navigate('BoardUpdateModal', {data: postData})
                                }}>
                                    <Text>수정</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{
                                    deleteBoard(boardId).then(data=>{
                                        if (!data.isFailed) {navigation.replace('MainNavigation')}
                                    })
                                }}>
                                    <Text style={{marginLeft:hp('1.5%')}}>삭제</Text>
                                </TouchableOpacity>
                            </>) : (
                                // 다른 사용자의 글
                                <TouchableOpacity onPress={()=>{
                                    navigation.navigate('BoardReportModal', {boardId: boardId});
                                }}>
                                    <Text>신고</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize:23, marginTop: hp('2%')}}>{postData.title}</Text>
                    </View>
                    <View style={{marginTop:hp('1%'), minHeight:hp('15%')}}>
                        <Text>{postData.content}</Text>
                    </View>
                    <View style={{borderWidth:1, borderRadius:15, marginTop:hp('1%'), marginBottom:hp('4%'), padding:wp('5%')}}>
                        <View style={{marginBottom: hp('2%'), flexDirection:'row', alignItems:'baseline', justifyContent:'space-between'}}>
                            <Text style={{fontSize:16, fontWeight:'500'}}>선호 지역</Text>
                            <Text>{postData.preferredLocation}</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'baseline', justifyContent:'space-between'}}>
                            <Text style={{fontSize:16, fontWeight:'500'}}>예상 기간</Text>
                            <Text>{postData.expectedDuration}</Text>
                        </View>
                    </View>
                    <View style={{backgroundColor:'#495579', borderRadius:15, paddingHorizontal:wp('5%'), paddingVertical:hp('0.5%')}}>
                        {postData.roleAssignments.map((role, index) => (
                            <View key={index} style={{flexDirection:'row', justifyContent: 'space-between', paddingVertical:hp('2%')}}>
                                <Text style={{color:'white'}}>{
                                role.role === 'BACK' ? ('백엔드') :
                                role.role === 'FRONT' ? ('프론트엔드') :
                                role.role === 'DESIGN' ? ('디자인') :
                                role.role === 'FULL' ? ('풀스택') :
                                role.role === 'PM' ? ('기획') :
                                (role.role)}</Text>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={{color:'white'}}>{role.appliedNumber}</Text>
                                    <Text style={{color:'white'}}>/</Text>
                                    <Text style={{color:'white'}}>{role.requiredNumber}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        {/* 글쓴이는 '모집 마감하기', 글쓴이가 아닌 사용자는 '지원하기' */}
                        <TouchableOpacity onPress={postData.writerId === userId ? handleRecruitComplete : handleApply}
                            activeOpacity={0.7} style={{ marginTop: hp('6%'), backgroundColor: '#263159', width: wp('65%'), height: hp('8%'), justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 17, color:'white' }}>{postData.writerId === userId ? "모집 마감하기" : "지원하기"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop:hp('4%'), marginBottom:hp('1.5%'), marginRight:wp('2%')}}>
                        <TouchableOpacity activeOpacity={0.6} onPress={handleBoardShare} >
                            <Entypo name="share" size={29} color="gray" />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.6} onPress={handleScrap} style={{marginLeft:'5%'}} >
                            <FontAwesome name="bookmark-o" size={29} color={isScrap ? '#ffca1a' : 'gray'}  />
                        </TouchableOpacity>
                    </View>
                </View>) : <Loading/> }
                </View>
                {/* BOARD_DETAIL Part END */}

                {/* COMMENT Part START */}

                {/* COMMENT Part END */}
                </Pressable>
            </ScrollView>
        </View>
    )
}

export default PostDetail;