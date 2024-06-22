/** 담당자 채윤 
 * 240620 - 비밀번호 찾기 페이지 UI 및 기능 구현 완료 */
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import useUsers from "../../hook/useUsers";

const PasswordFind = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [isPressed, setIsPressed] = useState(false);
    const {findPassword} = useUsers();
    const handlePwFind = () => {
        setIsPressed(true);
        findPassword(email).then(isFailed=>{
            if (!isFailed){navigation.pop()}
        })
        .finally(()=>{setIsPressed(false)})
    }
    return (
    <View style={{alignItems: 'center', justifyContent:'center'}}>
        <View style={{marginTop:hp('7%'), height:hp('25%')}}>
            <Image style={{flex:1,objectFit:'contain'}} source={require('../../assets/myongjicamp-title.png')}/>
        </View>
        <View style={{marginTop:hp('6%'), height:hp('36%'), width:'80%', borderWidth:1, borderRadius:20, paddingVertical:hp('5%'),paddingHorizontal:hp('2%')}}>
            <Text style={{fontSize:13, marginLeft:'2.5%', marginBottom:hp('0.5%')}}>학교 이메일</Text>
            <TextInput placeholder="이메일을 입력하세요"
                maxLength={30}
                value={email} onChangeText={(text)=>setEmail(text)}
                style={{backgroundColor:'lightgray', borderRadius:20, height:hp('8%'), paddingHorizontal:16}} />
            <Text style={{color:'gray', position:'relative', bottom:41, left:167}}>@mju.ac.kr</Text>
            <View style={{justifyContent:'center', alignItems:'center', marginTop:hp('3%')}}>
                <TouchableOpacity disabled={isPressed} onPress={handlePwFind} style={{backgroundColor:'#4ea1d3', height:hp('7%'), width:'50%', justifyContent:'center', alignItems:'center', borderRadius:16}}>
                    <Text style={{color:'white'}}>비밀번호 찾기</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
    )
}

export default PasswordFind;