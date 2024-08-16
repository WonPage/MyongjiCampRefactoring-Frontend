import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import useHome from "../../hook/useHome";
import Loading from "../(other)/Loading";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
const BACKGROUND_COLOR = '#495579';

export default function Finish({navigation}){
    const [finishList, setFinishList] = useState([]);
    const[page, setPage] = useState(0);
    const[buttonVisible, setButtonVisible] = useState(true)
    const {getRecruitList} = useHome();
    // null일 때 로딩창 0개일 때 게시글 없다 1개 이상일 때 게시글
    const refreshFinishList = () => { //새로고침 로직
        getRecruitList([page,'DESC','complete',null]).then(completes=>{
            let tmp = null;
            if(page === 0){
                tmp = completes;
            }
            else{
               tmp = [...finishList];
               tmp = tmp.concat(completes);
            }
            setFinishList(tmp)
        })
    }
    useEffect(()=>{
        refreshFinishList();
        console.log(finishList);
    },[page]) 

    const handleMoreButton = () => {
        getRecruitList([page+1,'DESC','complete',null]).then(completes=>{
            if(completes.length > 1){
                setPage(page+1);
            }
            else{
                setButtonVisible(false)
            } 
        })
    }
    return (
        <View style={{backgroundColor:BACKGROUND_COLOR, flex:1, paddingTop:hp(2)}}>
            <ScrollView contentContainerStyle={{paddingHorizontal:wp(2)}} showsVerticalScrollIndicator={false}>
            {finishList ? finishList.map((item, index)=>{
                //    console.log('item',item)
                    const date = new Date(item.modifiedDate);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;
                    const newMonth = month.toString().padStart(2,'0');
                    const day = date.getDate().toString().padStart(2,'0');
                    const hours = date.getHours().toString().padStart(2,'0');
                    const minutes = date.getMinutes().toString().padStart(2,'0');
                    const dateFormat = `${year}.${newMonth}.${day}  ${hours}:${minutes}`
                    return(
                    <TouchableOpacity activeOpacity={0.5} key={index} onPress={()=>navigation.navigate('PostCompleteDetail', {boardId: item.boardId, refresh:refreshFinishList})} >
                    <View style={{ borderRadius: 5, height:hp('22%'), marginBottom:hp('1.5%'), elevation:1,
                    backgroundColor:'white', padding:hp(1.5), flexDirection:'row'}}>
                        <View style={{marginRight:wp(3)}}>
                            <Image source={{uri:item.firstImage}} style={{width:hp(18), height:hp(18)}}/>
                        </View>
                        <View style={{justifyContent:'space-between', flex:1}}>
                            <View>
                                <Text>{dateFormat}</Text>
                                <Text style={{fontSize:27}}>{item.title}</Text>
                            </View>
                            <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                                <MaterialCommunityIcons name="comment-outline" size={23} color="black" />
                                <Text style={{marginLeft:hp('0.3%')}}>{item.commentCount}</Text>
                                <FontAwesome name="bookmark-o" size={23} color="black" style={{marginLeft:hp('1.5%')}}/>
                                <Text style={{marginLeft:hp('0.5%')}}>{item.scrapCount}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>)
                }):(<Loading/>)} 
                {buttonVisible &&
                <View style={{justifyContent:'center', alignItems:'center', height:hp('8%'), marginBottom:hp('1%')}}>
                    <TouchableOpacity onPress={handleMoreButton} style={{borderRadius:16, backgroundColor:'gray', padding:hp('1.5%')}}>
                        <Text style={{color:'white'}} >더 보기</Text>
                    </TouchableOpacity>
                </View>}
            </ScrollView>
        </View>
    )
}