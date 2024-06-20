import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import useResume from "../hook/useResume";

export default function ResumeUpdateModal({navigation, route}){
    const contents = route.params.data;
    const [title, setTitle] = useState(contents.title);
    const [content, setContent] = useState(contents.content);
    const [url, setUrl] = useState(contents.url);
    const {updateResume} = useResume();
    const handlePostResume = () => {
        if (title==='') return Alert.alert('안내', '제목을 입력해주세요.');
        if (content==='') return Alert.alert('안내', '내용을 입력해주세요');
        const resumeData = {
            title : title,
            content : content,
            url : url
        }
        updateResume(contents.id, resumeData).then(isFailed=>{
            if (!isFailed) {navigation.replace('Resume')}
        })
    }
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]} onPress={navigation.goBack} />
            <View style={{ width: wp('90%'), height: hp('72%'), backgroundColor: '#FFFEFA', 
                paddingHorizontal: wp('5%'), paddingVertical: hp('3%'), justifyContent:'space-between'
             }}>
                <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
                    <View style={{flexDirection:'row'}}>
                     <Text style={{fontSize:22, color:'#51493F', fontWeight:'500'}}>이력서 수정하기</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={handlePostResume} style={{backgroundColor:'#5A72A0', width:wp('16%'), height:hp('5%'), justifyContent:'center', alignItems:'center', paddingBottom:hp('0.5%'), borderRadius:30}}>
                            <Text style={{ color: 'white', fontWeight:'500' }}>저장</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={navigation.goBack} style={{marginLeft:wp('2%'), backgroundColor:'#C7B7A3', width:wp('16%'), height:hp('5%'), justifyContent:'center', alignItems:'center', paddingBottom:hp('0.5%'), borderRadius:30}}>
                            <Text style={{ color: 'white', fontWeight:'500' }}>닫기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{marginTop:hp('1.5%'), borderBottomWidth:1, borderColor:'#51493F', paddingBottom:hp('1%')}}>
                    <Text style={{ marginLeft: 3, color:'#51493F' }}>제목</Text>
                    <TextInput maxLength={20} onChangeText={(text)=>setTitle(text)} placeholder="이력서 제목" placeholderTextColor={'#E3E1D9'}
                    style={{fontSize:28, color:'#51493F'}}>
                        {title}
                    </TextInput>
                    <Text style={{position:'absolute', right:5, bottom:5, color:'#EBE3D5', fontSize:18}}>{`${title.length} / 20`}</Text>
                </View>
                <View style={{}}>
                    <Text style={{ marginLeft: 3, color:'#51493F', marginBottom:hp('1.3%')}}>내용</Text>
                    <TextInput maxLength={500} onChangeText={(text)=>setContent(text)} multiline placeholder="이력서 내용" placeholderTextColor={'#E3E1D9'}
                    style={{fontSize:18, paddingHorizontal:wp('3%'),paddingVertical:hp('1%'), textAlignVertical:'top', color:'#776B5D', borderWidth:1, height:hp('35%'), borderRadius:10, borderColor:'#A0937D'}}>
                        {content}
                    </TextInput>
                    <Text style={{position:'absolute', right:7, bottom:7, color:'#EBE3D5', fontSize:18}}>{`${content.length} / 500`}</Text>
                </View>
                <View style={{marginBottom:hp('0.5%') }}>
                    <Text maxLength={100} style={{ marginLeft: 3, color:'#51493F'}}>URL 링크</Text>
                    <TextInput onChangeText={(text)=>setUrl(text)} placeholder="Github 또는 블로그" placeholderTextColor={'#E3E1D9'}
                    style={{fontSize:18, color:'#51493F', borderBottomWidth:1, borderColor:'#51493F', paddingBottom:hp('1%'), marginTop:hp('0.4%'), marginLeft:wp('0.5%')}}>
                        {url}
                    </TextInput>
                </View>
            </View>
        </View>
    )
}
