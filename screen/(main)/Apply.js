/** 담당자 채윤 
 * 240618 - 지원현황 페이지 UI 디자인 완료 
 * 240811 - */ 
import { useEffect, useState } from "react";
import useUsers from "../../hook/useUsers";
import { useFocusEffect } from "@react-navigation/native";
import useApply from "../../hook/useApply";
import { ScrollView, Text, Touchable, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Entypo } from "@expo/vector-icons";

const Apply = ({navigation, route}) => {
    const {sessionCheck} = useUsers();
    useFocusEffect(()=>{
        sessionCheck(route);
    })
    const {getAppliedResume, getReceivedResume, getResumeDetail, getReceivedResumeList} = useApply();
    const [appliedResume, setAppliedResume] = useState([]);
    const [receivedResume, setReceivedResume] = useState([]);
    const getResumes = () => {
        getAppliedResume().then(res => {
            setAppliedResume(res.data);
        });
        getReceivedResume().then(res => {
            setReceivedResume(res.data);
        })
    } 
    useEffect(()=>{
        getResumes();
    },[])
    const handleShowResume = (resumeId) => {
        getResumeDetail(resumeId)
        .then(res =>{
            navigation.navigate('ModalLayout', {component:'ResumeDetail', title:'지원한 이력서', data:res.data});
        })
    }
    const handleReceivedResumeList = (boardId) => {
        getReceivedResumeList(boardId)
        .then(res => {
            navigation.navigate('ModalLayout', {component:'ResumeList', data:{data:res.data, boardId:boardId}});
        })
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
            <ScrollView contentContainerStyle={{marginLeft:'5%'}}>
                <Text style={{fontSize:27, fontWeight:'300', marginTop:hp('4%'), marginBottom:hp('2%'), color:'#251749'}}>내가 지원한 글</Text>
                {appliedResume.length==0 ? (
                    <View style={{width:wp(70), height:hp(13), backgroundColor:'#495579', borderRadius:15, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'white', fontSize:16}}>지원한 글이 없습니다.</Text>
                    </View>
                ) : (
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {appliedResume?.map((resume, index) => {
                            const dateFormat = getDateFormat(resume.applyCreateDate);
                            // console.log(resume);
                            return (
                            <View key={index} style={{width:wp('50%'), height:hp('24%'), backgroundColor:'#495579',borderRadius:10, padding:11, justifyContent:'space-between'}}>
                                <View>
                                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <View style={{backgroundColor:'#251749', borderRadius:10, justifyContent:'center', alignItems:'center', width:wp('13%'), height:hp('3%'), paddingBottom:hp('0.5%')}}>
                                            <Text style={{color:'white', fontSize:13}}>{
                                            resume.firstStatus === 'PENDING' ? '대기중':
                                            resume.firstStatus === 'ACCEPTED' ? '승인':
                                            resume.firstStatus === 'REJECTED' ? '거절':
                                            resume.firstStatus === 'DELETED' ? '삭제됨' : undefined}</Text>
                                        </View>
                                        <View style={{flexDirection:'row', alignItems:'center'}}>
                                            <Text style={{fontSize:13, color:'#FFFBEB'}}>{dateFormat}</Text>
                                            <TouchableOpacity onPress={()=>navigation.navigate("ApplyMenuModal", {boardId: resume.boardId, callback: getResumes})}>
                                                <Entypo style={{marginLeft: wp('1%')}} name="dots-three-vertical" size={15} color="#FFFBEB" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={()=>navigation.navigate("PostDetail", {boardId:resume.boardId, title:"모집 중"})}>
                                        <Text style={{fontSize:27, marginTop:hp('0.5%'), color:'#FFFBEB'}}>{resume.boardTitle}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{justifyContent:'center', alignItems:'center'}}>
                                    <TouchableOpacity onPress={resume.firstStatus==='PENDING' ? ()=>{handleShowResume(resume.applicationId)} : ()=>{handleShowMessage(resume.resultContent)}}
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
                            // console.log(resume);
                            const dateFormat = getDateFormat(resume.boardcreatedDate);
                            return (
                            <View key={index} style={{width:wp('50%'), height:hp('24%'), marginRight:wp('5%'), backgroundColor:'#495579',borderRadius:10, padding:11, justifyContent:'space-between'}}>
                                <View>
                                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <Text>{resume.firstStatus}</Text>
                                        <View style={{flexDirection:'row', alignItems:'center'}}>
                                            <Text style={{fontSize:13, color:'#FFFBEB'}}>{dateFormat}</Text>
                                            <TouchableOpacity>
                                                <Entypo style={{marginLeft:3}} name="dots-three-vertical" size={17} color="#FFFBEB" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={()=>navigation.navigate("PostDetail", {boardId:resume.boardId, title:"내 게시글"})}>
                                        <Text style={{fontSize:27, marginTop:3,color:'#FFFBEB'}} ellipsizeMode="tail" numberOfLines={2}>{resume.boardTitle}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{justifyContent:'center', alignItems:'center'}}>
                                    <TouchableOpacity onPress={()=>handleReceivedResumeList(resume.boardId)}
                                    style={{flexDirection:'row', backgroundColor:'#251749', paddingHorizontal:20, paddingVertical:9, borderRadius:20, justifyContent:'center'}}>
                                        <Text style={{fontSize:18, marginRight:5, color:'white', justifyContent:'center', marginTop:hp('-0.2')}}>받은 이력서</Text>
                                        <Text style={{fontSize:18, color:'skyblue'}}>{resume.num}</Text>
                                    </TouchableOpacity>
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