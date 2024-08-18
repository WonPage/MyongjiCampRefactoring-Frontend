/** 담당자 채윤 
 * 240810 - 글 검색 결과 창 */
import { Entypo, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function SearchResult({navigation, route}){
    const {roles, keyword} = route.params;
    const [resultList, setResultList] = useState();
    const [pageNum, setPageNum] = useState(0);
    const [direction, setDirection] = useState('DESC');
    const [boardType, setBoardType] = useState('recruit');
    const [status, setStatus] = useState('ongoing'); 

    // axios.get으로 query를 담아서 보냄. 
    const searching = () => {
        const query = {
            'keyword' : keyword,
            'roles' : roles.map((tag)=>{
                switch (tag) {
                    case '백엔드': return 'BACK';
                    case '프론트엔드': return 'FRONT';
                    case '디자인': return 'DESIGN';
                    case 'AI': return 'AI';
                    case '풀스택': return 'FULL';
                    case 'ETC': return 'ETC';
                    case '기획': return 'PM';
                }
            }),
            'pageNum':pageNum,
            'direction':direction,
            'boardType':boardType,
            'status': (boardType === 'recruit' ? status : undefined)
        }
        let arr = ""
        Object.keys(query).map((key)=>{
            arr += key+'='+query[key]+'&';
        })
        axios.get(`${API_URL}/api/board?${arr}`)
        .then(res => {
            if (res.status == 200){
                const result = res.data.data
                setResultList(result);
                // console.log(result);
            }
            else {
                console.log("검색 결과 호출 오류")
            }
        })
        .catch(error => {
            console.log("검색 결과 호출 오류 :", error);
        })
    }
    useEffect(()=>{
        searching();
    },[direction, boardType, status])
    const moveDetail = (boardId) => {
        navigation.navigate('PostDetail', {title: '모집 중', boardId: boardId});
    }
    const moveCompleteDetail = (boardId) => {
        navigation.navigate('PostCompleteDetail', {boardId: boardId});
    }

    return (
        <View style={{alignItems:'center', backgroundColor:'#FFFBEB', flex:1}}>
            <View style={{flexDirection:'row', marginHorizontal:wp(3), marginTop:hp(2), alignItems:'center'}}>
                <Entypo name="light-bulb" size={22} color="gray" />
                <Text style={{fontSize:18, fontWeight:'500', marginLeft:wp(1)}}>{ keyword === '' ? ('검색어가 존재하지 않습니다.') : (`'${keyword}'에 대한 결과입니다.`)}</Text>
            </View>
            <Text style={{marginHorizontal:wp(3), fontSize:13, marginVertical:hp(2)}}>{roles.map((tag)=>(`#${tag} `))}</Text>

            <View style={{flexDirection:'row', justifyContent:'space-between', width:wp(90), marginBottom:hp(2)}}>
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity onPress={(()=>{
                        setBoardType('recruit');
                        setStatus('ongoing');
                    })}
                    style={[status=='ongoing'?{backgroundColor:'gray'}:{backgroundColor:'#495579'},{padding:wp(2.5), borderRadius:wp(5)}]}>
                        <Text style={{fontWeight:'500', color:'white'}}>모집 중</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        setBoardType('recruit');
                        setStatus('complete');
                    }}
                    style={[status=='complete'?{backgroundColor:'gray'}:{backgroundColor:'#495579'},{marginHorizontal:wp(2), padding:wp(2.5), borderRadius:wp(5)}]}>
                        <Text style={{fontWeight:'500', color:'white'}}>모집 완료</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        setBoardType('complete');
                        setStatus(null);
                    }} 
                    style={[status==null?{backgroundColor:'gray'}:{backgroundColor:'#495579'},{padding:wp(2.5), borderRadius:wp(5)}]}>
                        <Text style={{fontWeight:'500', color:'white'}}>개발 완료</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={()=>{
                    if (direction=="DESC"){
                        setDirection('ASC')
                    } else {
                        setDirection("DESC");
                    }
                }}
                style={{padding:wp(2.5), borderRadius:wp(5), backgroundColor:'white', borderWidth:1}}>
                    <Text>{direction=='DESC'?"최신 순":"오래된 순"}</Text>
                </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
                {resultList?.length==0 ? (
                    <Empty/>
                ) : 
                boardType==='recruit' ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {resultList ? resultList.map((item, index)=>{
                            const date = new Date(item?.modifiedDate);      
                            const year = date.getFullYear();
                            const month = date.getMonth() + 1;
                            const newMonth = month.toString().padStart(2, '0');
                            const day = date.getDate().toString().padStart(2, '0');
                            const dateFormat = `${year}.${newMonth}.${day}`  
                            return (
                            <TouchableOpacity key={index} onPress={()=>{moveDetail(item.boardId)}} style={{marginBottom:hp(1)}} >
                                <View style={{ marginHorizontal:wp(3), borderRadius:wp(2), backgroundColor:'white', padding:wp(4), elevation:2}}>
                                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <View style={{flexDirection:'row', width:wp(40)}}>
                                            {item.roles.map((role,index)=>{
                                            return (
                                                <View key={index} style={[{paddingHorizontal:wp(1), marginRight:wp(2)},
                                                role=='BACK'? {backgroundColor:'#8FCACA'}: role=='FRONT' ? {backgroundColor:'#FFAEA5'} :
                                                role=='DESIGN' ? {backgroundColor:'#EFD0B2'}: role=='PM' ? {backgroundColor:'#CBAACB'} :
                                                role=='AI' ? {backgroundColor: '#F3B0C3'}: role=='FULL' ? {backgroundColor:'#B6CFB6'} : {backgroundColor: '#AFAFAF'}]}>
                                                <Text style={{fontWeight:'500', fontSize:12}}>{role}</Text>
                                                </View>
                                            )
                                            })}
                                        </View>

                                        <View style={{flexDirection:'row', alignItems:'center'}}>
                                            <Text style={{fontWeight:'500', fontSize:15, color:'gray', marginBottom:hp(0.2), marginRight:wp(2)}}>{`${dateFormat}`}</Text>
                                            <MaterialCommunityIcons name="comment-outline" size={18} color="black" />
                                            <Text style={{marginLeft:hp('0.3%')}}>{item.commentCount}</Text>
                                            <FontAwesome name="bookmark-o" size={18} color="black" style={{marginLeft:hp('1.5%')}}/>
                                            <Text style={{marginLeft:hp('0.5%')}}>{item.scrapCount}</Text>
                                        </View>
                                    </View>
                                    <Text style={{fontSize:21, fontWeight:'500'}}>{`${item.title}`}</Text>
                                    <Text style={{fontSize:13, marginTop:hp(0.8), color:'gray'}}>{`예상 기간 - ${item.expectedDuration}`}</Text>
                                </View>
                            </TouchableOpacity>
                                )}) : (<></>)}
                    </ScrollView>
                ) : 
                boardType === 'complete' ? ( 
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {resultList ? resultList.map((item, index)=>{
                            const date = new Date(item?.modifiedDate);      
                            const year = date.getFullYear();
                            const month = date.getMonth() + 1;
                            const newMonth = month.toString().padStart(2, '0');
                            const day = date.getDate().toString().padStart(2, '0');
                            const dateFormat = `${year}.${newMonth}.${day}`  
                            return (
                            <TouchableOpacity key={index} onPress={()=>{moveCompleteDetail(item.boardId)}} style={{marginBottom:hp(1), width:wp(95)}}>
                                <View style={{ marginHorizontal:wp(3), borderRadius:wp(2), backgroundColor:'white', padding:wp(4), elevation:2, flexDirection:'row'}}>
                                    <View>
                                        <Image source={{uri:item.firstImage}} style={{width:wp(20), height:wp(20)}}/>
                                    </View>
                                    <View style={{justifyContent:'space-between', flex:1}}>
                                        <View style={{marginLeft:wp(2)}}>
                                            <Text style={{fontSize:21, fontWeight:'500'}}>{`${item.title}`}</Text>
                                            <Text style={{fontWeight:'500', fontSize:13, color:'gray', marginBottom:hp(0.2), marginRight:wp(2)}}>{`${dateFormat}`}</Text>
                                        </View>
                                        <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                                            <MaterialCommunityIcons name="comment-outline" size={18} color="black" />
                                            <Text style={{marginLeft:hp('0.3%')}}>{item.commentCount}</Text>
                                            <FontAwesome name="bookmark-o" size={18} color="black" style={{marginLeft:hp('1.5%')}}/>
                                            <Text style={{marginLeft:hp('0.5%')}}>{item.scrapCount}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}) : (<></>)}
                    </ScrollView>
                ) : <></>
                }
            </View>
        </View>
    )   
}

function Empty(){
    return(
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <View style={{backgroundColor:'#A1ADBC', width:wp('85%'), height:hp('50%'), borderRadius:20, justifyContent:'center', alignItems:'center'}}>
          <Text style={{fontSize:15, color:'#F3F5F6', fontWeight:'500'}}>검색 결과가 없습니다.</Text>
        </View>
      </View>
    )
  }