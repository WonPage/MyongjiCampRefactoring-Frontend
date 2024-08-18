/** 담당자 채윤 
 * 240622 - 글 상세보기 UI, 조회 기능 구현 완료, 댓글 조회 및 작성, 삭제 기능 구현 */
import { useEffect, useRef, useState } from "react";
import useBoard from "../../hook/useBoard";
import useUsers from "../../hook/useUsers";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { Image, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import Loading from "../(other)/Loading";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import useComment from "../../hook/useComment";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const PostDetail = ({navigation, route}) => {
    const scrollViewRef = useRef();
    const boxRef = useRef();
    const {boardId} = route.params;
    const {sessionCheck} = useUsers();
    const {getBoardDetail, checkScrap, scrap} = useBoard();
    const {getComment} = useComment();
    const [userId, setUserId] = useState();
    const [postData, setPostData] = useState();
    const [isScrap, setIsScrap] = useState();
    const [commentList, setCommentList] = useState([]);
    const [replyMode, setReplyMode] = useState(false);
    const [replyId, setReplyId] = useState();
    const [replyNickname, setReplyNickname] = useState();
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
    const refreshComment = () => {
        getComment(boardId).then(data=>{
            if (!data.isFailed){
                setCommentList(data.commentList)
            }
        })
    }
    const isFocused = useIsFocused();
    useEffect(()=>{
        if (isFocused){
            refreshBoardDetail();
            refreshComment();
        }
    },[isFocused])
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

    const handleDevelopComplete = () => {
        navigation.navigate('PostComplete', {boardId: boardId});
    }

    const handleRecruitComplete = () => {
        navigation.navigate('RecruitCompleteCheckModal', {boardId:boardId, boardData:postData});
    }
    const handleApply = () => {
        //Modal로 구현 예정
        navigation.navigate('ApplyModal', {boardId:boardId, role:postData.roleAssignments});
    }
    const handleBoardShare = () => {
        //카카오톡으로 공유하기 구현 예정
    }
    const handleScrap = () => {
        scrap(boardId).then(data=>{
            if (!data.isFailed) {
                refreshBoardDetail();
            }
        })
    }

    // 댓글 (Comment) Part
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
    const handleMoveComplete = (completeBoardId) => {
        navigation.navigate("PostCompleteDetail", {boardId: completeBoardId});
    }
    return(
        <View>
           <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps={'handled'} style={{marginBottom:hp('9%')}} contentContainerStyle={{backgroundColor: 'white'}} showsVerticalScrollIndicator={false} >
                <Pressable onPress={handleReplyModeCancle}>
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
                                <TouchableOpacity onPress={()=>{
                                    // 본인 글
                                    navigation.navigate('BoardUpdateModal', {data: postData, boardId:boardId})
                                }}>
                                    <Text>수정</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{
                                    navigation.navigate("BoardDeleteModal", {boardId:boardId});
                                }}>
                                    <Text style={{marginLeft:hp('1.5%')}}>삭제</Text>
                                </TouchableOpacity>
                            </>) : (
                                <TouchableOpacity onPress={()=>{
                                    // 다른 사용자 글
                                    navigation.navigate('ReportModal', {boardId: boardId, type: 'Post'});
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
                        {postData.status=="RECRUIT_ONGOING" ? (
                            <TouchableOpacity onPress={postData.writerId === userId ? handleRecruitComplete : handleApply}
                                activeOpacity={0.7} style={{ marginTop: hp('6%'), backgroundColor: '#263159', width: wp('65%'), height: hp('8%'), justifyContent: 'center', alignItems: 'center', borderRadius:wp(3)}}>
                                    <Text style={{ fontSize: 17, color:'white' }}>{postData.writerId === userId ? ('모집 마감하기') : ('지원하기')}</Text>
                            </TouchableOpacity>
                        ) : postData.status=="RECRUIT_COMPLETE" ? (
                            <TouchableOpacity onPress={postData.completeBoardId ? ()=>handleMoveComplete(postData.completeBoardId) : postData.writerId === userId ? handleDevelopComplete : undefined}
                                activeOpacity={0.7} style={[postData.completeBoardId ? {backgroundColor: '#263159'} : postData.writerId === userId?{backgroundColor: '#263159'}:{backgroundColor: 'lightgray'}, { marginTop: hp('6%'), width: wp('65%'), height: hp('8%'), justifyContent: 'center', alignItems: 'center', borderRadius:wp(3) }]}>
                                    <Text style={{ fontSize: 17, color:'white' }}>{postData.completeBoardId ? ("개발 완료 페이지") : postData.writerId === userId ? ('개발 완료하기') : ('지원 마감')}</Text>
                            </TouchableOpacity>
                        ) : (
                            <></>
                        )}
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop:hp('4%'), marginBottom:hp('1.5%'), marginRight:wp('2%')}}>
{/*                         <TouchableOpacity activeOpacity={0.6} onPress={handleBoardShare} >
                            <Entypo name="share" size={29} color="gray" />
                        </TouchableOpacity> */}
                        <TouchableOpacity activeOpacity={0.6} onPress={handleScrap} style={{marginLeft:'5%'}} >
                            <FontAwesome name="bookmark-o" size={29} color={isScrap ? '#ffca1a' : 'gray'}  />
                        </TouchableOpacity>
                    </View>
                </View>) : <Loading/> }
                </View>

                <Comment navigation={navigation} commentList={commentList} iconPath={iconPath} userId={userId} writerId={postData?.writerId} boardId={boardId}
                refreshComment={refreshComment} handleReply={handleReply}/>
                </Pressable>
            </ScrollView>
            <CommentPush boardId={boardId} scrollViewRef={scrollViewRef} refreshComment={refreshComment} boxRef={boxRef} replyMode={replyMode} replyId={replyId} setReplyMode={setReplyMode} setReplyId={setReplyId} replyNickname={replyNickname} setReplyNickname={setReplyNickname}/>
        </View>
    )
}

