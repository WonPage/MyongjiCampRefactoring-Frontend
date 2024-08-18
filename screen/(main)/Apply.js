/** 담당자 채윤 
 * 240618 - 지원현황 페이지 UI 디자인 완료 
 * 240811 - */ 
import { useEffect, useState } from "react";
import useUsers from "../../hook/useUsers";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import useApply from "../../hook/useApply";
import { ScrollView, Text, Touchable, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Entypo, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

const Apply = ({navigation, route}) => {
    const {sessionCheck} = useUsers();
    useFocusEffect(()=>{
        sessionCheck(route);
    })
    const {getAppliedResume, getReceivedResume, getResumeDetail, getReceivedResumeList, getMyCompleteBoardList} = useApply();
    const [appliedResume, setAppliedResume] = useState([]);
    const [receivedResume, setReceivedResume] = useState([]);
    const [completeList, setCompleteList] = useState([]);
    const getResumes = () => {
        getAppliedResume().then(res => {
            setAppliedResume(res.data);
        });
        getReceivedResume().then(res => {
            setReceivedResume(res.data);
        })
        getMyCompleteBoardList().then(result=>{
            setCompleteList(result);
        })
    } 
    const isFocused = useIsFocused();
    useEffect(()=>{
        if (isFocused){
            getResumes();
        }
    },[isFocused])
    const handleShowResume = (resumeId) => {
        getResumeDetail(resumeId)
        .then(res =>{
            navigation.navigate('SentResumeModal', {data: res});
        })
    }
    const handleShowMessage = (resumeId) => {
        getResumeDetail(resumeId)
        .then(res =>{
            navigation.navigate('ApplyFinalProcessModal', {data: res.data});
        })
    }
    const handleReceivedResumeList = (boardId) => {
        getReceivedResumeList(boardId)
        .then(res => {
            navigation.navigate('ReceivedResumeModal', {data:res.data, boardId:boardId});
        })
    }
    const handleCompleteDevelop = (boardId) => {
        navigation.navigate('PostDetail', {boardId: boardId, title:'모집 완료'});
    }
    const getDateFormat = (dates) => {
        const date = new Date(dates);      
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const newMonth = month.toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const dateFormat = `${year}.${newMonth}.${day}`
        return dateFormat;
    }
    return (
        <View style={{flex:1, backgroundColor:'#FFFBEB'}}>
            <ScrollView contentContainerStyle={{marginLeft:'5%', paddingBottom:'5%'}}>
                <Text style={{fontSize:27, fontWeight:'300', marginTop:hp('4%'), marginBottom:hp('2%'), color:'#251749'}}>내가 지원한 글</Text>
                {appliedResume.length==0 ? (
                    <View style={{width:wp(70), height:hp(13), backgroundColor:'#495579', borderRadius:15, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'white', fontSize:16}}>지원한 글이 없습니다.</Text>
                    </View>
                ) : (
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {appliedResume?.map((resume, index) => {
                            const dateFormat = getDateFormat(resume.applycreatedDate);
                            return (
                            <View key={index} style={{width:wp('50%'), height:hp('24%'), backgroundColor:'#495579',borderRadius:10, padding:11, justifyContent:'space-between', marginRight:wp('5%')}}>
                                <View>
                                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <View style={{backgroundColor:'#251749', borderRadius:10, justifyContent:'center', alignItems:'center', width:wp('13%'), height:hp('3%'), paddingBottom:hp('0.5%')}}>
                                            <Text style={{color:'white', fontSize:13}}>{
                                                resume.firstStatus==='PENDING' ? "대기 중" :
                                                resume.firstStatus==='ACCEPTED' ?  (
                                                    resume.finalStatus === "PENDING" ? "승인" :
                                                    resume.finalStatus === "ACCEPTED" ? "수락" :
                                                    resume.finalStatus === 'REJECTED' ? "거절" : undefined
                                                ) :
                                                resume.firstStatus==="REJECTED" ? (
                                                    resume.finalStatus === 'PENDING' ? '미승인' : undefined
                                                ) :
                                                resume.firstStatus==='DELETED' ? "삭제됨" : undefined}</Text>
                                        </View>
                                        <View style={{flexDirection:'row', alignItems:'center'}}>
                                            <Text style={{fontSize:13, color:'#FFFBEB'}}>{dateFormat}</Text>
                                            <TouchableOpacity onPress={()=>navigation.navigate("ApplyMenuModal", {boardId: resume.boardId})}>
                                                <Entypo style={{marginLeft: wp('1%')}} name="dots-three-vertical" size={15} color="#FFFBEB" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={()=>navigation.navigate("PostDetail", {boardId:resume.boardId, title:"지원한 글"})}>
                                        <Text style={{fontSize:27, marginTop:hp('0.5%'), color:'#FFFBEB'}}>{resume.boardTitle}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{justifyContent:'center', alignItems:'center'}}>
                                    <TouchableOpacity onPress={resume.firstStatus==='PENDING' ? ()=>{handleShowResume(resume.applicationId)} : ()=>{handleShowMessage(resume.applicationId)}}
                                    style={{flexDirection:'row', backgroundColor:'#251749', paddingHorizontal:20, paddingVertical:9, borderRadius:20}}>
                                        <Text style={{fontSize:18, marginRight:5, color:'white', marginTop:hp('-0.2')}}>{resume.firstStatus === 'PENDING' ? '보낸 이력서' : '메세지 확인'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )})}
                    </ScrollView>
                )}
                <Text style={{fontSize:27, fontWeight:'300', marginTop:hp('5%'), marginBottom:hp('2%'), color:'#251749'}}>내가 작성한 글</Text>
                {receivedResume.length==0 ? (
                    <View style={{width:wp(70), height:hp(13), backgroundColor:'#495579', borderRadius:15, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'white', fontSize:16}}>작성한 글이 없습니다.</Text>
                    </View>
                ) : (
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>                 
                        {receivedResume?.map((resume, index) => {
                            const dateFormat = getDateFormat(resume.boardcreatedDate);
                            return (
                            <View key={index} style={{width:wp('50%'), height:hp('24%'), marginRight:wp('5%'), backgroundColor:'#495579',borderRadius:10, padding:11, justifyContent:'space-between'}}>
                                <View>
                                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <View style={{backgroundColor:'#251749', borderRadius:10, justifyContent:'center', alignItems:'center', width:wp('15%'), height:hp('3%'), paddingBottom:hp('0.5%')}}>
                                            <Text style={{color:'white', fontSize:12}}>{
                                            resume.recruitStatus === 'RECRUIT_ONGOING' ? '모집 중':
                                            resume.recruitStatus === 'RECRUIT_COMPLETE' ? '모집 완료': undefined}</Text>
                                        </View>
                                        <View style={{flexDirection:'row', alignItems:'center'}}>
                                            <Text style={{fontSize:13, color:'#FFFBEB'}}>{dateFormat}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={()=>navigation.navigate("PostDetail", {boardId:resume.boardId, title:resume.recruitStatus==='RECRUIT_ONGOING' ? '모집 중':resume.recruitStatus === 'RECRUIT_COMPLETE' ? '모집 완료': undefined})}>
                                        <Text style={{fontSize:27, marginTop:3,color:'#FFFBEB'}} ellipsizeMode="tail" numberOfLines={2}>{resume.boardTitle}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{justifyContent:'center', alignItems:'center'}}>
                                    {resume.recruitStatus === 'RECRUIT_ONGOING' ? (
                                        <TouchableOpacity onPress={()=>handleReceivedResumeList(resume.boardId)}
                                        style={{flexDirection:'row', backgroundColor:'#251749', paddingHorizontal:20, paddingVertical:9, borderRadius:20, justifyContent:'center'}}>
                                            <Text style={{fontSize:18, marginRight:5, color:'white', justifyContent:'center', marginTop:hp('-0.2')}}>받은 이력서</Text>
                                            <Text style={{fontSize:18, color:'skyblue'}}>{resume.num}</Text>
                                        </TouchableOpacity>
                                    ):
                                    resume.recruitStatus === 'RECRUIT_COMPLETE' ? (
                                        <TouchableOpacity onPress={()=>handleCompleteDevelop(resume.boardId)}
                                        style={{flexDirection:'row', backgroundColor:'#251749', paddingHorizontal:20, paddingVertical:9, borderRadius:20, justifyContent:'center'}}>
                                            <Text style={{fontSize:18, marginRight:5, color:'white', justifyContent:'center', marginTop:hp('-0.2')}}>완료하러 가기</Text>
                                        </TouchableOpacity>
                                    ):(<></>)}
                                </View>
                            </View>
                        )})}
                    </ScrollView>
                )}
                <Text style={{fontSize:27, fontWeight:'300', marginTop:hp('5%'), marginBottom:hp('2%'), color:'#251749'}}>개발 완료한 글</Text>
                {completeList.length==0 ? (
                    <View style={{width:wp(70), height:hp(13), backgroundColor:'#495579', borderRadius:15, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'white', fontSize:16}}>작성한 글이 없습니다.</Text>
                    </View>
                ) : (
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>                 
                        {completeList?.map((board, index) => {
                            const dateFormat = getDateFormat(board.modifiedDate);
                            return (
                            <View key={index} style={{width:wp('50%'), height:hp('24%'), marginRight:wp('5%'), backgroundColor:'#495579',borderRadius:10, padding:11, justifyContent:'space-between'}}>
                                <View>
                                    <View style={{}}>
                                        <Text style={{fontSize:13, color:'#FFFBEB'}}>{dateFormat}</Text>
                                    </View>
                                    <TouchableOpacity onPress={()=>navigation.navigate("PostCompleteDetail", {boardId:board.boardId})}>
                                        <Text style={{fontSize:27, marginTop:3,color:'#FFFBEB'}} ellipsizeMode="tail" numberOfLines={2}>{board.title}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{justifyContent:'flex-end', alignItems:'white', flexDirection:'row'}}>
                                    <MaterialCommunityIcons name="comment-outline" size={23} color="white" />
                                    <Text style={{marginLeft:hp('0.3%'), color:'white'}}>{board.commentCount}</Text>
                                    <FontAwesome name="bookmark-o" size={23} color="white" style={{marginLeft:hp('1.5%')}}/>
                                    <Text style={{marginLeft:hp('0.5%'), color:'white'}}>{board.scrapCount}</Text>
                                </View>
                            </View>
                        )})} 
                    </ScrollView>
                )}
            </ScrollView>
        </View>
    )
}

export default Apply;