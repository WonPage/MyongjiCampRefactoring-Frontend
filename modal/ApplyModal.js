import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import useResume from "../hook/useResume";
import useApply from "../hook/useApply";

export default function ApplyModal({navigation, route}){
    const {boardId, role} = route.params;
    const [resumeList, setResumeList] = useState(null);
    const [selectedResume, setSelectedResume] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const {getResumeList} = useResume();
    const {sendApply} = useApply();

    useEffect(() => {
        getResumeList().then(resumeList => {
            setResumeList(resumeList);
        })
        const refresh = navigation.addListener('focus', ()=>{getResumeList();});
        return refresh;
    }, [])

    const handleApply = async() => {
        console.log(selectedResume, selectedRole)
        if (selectedResume===null || selectedRole===null) {
            return Alert.alert("안내", "이력서 또는 역할을 선택해주세요.")
        }
        sendApply(boardId, selectedResume, selectedRole);
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]} onPress={navigation.goBack} />
            <View style={{ width: wp('85%'), height: hp('65%'), backgroundColor: 'white', borderRadius:10,
                paddingHorizontal: wp('5%'), paddingVertical: hp('3%'), justifyContent:'space-between'
             }}>
                {/* 제목 */}
                <View style={{ alignItems: 'center', marginTop: hp('3%') }}>
                    <Text style={{ fontSize: 30, fontWeight:'500' }}>지원</Text>
                </View>
                {/* 이력서 선택하기 */}
                <View style={{width:'100%', alignItems:'center'}}>
                    <Picker
                    selectedValue={selectedResume}
                    onValueChange={(value)=>{
                        setSelectedResume(value);
                    }}
                    style={{width:'90%'}}
                    prompt="이력서 선택"
                    dropdownIconColor={'darkblue'}
                    >
                        {resumeList?.length===0 ? <Picker.Item style={{fontSize:20}} label={"이력서 없음"}></Picker.Item> :
                        resumeList?.map((item, index) => (
                            <Picker.Item style={{fontSize:20}} key={index} label={item.title} value={item} />
                        ))}
                    </Picker>
                    <Picker
                    selectedValue={selectedRole}
                    onValueChange={(value)=>{
                        setSelectedRole(value);
                    }}
                    style={{width:'90%'}}
                    prompt="역할 선택"
                    dropdownIconColor={'darkblue'}
                    >
                        {role?.map((item, index) => (
                            <Picker.Item style={{fontSize:20}} key={index} label={
                                item.role === 'FRONT' ? '프론트엔드' :
                                item.role === 'BACK' ? '백엔드' :
                                item.role === 'DESIGN' ? '디자인' :
                                item.role === 'PM' ? '기획' :
                                item.role === 'FULL' ? '풀스택' : item.role
                        } value={item.role} />
                        ))}
                    </Picker>
                    <TouchableOpacity style={{backgroundColor:'#AAAAFF', width:'60%', paddingVertical:hp('2%'), paddingHorizontal:'2%', marginVertical:hp("2%"), justifyContent:'center', alignItems:'center', borderRadius:10}} onPress={()=>navigation.navigate('Resume')}>
                        <Text style={{color:'white', fontSize:18}}>이력서 관리하기</Text>
                    </TouchableOpacity>
                </View>
                {/* Notice */}
                <View style={{ flexDirection: 'row', justifyContent:'center' }}>
                    <Ionicons name="megaphone-outline" size={22} color="black" />
                    <Text style={{fontSize:13}}>{"지원 결과는 지원현황 탭에서 확인하실 수 있습니다."}</Text>
                </View>
                {/* Apply Button */}
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp('4%'), marginBottom:hp('4%') }}>
                    <TouchableOpacity onPress={handleApply} disabled={selectedResume===undefined||selectedRole===undefined||selectedResume===null||selectedRole===null ? true : false}
                    style={[{paddingHorizontal: '20%', paddingVertical: hp('3%'), borderRadius: 50 }, selectedResume===undefined||selectedRole===undefined||selectedResume===null||selectedRole===null?{backgroundColor: '#E0E0E0'}:{backgroundColor: '#7799F2'}]}>
                        <Text style={ selectedResume===null? { fontSize: 20 } : { color: 'white', fontSize: 20 }}>지원하기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}