import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import useApply from "../hook/useApply";
import { useState } from "react";

export default function ApplyProcessModal({navigation, route}){
    const {type, resumeId} = route.params;
    const [resultContent, setResultContent] = useState("");
    const [resultUrl, setResultUrl] = useState("");
    const {resumeProcess} = useApply();

    const handleSend = async() => {
        if (resultContent==="") {
            return Alert.alert('안내', "전달할 메세지를 입력하세요.");
        }
        resumeProcess(resumeId, type, resultContent, resultUrl);
    }
    const handleCancle = async() => {
        navigation.goBack();
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}  />
            <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 30, elevation:10 }}>
                <View style={{justifyContent:'space-between', alignItems:'center', padding:'6%'}}>
                    <View style={{width:'100%'}}>
                        <View style={{justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize:30}}>{type==='ACCEPTED' ? "합격" : "거절"}</Text>
                        </View>
                        <View style={{marginTop:hp('2%')}}>
                            <Text>전달할 메세지</Text>
                            <TextInput style={{borderWidth:1, borderRadius:8, justifyContent:'center', padding:16, marginTop:7}}
                            value={resultContent} onChangeText={(text)=>setResultContent(text)} placeholder="메세지를 입력하세요."/>
                        </View>
                        {type==='ACCEPTED' &&
                        <View style={{marginTop:hp('2%')}}>
                            <Text>URL 링크</Text>
                            <TextInput style={{borderWidth:1, borderRadius:8, justifyContent:'center', padding:16, marginTop:7}}
                            value={resultUrl} onChangeText={(text)=>setResultUrl(text)} placeholder="ex) 오픈채팅 링크 또는 연락 수단 입력"/>
                        </View>}
                    </View>
                    <View style={{marginTop:hp('5%'), marginBottom:hp('2%'), flexDirection:'row', justifyContent:"space-evenly", width:'100%'}}>
                        <TouchableOpacity onPress={handleSend}
                        style={{backgroundColor:'#008FD5', paddingVertical:'4%', paddingHorizontal:'10%', borderRadius:13}}>
                            <Text style={{color:'white', fontSize:18}}>전송</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCancle}
                        style={{backgroundColor:'lightgray', paddingVertical:'4%', paddingHorizontal:'10%', borderRadius:13}}>
                            <Text style={{fontSize:18}}>취소</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}