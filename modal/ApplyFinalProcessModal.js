import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import useApply from "../hook/useApply";

export default function ApplyFinalProcessModal({navigation, route}){
    const {data} = route.params;
    const type = data.firstStatus;
    const {resumeFinalProcess} = useApply();

    const handleAccept = async() => {
        resumeFinalProcess(data.applicationId, "ACCEPTED");
    }
    const handleReject = async() => {
        resumeFinalProcess(data.applicationId, "REJECTED");
    }
    console.log(data);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}  />
            <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 30, elevation:10 }}>
                <View style={{justifyContent:'space-between', alignItems:'center', padding:'6%'}}>
                    <View style={{width:'100%'}}>
                        <TouchableOpacity onPress={()=>navigation.goBack()} activeOpacity={0.5} style={[type==="ACCEPTED"?{top:'5%'}:{top:'9%'},{position:'absolute', left:'5%'}]}>
                            <MaterialIcons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                        <View style={{justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize:30}}>{data.finalStatus==="PENDING" ? (type==='ACCEPTED' ? "승인" : "미승인") : 
                                data.finalStatus==='ACCEPTED' ? (type==='ACCEPTED' && "합격 메세지") : 
                                data.finalStatus==='REJECTED' ? (type==='ACCEPTED' && "합격 메세지") : undefined}</Text>
                        </View>
                        <View style={{marginTop:hp('2%')}}>
                            <Text>상대 메세지</Text>
                            <View style={{borderWidth:1, borderRadius:8, justifyContent:'center', padding:16, marginTop:7}}>
                                <Text>{data.resultContent?data.resultContent:"메세지가 없습니다."}</Text>
                            </View>
                        </View>
                        {type==='ACCEPTED' && data.finalStatus!=='REJECTED' &&
                        <View style={{marginTop:hp('2%')}}>
                            <Text>URL 링크</Text>
                            <View style={{borderWidth:1, borderRadius:8, justifyContent:'center', padding:16, marginTop:7}}>
                                <Text>{data.finalStatus==="ACCEPTED" ? (data.resultUrl?data.resultUrl:"URL이 없습니다.") : "URL는 수락 후 공개됩니다."}</Text>
                            </View>
                        </View>}
                    </View>
                    <View style={{marginTop:hp('5%'), marginBottom:hp('2%'), flexDirection:'row', justifyContent:"space-evenly", width:'100%'}}>
                        {
                        data.finalStatus === "PENDING" ? (                        
                        type==="ACCEPTED" ? (
                            <>
                            <TouchableOpacity onPress={handleAccept}
                            style={{backgroundColor:'#008FD5', paddingVertical:'4%', paddingHorizontal:'10%', borderRadius:13}}>
                                <Text style={{color:'white', fontSize:18}}>수락</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleReject}
                            style={{backgroundColor:'lightgray', paddingVertical:'4%', paddingHorizontal:'10%', borderRadius:13}}>
                                <Text style={{fontSize:18}}>거절</Text>
                            </TouchableOpacity>
                            </>
                        ):(
                            <>
                            <TouchableOpacity onPress={()=>navigation.goBack()}
                            style={{backgroundColor:'#495579', paddingVertical:'4%', paddingHorizontal:'10%', borderRadius:13}}>
                                <Text style={{fontSize:18, color:'white'}}>닫기</Text>
                            </TouchableOpacity>
                            </>
                        )
                    ) : data.finalStatus === "ACCEPTED" ? (<>
                            <TouchableOpacity onPress={()=>navigation.goBack()}
                            style={{backgroundColor:'#495579', paddingVertical:'4%', paddingHorizontal:'10%', borderRadius:13}}>
                                <Text style={{fontSize:18, color:'white'}}>닫기</Text>
                            </TouchableOpacity>  
                        </>) : 
                        data.finalStatus === 'REJECTED' ? (
                            <TouchableOpacity onPress={()=>navigation.goBack()}
                            style={{backgroundColor:'#495579', paddingVertical:'4%', paddingHorizontal:'10%', borderRadius:13}}>
                                <Text style={{fontSize:18, color:'white'}}>닫기</Text>
                            </TouchableOpacity> 
                        ) : <></>
                    }
                    </View>
                </View>
            </View>
        </View>
    )
}