function Comment({navigation, commentList, iconPath, userId, writerId, boardId, refreshComment, handleReply}) {
    return (
        <View style={ commentList ? {borderTopWidth: 2, marginHorizontal: wp('6%'), paddingVertical:hp('1%')} : {borderTopWidth: 2, marginHorizontal: wp('6%')}}>
        {commentList.length > 0 ? commentList.map((comment) => {
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
                <View key={comment.id}>
                    <View style={{ borderRadius: wp('5%'), padding: wp('2%'), marginTop: hp('1%'), marginBottom: hp('1%') }}>
                    {comment.delete===true ? (
                        <View style={{alignItems: 'center', backgroundColor:'#F0F1F2', height:hp(9), justifyContent:'center', alignItems:'center', borderRadius:wp(5) }}>
                            <Text>삭제된 댓글입니다.</Text>
                        </View>
                        ) : (
                        <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: wp('2%'), marginRight: wp('3%'), marginTop: hp('0.5%') }}>                            
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={iconPath[comment.profileIcon]} style={{ borderRadius: 50, width: wp('7%'), height: hp('3.5%'), marginRight: wp('2%') }} />
                                <Text style={{ marginRight: wp('3%'), fontWeight: '500' }}>{comment.nickname}</Text>
                                <Text style={{ color: 'gray', fontSize: 12 }}>{diffHours < 24 ? nowFormat : longFormat}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                { comment.writerId === userId ? (<>
                                    <TouchableOpacity onPress={() => handleReply(comment.id, comment.nickname)}>
                                        <Text style={{ fontSize: 13 }}>댓글</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>navigation.navigate("CommentDeleteModal", {boardId:boardId, commentId:comment.id})}>
                                        <Text style={{ fontSize: 13, marginLeft: hp('1%') }}>삭제</Text>
                                    </TouchableOpacity></>) : writerId === userId ? (<>
                                    <TouchableOpacity onPress={() => handleReply(comment.id, comment.nickname)}>
                                        <Text style={{ fontSize: 13 }}>댓글</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('ReportModal', {commentId: comment.id, type: 'Comment'});
                                    }}>
                                        <Text style={{ fontSize: 13, marginLeft: hp('1%') }}>신고</Text>
                                    </TouchableOpacity></>) : comment.isSecret === 1 ? (
                                    <TouchableOpacity onPress={() => handleReply(comment.id, comment.nickname)}>
                                        <Text style={{ fontSize: 13 }}>댓글</Text>
                                    </TouchableOpacity>) : (<>
                                    <TouchableOpacity onPress={() => handleReply(comment.id, comment.nickname)}>
                                        <Text style={{ fontSize: 13 }}>댓글</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('ReportModal', {commentId: comment.id, type: 'Comment'});
                                    }}>
                                        <Text style={{ fontSize: 13, marginLeft: hp('1%') }}>신고</Text>
                                    </TouchableOpacity></>)}
                            </View>
                        </View>
                        {comment.writerId===userId||writerId === userId||comment.isSecret === 0 ? (
                            <Text style={{ margin: hp('1%') }}>{comment.content}</Text>
                        ) : (
                            <Text style={{ margin: hp('1%'), color: "#BBBBBB" }}>비밀 댓글입니다.</Text>
                        )}
                        </>
                    )}
                    </View>
                    {comment.children.map((comm) => (
                        <View key={comm.id} style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: hp('1%'), }}>
                            <Feather style={{ marginLeft: wp('5%'), marginTop: hp('1%') }} name="corner-down-right" size={20} color="black" />
                            <View style={{ backgroundColor: '#F0F1F2', borderRadius: wp('5%'), padding: wp('2%'), marginLeft: wp('3%'), flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: wp('2%'), marginRight: wp('4%'), marginTop: hp('0.5%') }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={iconPath[comm.profileIcon]} style={{ borderRadius: wp('7%'), width: wp('7%'), height: hp('3.5%'), marginRight: wp('2%') }} />
                                        <Text style={{ marginRight: wp('3%'), fontWeight: '500' }}>{comm.nickname}</Text>
                                        <Text style={{ color: 'gray', fontSize: 12 }}>{diffHours < 24 ? nowFormat : longFormat}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                    { userId === comm.writerId ? (
                                        <TouchableOpacity onPress={()=>navigation.navigate("CommentDeleteModal", {boardId:boardId, commentId:comm.id})}>
                                            <Text style={{ fontSize: 13, marginLeft: hp('1%') }}>삭제</Text>
                                        </TouchableOpacity>) :
                                    userId === writerId ? (
                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate('ReportModal', {commentId: comm.id, type: 'Comment'});
                                        }}>
                                            <Text style={{ fontSize: 13, marginLeft: hp('1%') }}>신고</Text>
                                        </TouchableOpacity>) : 
                                    comm.isSecret === 1 ? (<View></View>) : (
                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate('ReportModal', {commentId: comm.id, type: 'Comment'});
                                        }}>
                                            <Text style={{ fontSize: 13, marginLeft: hp('1%') }}>신고</Text>
                                        </TouchableOpacity>)}
                                    </View>
                                </View>
                                {comm.writerId === userId || writerId === userId || comm.isSecret === 0 ? (
                                    <Text style={{ margin: hp('1%') }}>{comm.content}</Text>
                                ) : (
                                    <Text style={{ margin: hp('1%'), color: "#BBBBBB" }}>비밀 댓글입니다.</Text>
                                )}
                            </View>
                        </View>
                    )) }
                </View>
            )}) : (
            <View style={{ marginVertical: hp('1%'), justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightgray', borderRadius: 15, height: hp('10%') }}>
                <Text style={{ fontSize: 16, color: 'gray' }}>댓글이 존재하지 않습니다.</Text>
            </View>
            )}
    </View>
    )
}

