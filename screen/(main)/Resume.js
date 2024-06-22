/** 담당자 채윤 
 * 240618 - 이력서 목록, 상세보기 페이지 UI 및 기능 구현 완료 */
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useResume from "../../hook/useResume";
import { Ionicons } from "@expo/vector-icons";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const Resume = ({navigation}) => {
    const [resumeList, setResumeList] = useState(null);
    const {getResumeList} = useResume();
    useFocusEffect(()=>{
        getResumeList().then(resumes=>{
            setResumeList(resumes);
        })
    })
    const handleResumeAdd = () => {
        navigation.navigate('ResumeAddModal');
    }
    return(
        <View style={{ flex: 1, backgroundColor:'white' }}>
            <View style={styles.notice_container}>
                <Ionicons name="megaphone-outline" size={24} color="black" />
                <Text>이력서는 최대 3개 저장할 수 있습니다.</Text>
            </View>
            <View style={styles.resume_container}>
            <FlatList data={resumeList} style={{marginHorizontal: hp('3%')}} contentContainerStyle={styles.resume_item_container}
                ListFooterComponent={resumeList === null || resumeList?.length>=3 ? ( <></> ) : (<TouchableOpacity style={[styles.resume_add_button, {marginTop: hp('5%'), borderColor:'#495579', borderWidth:2}]} onPress={handleResumeAdd}><Text style={{color:'#495579', fontWeight:500}}>+ 이력서 추가하기</Text></TouchableOpacity>)}
                ItemSeparatorComponent={<View style={{height:hp('6%')}}></View>}
                renderItem={({ item }) => <ResumeItem title={item.title} createDate={item.createDate} id={item.id} setResumeList={setResumeList}/>} />
            </View>
        </View>
    )
}

const ResumeItem = ({ title, createDate, id, setResumeList }) => {
    const navigation = useNavigation();
    const date = new Date(createDate);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const vintageDate = `${year}.${month}.${day}`
    const formattedDate = `${month}월 ${day}일 ${hours}:${minutes}`
    const {getResumeDetail,deleteResume} = useResume();
    const handleResumeDetail = async(resumeId) => {
        getResumeDetail(resumeId).then(result=>{
            navigation.navigate('ResumeDetailModal', {data:result});
        })
    }
    const handleResumeUpdate = async(resumeId) => {
        getResumeDetail(resumeId).then(result=>{
            navigation.navigate('ResumeUpdateModal', {data:result});
        })
    }
    const handleResumeDelete = async(resumeId) => {
        deleteResume(resumeId)
    }
    return (
        <View style={[styles.resume_item, {height:hp('20%'), paddingHorizontal:wp('5%'), paddingTop:hp('2%'), paddingBottom:hp('2%')}]}>
        <TouchableOpacity style={{flex:1, justifyContent:'space-between'}} onPress={()=>{handleResumeDetail(id)}}>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal: hp('1%')}}>
                <Text style={{fontSize:23, justifyContent:'space-between', color:'#FFFBEB'}}>{title}</Text>
                <View style={{alignItems: 'center'}}>
                    <Text style={{fontSize: 13, color:'#FFFBEB'}}>최종 수정일</Text>
                    <Text style={{fontSize: 11, color:'#FFFBEB'}}>{currentYear>year ? vintageDate : formattedDate}</Text>
                </View>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                <TouchableOpacity style={styles.resume_button} onPress={()=>{handleResumeUpdate(id)}}>
                    <Text style={{color:'#FFFBEB'}}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resume_button} onPress={() => {handleResumeDelete(id)}}>
                    <Text style={{color:'#FFFBEB'}}>삭제</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    notice_container: {
        flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    },
    resume_container: {
        flex: 7,
    },
    resume_item_container: {
    },
    resume_add_button: {
        backgroundColor:'white', height:hp('7%'), alignItems:'center', justifyContent:'center', marginHorizontal: '25%', borderRadius:30, borderWidth: 1,
    },
    resume_item: {
        borderRadius: 7,
        backgroundColor:'#495579'
    },
    resume_button: {
        borderRadius: 14,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor:'#251749',
        height:hp('5.5%'), width:wp('37%')
    }
})

export default Resume;