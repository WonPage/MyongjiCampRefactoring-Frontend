import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import useHome from "../../hook/useHome";
import { useFocusEffect } from "@react-navigation/native";
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
     const [recruitList, setRecruitList] = useState(null);
    // null일 때 로딩창 0개일 때 게시글 없다 1개 이상일 때 게시글
    const[page, setPage] = useState(0);
  //  const[recruitForm, setRecruitForm] = useState([0,'DESC','recruit','ongoing']);
    const {getRecruitList} = useHome();
    useEffect(()=>{
        console.log("durl")
      //  console.log(recruitForm)
        getRecruitList(recruitForm).then(recruits=>{
        setRecruitList(recruits);
        console.log('recuits',recruits)
        })
    },[]) 
 
    //page가 아닌 게시글 수가 늘어나게
    // 다른 페이지에 갔다가 돌아오면 page가 0으로 되게 -> unmountblur?
    // 이 부분 잘 되었는지 게시글 추가 시키고 확인
    const handleRecruitMoreButton = () => {
     //   setRecruitForm([page,'DESC','recruit','ongoing'])
     //   setPage(page+1)
     //   console.log('button',recruitForm)
        let tmp = [...recruitList];
     //       setRecruitForm([page,'DESC','recruit','ongoing'])
        let UpdatedRecruitForm = recruitForm
        console.log('old ',UpdatedRecruitForm)
        UpdatedRecruitForm[0] = page+1;
        console.log('new ', UpdatedRecruitForm)
        getRecruitList(UpdatedRecruitForm).then(recruits=>{
            if(recruits.length < 1){
                console.log('마지막 페이지')
            }
            else{
                tmp.push(recruits);
            }
            setPage(page+1)

            
        })
        console.log('page',page)
        console.log('tmp',tmp)

        setRecruitList(tmp)

    }

    return(
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicato={false}>
                {recruitList ? recruitList.map((item, index)=>{
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
                    <TouchableOpacity activeOpacity={0.5} key={index} onPress={()=>{moveDetail(item.boardId)}}>
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
                                    else roleName = role;
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
                <View
                style={{justifyContent:'center', alignItems:'center', height:hp('8%'), marginBottom:hp('1%')}}>
                    <TouchableOpacity onPress={handleRecruitMoreButton} style={{borderRadius:16, backgroundColor:'gray', padding:hp('1.5%')}}>
                        <Text style={{color:'white'}}>더 보기</Text>
                    </TouchableOpacity>
                </View>

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