function CommentPush({boardId, scrollViewRef, replyMode, replyId, setReplyMode, setReplyId, replyNickname, setReplyNickname, boxRef, refreshComment}){
    const [comment, setComment] = useState('');
    const [isSecret, setIsSecret] = useState(false);
    const {writeComment} = useComment();
    const handleCommentSubmit = () => {
        writeComment(boardId, comment, (replyMode===true?1:0), isSecret, (replyId?replyId:undefined))
        .then(response=>{
            if (!response.isFailed) {
                setComment(''); // 댓글 작성 후 입력창 초기화
                setReplyMode(undefined);
                setReplyId(undefined);
                setReplyNickname(undefined);
                refreshComment();
            }
        })
        .finally(()=>{
            scrollViewRef.current.scrollToEnd({ animated: true });
        })
    }
    useEffect(()=>{
        setComment('');
    },[replyMode])
    return (
        <>
        {replyMode ? (
                <View style={[styles.comment_push_container]}>
                <BouncyCheckbox innerIconStyle={{ borderRadius: wp('0.5%'), width: wp('4%'), height: wp('4%') }} iconStyle={{ borderRadius: wp('1%'), width: wp('6%'), height:wp('6%') }}
                    isChecked={isSecret} onPress={(isChecked) => setIsSecret(isChecked)} fillColor="#495579"/>
                <Text onPress={()=>setIsSecret(!isSecret)} style={{color:'gray', textAlignVertical:'center', marginLeft:wp('-4%'), marginRight:wp('2%'), fontSize:12}}>비밀</Text>
                <TextInput style={{ paddingHorizontal: wp('3%'), width:wp(56), fontSize: 16, backgroundColor: 'lightgray', borderRadius: wp('3%'), marginRight: wp('4%') }}
                    value={comment} onChangeText={setComment} ref={boxRef} placeholder={replyMode ? `@${replyNickname}` : undefined} />
                <TouchableOpacity activeOpacity={0.8} onPress={handleCommentSubmit}
                    style={{ width: wp('13%'),backgroundColor: '#002E66', alignItems: 'center', justifyContent: 'center', borderRadius: wp('2%')}}>
                    <Text style={{ color: 'white' }}>대댓</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <View style={[styles.comment_push_container]}>
                <BouncyCheckbox innerIconStyle={{ borderRadius: wp('0.5%'), width: wp(4), height: wp(4) }} iconStyle={{ borderRadius: wp('1%'), width: wp('6%'), height:wp(6) }}
                    isChecked={isSecret} onPress={(isChecked) => setIsSecret(isChecked)} fillColor="#495579"/>
                <Text onPress={()=>setIsSecret(!isSecret)} style={{color:'gray' ,textAlignVertical:'center', marginLeft:wp('-4%'), marginRight:wp('2%'), fontSize:12}}>비밀</Text>
                <TextInput style={{ paddingHorizontal: wp('3%'), width:wp(56), fontSize: 16, backgroundColor: 'lightgray', borderRadius: wp('3%'), marginRight: wp('4%') }}
                    value={comment} onChangeText={setComment} ref={boxRef} placeholder={replyMode ? `@${replyNickname}` : undefined} />
                <TouchableOpacity activeOpacity={0.8} onPress={handleCommentSubmit}
                    style={{ width: wp('13%'),backgroundColor: '#002E66', alignItems: 'center', justifyContent: 'center', borderRadius: wp('2%')}}>
                    <Text style={{ color: 'white' }}>작성</Text>
                </TouchableOpacity>
            </View>
        )}
        </>
    )
}
const styles = StyleSheet.create({
    comment_push_container: {
        paddingVertical:hp('1.1%'), marginLeft:wp(3), marginRight:wp(3),
        borderWidth:2, borderColor:'gray', borderRadius: wp('5%'),
        paddingHorizontal:wp('3%'), backgroundColor:'white',
        position: 'absolute', bottom:0, justifyContent:'space-between',
        flexDirection:'row', height:hp('9%')
    },
})
export default PostDetail;