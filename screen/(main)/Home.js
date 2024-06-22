import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import useHome from "../../hook/useHome";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Loading from "../(other)/Loading";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

export default function OnGoing(){
    return Home([0,'DESC','recruit','ongoing'])
} 
export function Complete(){
    return Home([0,'DESC','recruit','complete'])

}

function Home(recruitForm){
    const navigation = useNavigation();
    const [recruitList, setRecruitList] = useState([]);
    // null일 때 로딩창 0개일 때 게시글 없다 1개 이상일 때 게시글
    const[page, setPage] = useState(0);
    const[buttonVisible, setButtonVisible] = useState(true)
    const {getRecruitList} = useHome();
    
    useEffect(()=>{
        recruitForm[0] = page
        getRecruitList(recruitForm).then(recruits=>{
            let tmp = null;
            console.log('page', page)
            if(page === 0){
                tmp = recruits;
            }
            else{
               tmp = [...recruitList];
               tmp = tmp.concat(recruits);
            }
            setRecruitList(tmp)
        })
    },[page]) 


    const handleMoreButton = () => {
        let next = recruitForm
        next[0] = page+1
        getRecruitList(next).then(recruits=>{
            if(recruits.length > 1){
                setPage(page+1);
            }
            else{
                setButtonVisible(false)
            } 
        })
    }

    return(
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicato={false}>
                {recruitList ? recruitList.map((item, index)=>{
                   console.log('item',item)
                    const date = new Date(item?.modifiedDate);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;
                    const newMonth = month.toString().padStart(2,'0');
                    const day = date.getDate().toString().padStart(2,'0');
                    const hours = date.getHours().toString().padStart(2,'0');
                    const minutes = date.getMinutes().toString().padStart(2,'0');
                    const dateFormat = `${year}.${newMonth}.${day}  ${hours}:${minutes}`
                    return(
                    //    여기에 onPress로 상세게시글 가야됨 
                    <TouchableOpacity activeOpacity={0.5} key={index} onPress={()=>navigation.navigate('PostDetail', {boardId: item.boardId, title: recruitForm[3]==='ongoing'?'모집 중':'모집 완료'})} >
                    <View style={{ borderRadius: 10, height:hp('22%'), marginBottom:hp('1.5%'), elevation:1,
                    backgroundColor:'white', padding:hp('1.5%'), justifyContent:'space-between'}}>
                        <View>
                            <View style={{flexDirection:'row', marginBottom:hp('0.3%')}}>
                                {item.roles.map((role, index)=>{
                                    let roleName = '';
                                    if (role === 'BACK') roleName = '백엔드';
                                    else if (role === 'FRONT') roleName = '프론트엔드';
                                    else if (role === 'DESIGN') roleName = '디자인';
                                    else if (role === 'FULL') roleName = '풀스택';
                                    else if (role === 'PM') roleName = '기획';
                                    else roleName = role.toString();
                                    return (
                                    <View key={index} style={[{borderRadius:15, paddingVertical:2, paddingHorizontal:4,marginRight:hp('0.5%')},
                                    role=='BACK'? {backgroundColor:'#8FCACA'}: role=='FRONT' ? {backgroundColor:'#FFAEA5'} :
                                    role=='DESIGN' ? {backgroundColor:'#EFD0B2'}: role=='PM' ? {backgroundColor:'#CBAACB'} :
                                    role=='AI' ? {backgroundColor: '#F3B0C3'}: role=='FULL' ? {backgroundColor:'#B6CFB6'} : {backgroundColor: '#AFAFAF'}]}>
                                        <Text style={{fontSize:12, color:'white', fontWeight:'500'}}>{` ${roleName} `}</Text>
                                    </View>
                                )})}
                            </View>
                            <View>
                                <Text style={{fontSize:25}}>{item.title}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            <Text>{dateFormat}</Text>
                            <View style={{flexDirection:'row'}}>
                                <MaterialCommunityIcons name="comment-outline" size={23} color="black" />
                                <Text style={{marginLeft:hp('0.3%')}}>{item.commentCount}</Text>
                                <FontAwesome name="bookmark-o" size={23} color="black" style={{marginLeft:hp('1.5%')}}/>
                                <Text style={{marginLeft:hp('0.5%')}}>{item.scrapCount}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                    )

                }):(<Loading/>)} 
                {buttonVisible?
                <View
                   style={{justifyContent:'center', alignItems:'center', height:hp('8%'), marginBottom:hp('1%')}}>
                    
                    <TouchableOpacity onPress={handleMoreButton} style={{borderRadius:16, backgroundColor:'gray', padding:hp('1.5%')}}>
                        <Text style={{color:'white'}} >더 보기</Text>
                    </TouchableOpacity>
                </View>:null}

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        height:'100%',
    },

    comment_item_container:{
        borderWidth: 1
    }
});

