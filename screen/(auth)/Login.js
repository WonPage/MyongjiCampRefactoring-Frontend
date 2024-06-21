import { useRef, useState } from "react";
import { Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import useUsers from "../../hook/useUsers";
import { heightPercentageToDP as hp , widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useFocusEffect } from "@react-navigation/native";

const Login = ({navigation, route}) => {
    const {sessionCheck, tryLogin} = useUsers();
    useFocusEffect(()=>{
        sessionCheck(route);
    })
    const inputRef = useRef();
    const handleInputPress = () => {inputRef.current.focus()}
    const [emailPrefix, setEmailPrefix] = useState('');
    const [password, setPassword] = useState('');
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const [loginDisable, setLoginDisable] = useState(false);

    const handleConfirm = () => {
        setLoginDisable(true); //로그인 버튼 비활성화
        const userData = {
            username: `${emailPrefix}@mju.ac.kr`,
            password: password
        }
        tryLogin(userData, stayLoggedIn); //로그인 시도 (Custom Hook)
        setLoginDisable(false); //로그인 버튼 활성화
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
            <View style={styles.container}>
                <View style={styles.container_width}>
                    <View style={styles.icon}>
                        <Image style={styles.myongji_icon} source={require('../../assets/myongjicamp-title.png')} />
                    </View>
                    <View style={styles.input}>
                        <TouchableWithoutFeedback onPress={handleInputPress}>
                            <View style={styles.input_box} >
                                <TextInput
                                    ref={inputRef}
                                    style={styles.input_email_txt}
                                    placeholder="이메일"
                                    value={emailPrefix}
                                    onChangeText={setEmailPrefix}
                                    autoCapitalize='none'
                                    maxLength={20} // @앞의 최대 글자 수 30자
                                />
                                <Text style={styles.input_email_rear}>@mju.ac.kr</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TextInput
                            style={styles.input_password}
                            placeholder="비밀번호"
                            value={password}
                            secureTextEntry
                            onChangeText={setPassword}
                            autoCapitalize='none'
                            maxLength={20} // 최대 글자 수 30자
                        />
                        <View style={styles.checkBox}>
                            <BouncyCheckbox
                                size={20}
                                textStyle={{ textDecorationLine: "none"}}
                                fillColor='#008FD5'
                                text="로그인 유지"
                                isChecked={stayLoggedIn}
                                onPress={setStayLoggedIn}
                            />
                        </View>
                    </View>
                    <View style={styles.confirm}>
                        <TouchableOpacity style={styles.confirm_button} onPress={handleConfirm} disabled={loginDisable}>
                            <Text style={styles.confirm_button_txt}>로그인</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cant}>
                        <TouchableOpacity style={styles.cant_findPassword_button} onPress={()=>navigation.navigate('PasswordFind')}>
                            <Text style={styles.cant_findPassword_button_txt}>비밀번호 찾기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cant_singup_button} onPress={()=>navigation.navigate('Signup')}>
                            <Text style={styles.cant_singup_button_txt}>회원가입</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    container_width: {
        marginTop: hp('10%'),
        width: wp('75%'),
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:hp('3%'),
        marginBottom:hp('3%')
    },
    myongji_icon: {
        height: 130,
        width: 130,
    },
    input: {
        height:hp('28%'),
        justifyContent: "space-around"
    },
    input_box: {
        justifyContent:'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        height: hp('7.5%'),
        borderRadius: 16,
        paddingHorizontal: 20,
    },
    input_email_txt: {
        
        fontSize: 15,
    },
    input_email_rear: {
        fontSize: 15,
        color: 'gray',
    },
    input_password: {
        borderWidth: 1,
        alignItems: 'center',
        height: hp('7.5%'),
        borderRadius: 15,
        paddingHorizontal: 20,
        fontSize: 15
    },
    checkBox: {
        borderRadius: 20,
        justifyContent: 'flex-end',
    },
    confirm_button: {
        borderRadius: 20,
        height: 60,
        backgroundColor: "#002E66",
        justifyContent: "center",
        alignItems: "center",
        marginTop: hp('2%'),
        marginBottom: hp('4%')
    },
    confirm_button_txt: {
        fontSize: 23,
        color: "white",
    },
    cant: {
        flexDirection: 'row',
        justifyContent:'space-evenly'
    },
    cant_findPassword_button: {
        justifyContent: "center",
        alignItems: "center",
    },
    cant_findPassword_button_txt: {
        fontSize: 15,
    },
    cant_singup_button: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal:wp('4%')
    },
    cant_singup_button_txt: {
        fontSize: 15,
    }
});

export default Login;