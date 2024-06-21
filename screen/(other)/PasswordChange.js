import { useFocusEffect } from "@react-navigation/native";
import useUsers from "../../hook/useUsers";
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useState } from "react";

const PasswordChange = ({navigation, route}) => {
    const [isChecked, setIsChecked] = useState(false);
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [newPwCheck, setNewPwCheck] = useState('');
    const {sessionCheck, verifyPassword, updatePassword} = useUsers();
    useFocusEffect(()=>{
        sessionCheck(route);
    })
    const handlePwCheck = () => {
        verifyPassword(currentPw).then(isChecked=>{
            setIsChecked(isChecked);
        })
    }
    const handlePwChange = () => {
        updatePassword(newPw, newPwCheck).then(isFailed=>{
            if (!isFailed) {navigation.pop()}
        })
    }
    return(
        <View style={{alignItems: 'center', justifyContent:'center'}}>
            <View style={{marginTop:hp('7%'), height:hp('17%')}}>
                <Image style={{flex:1,objectFit:'contain'}} source={require('../../assets/myongjicamp-title.png')}/>
            </View>
            <View style={{marginTop:hp('4%'), height:hp('55%'), width:'80%', borderWidth:1, borderRadius:20, paddingVertical:hp('3%'),paddingHorizontal:hp('2%')}}>
                <Text style={[{fontSize:13, marginLeft:'2.5%', marginBottom:hp('0.5%')}, isChecked ? {color:'lightgray'} : undefined]}>현재 비밀번호</Text>
                <TextInput placeholder="현재 비밀번호를 입력하세요" placeholderTextColor={isChecked ? '#cccccc' : undefined}
                    value={currentPw} onChangeText={(text)=>setCurrentPw(text)} secureTextEntry editable={!isChecked}
                    style={[{backgroundColor:'lightgray', borderRadius:20, height:hp('8%'), paddingHorizontal:16, marginBottom:hp('3%')}, isChecked ? {backgroundColor:'#e8e8e8', color:'#cccccc'} : undefined]} />
                <Text style={[{fontSize:13, marginLeft:'2.5%', marginBottom:hp('0.5%')},!isChecked ? {color:'lightgray'} : undefined]}>새 비밀번호</Text>
                <TextInput placeholder="새로운 비밀번호를 입력하세요" editable={isChecked}
                    value={newPw} onChangeText={(text)=>setNewPw(text)} secureTextEntry placeholderTextColor={!isChecked ? '#cccccc' : undefined}
                    style={[{backgroundColor:'lightgray', borderRadius:20, height:hp('8%'), paddingHorizontal:16, marginBottom:hp('2%')}, !isChecked ? {backgroundColor:'#e8e8e8'} : undefined]} />
                <TextInput placeholder="새로운 비밀번호를 재입력하세요" editable={isChecked}
                    value={newPwCheck} onChangeText={(text) => setNewPwCheck(text)} secureTextEntry placeholderTextColor={!isChecked ? '#cccccc' : undefined}
                    style={[{ backgroundColor: 'lightgray', borderRadius: 20, height: hp('8%'), paddingHorizontal: 16 }, !isChecked ? {backgroundColor:'#e8e8e8'} : undefined]} />
                <View style={{justifyContent:'center', alignItems:'center', marginTop:hp('1%')}}>
                    {isChecked ? (
                    <TouchableOpacity onPress={handlePwChange} style={{marginTop:hp('3.8%'), backgroundColor: '#4ea1d3', height: hp('7%'), width: '50%', justifyContent: 'center', alignItems: 'center', borderRadius: 16 }}>
                        <Text style={{ color: 'white' }}>비밀번호 변경</Text>
                    </TouchableOpacity>
                    ) : (<>
                    <TouchableOpacity onPress={()=>navigation.navigate('PasswordFind')}>
                        <Text style={{fontSize:12, textDecorationLine:'underline', marginBottom:hp('3%')}}>비밀번호가 기억나지 않으신가요?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePwCheck} style={{backgroundColor:'#4ea1d3', height:hp('7%'), width:'50%', justifyContent:'center', alignItems:'center', borderRadius:16}}>
                        <Text style={{color:'white'}}>비밀번호 확인</Text>
                    </TouchableOpacity>
                    </>)}
                </View>
            </View>
        </View>
    )
}

export default PasswordChange;