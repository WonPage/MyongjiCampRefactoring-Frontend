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

    const handleRecruitComplete = () => {
        //마감하시겠습니까? 라는 선택창 나오기
    }
    const handleApply = () => {
        //Modal로 구현 예정
    }
    const handleBoardShare = () => {
        //카카오톡으로 공유하기 구현 예정
    }
    const handleScrap = () => {}

    /** 댓글 (Comment) Part */
    const [commentList, setCommentList] = useState([]);
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
                <View style={ commentList ? {borderTopWidth: 2, marginHorizontal: wp('6%'), paddingVertical:hp('1%')} : {borderTopWidth: 2, marginHorizontal: wp('6%')}}>
                    {commentList.length !== 0 ? commentList.map((comment, index) => {
                        const date = new Date(comment.commentCreateDate);
                        const currentDate = new Date();
                        const diffTime = Math.abs(currentDate - date);
                        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
                        const year = date.getFullYear();
                        const month = date.getMonth() + 1;
                        const day = date.getDate();
                        const hours = date.getHours().toString().padStart(2, '0');
                        const minutes = date.getMinutes().toString().padStart(2, '0');
                        const longFormat = `${year}.${month}.${day}`
                        const nowFormat = `${hours}:${minutes}`
                        return (
                            <View key={index}>
                                <View style={{ borderRadius: wp('5%'), padding: wp('2%'), marginTop: hp('1%'), marginBottom: hp('-1.5%') }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: '2%', marginRight: '3%', marginTop: hp('0.5%') }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {/* <Image source={require(`../../../assets/icon/profile-icon-${comment.profileIcon}.png`)}/> */}
                                            <Image source={iconPath[comment.profileIcon]} style={{ borderRadius: 50, width: hp('3.5%'), height: hp('3.5%'), marginRight: hp('1%') }} />
                                            <Text style={{ marginRight: hp('1.5%'), fontWeight: '500' }}>{comment.nickname}</Text>
                                            <Text style={{ color: 'gray', fontSize: 12 }}>{diffHours < 24 ? nowFormat : longFormat}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            { // 사용자가 댓글 작성자인 경우
                                                userId === comment.writerId ? (<>
                                                    <TouchableOpacity onPress={() => handleReply(comment.id, comment.nickname)}>
                                                        <Text style={{ fontSize: 13 }}>댓글</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={async () => {
                                                        navigation.navigate('ModalLayout', { component: 'SelectAlert', title: '안내', message: '정말로 삭제하시겠습니까?', action: 'deleteComment', data: { boardId: boardId, commentId: comment.id } });
                                                    }}>
                                                        <Text style={{ fontSize: 13, marginLeft: hp('1%') }}>삭제</Text>
                                                    </TouchableOpacity>
                                                </>) :
                                                    // 사용자가 게시글 작성자인 경우
                                                    userId === writerId ? (<>
                                                        <TouchableOpacity onPress={() => handleReply(comment.id, comment.nickname)}>
                                                            <Text style={{ fontSize: 13 }}>댓글</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => {
                                                            setTargetId(comment.id);
                                                            setReportType('Comment');
                                                            setReportModalVisible(true);
                                                        }}>
                                                            <Text style={{ fontSize: 13, marginLeft: hp('1%') }}>신고</Text>
                                                        </TouchableOpacity>
                                                    </>) : comment.isSecret === 1 ? (<>
                                                        <TouchableOpacity onPress={() => handleReply(comment.id, comment.nickname)}>
                                                            <Text style={{ fontSize: 13 }}>댓글</Text>
                                                        </TouchableOpacity>
                                                    </>) : (<>
                                                        <TouchableOpacity onPress={() => handleReply(comment.id, comment.nickname)}>
                                                            <Text style={{ fontSize: 13 }}>댓글</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => {
                                                            setTargetId(comment.id);
                                                            setReportType('Comment');
                                                            setReportModalVisible(true);
                                                        }}>
                                                            <Text style={{ fontSize: 13, marginLeft: hp('1%') }}>신고</Text>
                                                        </TouchableOpacity>
                                                    </>)}
                                        </View>
                                    </View>
                                    {userId === comment.writerId || userId === writerId || comment.isSecret === 0 ? (
                                        <Text style={{ margin: hp('1%') }}>{comment.content}</Text>
                                    ) : (
                                        <Text style={{ margin: hp('1%'), color: "#BBBBBB" }}>비밀 댓글입니다.</Text>
                                    )}
                                </View>
                                {comment.children.map((comment, index) => (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: hp('1%'), }}>
                                        <Feather style={{ marginLeft: '5%', marginTop: hp('1%') }} name="corner-down-right" size={20} color="black" />
                                        <View style={{ backgroundColor: '#F0F1F2', borderRadius: 15, padding: 5, marginLeft: '3%', flex: 1 }}>
                                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: '2%', marginRight: '4%', marginTop: hp('0.5%') }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    {/* <Image source={require(`../../../assets/icon/profile-icon-${comment.profileIcon}.png`)}/> */}
                                                    <Image source={iconPath[comment.profileIcon]} style={{ borderRadius: 50, width: hp('3.5%'), height: hp('3.5%'), marginRight: hp('1%') }} />
                                                    <Text style={{ marginRight: hp('1.5%'), fontWeight: '500' }}>{comment.nickname}</Text>
                                                    <Text style={{ color: 'gray', fontSize: 12 }}>{diffHours < 24 ? nowFormat : longFormat}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    { //사용자가 댓글 작성자 일 때 
                                                        userId === comment.writerId ? (<>
                                                            <TouchableOpacity onPress={async () => {
                                                                navigation.navigate('ModalLayout', { component: 'SelectAlert', title: '안내', message: '정말로 삭제하시겠습니까?', action: 'deleteComment', data: { boardId: boardId, commentId: comment.id } });
                                                            }}>
                                                                <Text style={{ fontSize: 13, marginLeft: hp('1%') }}>삭제</Text>
                                                            </TouchableOpacity>
                                                        </>) :
                                                            // 사용자가 게시글 작성자 일 때
                                                            userId === writerId ? (<>
                                                                <TouchableOpacity onPress={() => {
                                                                    setTargetId(comment.id);
                                                                    setReportType('Comment');
                                                                    setReportModalVisible(true);
                                                                }}>
                                                                    <Text style={{ fontSize: 13, marginLeft: hp('1%') }}>신고</Text>
                                                                </TouchableOpacity>
                                                            </>) :
                                                                // 댓글이 비밀댓글이면 (그 외 사용자에게 사용)
                                                                comment.isSecret === 1 ? (<>
                                                                </>
                                                                ) :
                                                                    // 댓글이 공개댓글이면 (그 외 사용자에게 사용)
                                                                    (<>
                                                                        <TouchableOpacity onPress={() => {
                                                                            setTargetId(comment.id);
                                                                            setReportType('Comment');
                                                                            setReportModalVisible(true);
                                                                        }}>
                                                                            <Text style={{ fontSize: 13, marginLeft: hp('1%') }}>신고</Text>
                                                                        </TouchableOpacity>
                                                                    </>)}
                                                </View>
                                            </View>
                                            { // 사용자가 댓글 작성자거나 게시글 작성자이거나 비밀댓글이 아닌 경우
                                                userId === comment.writerId || userId === writerId || comment.isSecret === 0 ? (
                                                    <Text style={{ margin: hp('1%') }}>{comment.content}</Text>
                                                ) :
                                                    // 댓글이 비밀댓글인지 (비밀댓글이면서 댓글,게시글 작성자도 아님)
                                                    (
                                                        <Text style={{ margin: hp('1%'), color: "#BBBBBB" }}>비밀 댓글입니다.</Text>
                                                    )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )
                    }) : (
                        <View style={{ marginVertical: hp('1%'), justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightgray', borderRadius: 15, height: hp('10%') }}>
                            <Text style={{ fontSize: 16, color: 'gray' }}>댓글이 존재하지 않습니다.</Text>
                        </View>
                    )}
                </View>
                {/* COMMENT Part END */}
                </Pressable>
            </ScrollView>
        </View>
    )
}

export default PostDetail;