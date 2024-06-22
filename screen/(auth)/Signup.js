/** 담당자 채윤 
 * 240621 - 회원가입 페이지 UI 및 기능 구현 완료 */
import { useEffect, useRef, useState } from "react";
import { Text, StyleSheet, View, Image, TextInput, Alert, TouchableOpacity } from "react-native";
import * as Progress from 'react-native-progress';
import { Picker } from "@react-native-picker/picker";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import useSignup from "../../hook/useSignup";

const Signup = ({navigation}) => {
    const inputRef = useRef();
    const {emailVerify, verifyCode} = useSignup();
    const [isPressed, setIsPressed] = useState(false);
    const [email, setEmail] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const handleTextClick = () => {inputRef.current.focus()}
    const handleCodeSend = () => {
        setIsPressed(true);
        emailVerify(email).then(isFailed=>{
            if (!isFailed){
                setIsCodeSent(true);
                setTimerActive(true);
            }
        })
        .finally(()=>{setIsPressed(false)});
    }
    const [code, setCode] = useState('');
    const [isCodeEmpty, setIsCodeEmpty] = useState(true);
    const [isWrong, setIsWrong] = useState(false);
    const [isExpire, setIsExpire] = useState(false);
    const [timerActive, setTimerActive] = useState(false);
    const [second, setSecond] = useState(121);
    useEffect(()=>{
        let interval = null;
        if (timerActive){
            interval = setInterval(()=>{
                setSecond(prev=>{
                    if (prev>0) {
                        return prev-1;
                    }
                    else {
                        setIsExpire(true);
                        setTimerActive(false);
                        setCode('');
                        clearInterval(interval);
                        return 121;
                    }
                });
            },1000)
        }
        return ()=>clearInterval(interval);
    },[timerActive])
    useEffect(()=>{
        if (code.length===4) setIsCodeEmpty(false);
        else setIsCodeEmpty(true);
    },[code])
    const handleVerifyCode = () => {
        navigation.push('SignupPassword', {email:email});
        verifyCode(email, code).then(isFailed=>{
            if (!isFailed) {
                //다음 단계로 이동
                setCode('');
                navigation.push('SignupPassword', {email:email});
            } else {
                setIsWrong(true);
                setCode('');
            }
        })
    }
    const handleResendCode = () => {
        setIsPressed(true);
        emailVerify(email).then(isFailed=>{
            if (!isFailed){
                setIsCodeSent(true);
                setTimerActive(true);
            }
        })
        .finally(()=>{
            setIsPressed(false);
            setSecond(121);
            setIsExpire(false);
            setIsWrong(false);
        });
    }
    return (
        <>
            <Progress.Bar style={styles.progress} progress={0.33} width={wp('100%')} height={hp('1%')} animated={true} color={'#002E66'} />
            <View style={styles.container}>
                <View style={styles.top_blank}></View>
                <View style={styles.icon_container}>
                    <Image style={styles.myongji_icon} source={require('../../assets/myongjicamp-title.png')} />
                </View>
                <View style={styles.text_container}>
                    <Text style={styles.text}>학교 인증을 완료해주세요.</Text>
                </View>
                <View style={styles.email_container}>
                    <View style={styles.email_box}>
                        <TextInput ref={inputRef} style={styles.email_value} placeholder="이메일" placeholderTextColor={"gray"} value={email}
                            onChangeText={setEmail} maxLength={30} onSubmitEditing={handleCodeSend} />
                        <Text style={styles.email_example} onPress={handleTextClick}>@mju.ac.kr</Text>
                    </View>
                </View>
                {isCodeSent ?
                    (<>
                        <View style={styles.code_container}>
                            <View style={isWrong ? styles.code_input_wrong : styles.code_input}>
                                <TextInput onChangeText={setCode} value={code} maxLength={4} keyboardType="numeric"
                                    placeholder={isWrong ? "다시 입력해주세요." : "인증코드"} placeholderTextColor={isWrong ? 'red' : undefined}/>
                                <Text style={isWrong? { fontSize: 13, color: 'red' } : { fontSize: 13, color: 'gray' }}>
                                    {isExpire ? "시간만료" : `${(Number.parseInt(second/60)).toString().padStart(2, '0')}:${(second%60).toString().padStart(2, '0')}`}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.code_resend}
                                onPress={handleResendCode}
                                activeOpacity={0.7}><Text style={styles.resend_text}>재전송</Text></TouchableOpacity>
                        </View>
                        <View style={styles.code_confirm_container}>
                            <TouchableOpacity style={isCodeEmpty ? styles.code_not_confirm : styles.code_confirm}
                                disabled={isCodeEmpty}
                                onPress={handleVerifyCode}
                                activeOpacity={0.7}><Text style={styles.confirm_text}>확인</Text></TouchableOpacity>
                        </View>
                    </>) :
                    (<View style={styles.button_container}>
                        <TouchableOpacity
                            disabled={isPressed}
                            activeOpacity={0.7}
                            style={styles.email_send_button}
                            onPress={handleCodeSend}><Text style={styles.send_button_text}>인증번호 보내기</Text>
                        </TouchableOpacity>
                    </View>)}
                <View style={styles.bottom_blank}></View>
            </View>
        </>
    )
}

export function SignupPassword({navigation, route}){
    const {email} = route.params;
    const [progress, setProgress] = useState(0.33);
    const [isPasswordWrong, setIsPasswordWrong] = useState(false);
    const [isPasswordCheckWrong, setIsPasswordCheckWrong] = useState(false);
    useEffect(()=>{
        setProgress(0.66);
    },[]);
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const {passwordChecking} = useSignup();
    const handlePasswordCheck = () => {
        const data = passwordChecking(password, passwordCheck);
        if (data.isFailed){
            setIsPasswordWrong(data.passwordWrong);
            setIsPasswordCheckWrong(data.passwordCheckWrong);
        } else {
            navigation.navigate('SignupNickname', {email:email, password:password});
            setIsPasswordWrong(data.passwordWrong);
            setIsPasswordCheckWrong(data.passwordCheckWrong);
        }
    }
    return (
        <>
        <Progress.Bar
            style={styles.progress}
            progress={progress} width={wp('100%')} height={10} animated={true}
            color={'#002E66'} />
        <View style={styles.container}>
            <View style={styles.top_blank}></View>
            <View style={styles.icon_container}>
                <Image
                    style={styles.myongji_icon}
                    source={require('../../assets/myongjicamp-title.png')} />
            </View>
            <View style={styles.text_container}>
                <Text style={styles.text}>안전한 비밀번호를 만들어주세요.</Text>
            </View>
            <View style={styles.password_container}>
                <TextInput style={isPasswordWrong ? styles.password_input_wrong : styles.password_input}
                    placeholder={isPasswordWrong ? "영문,숫자,특수문자 포함 8글자 이상" : "비밀번호 입력"}
                    placeholderTextColor={isPasswordWrong ? 'red' : undefined}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry />
                <TextInput style={isPasswordCheckWrong ? styles.password_check_input_wrong : styles.password_check_input}
                    placeholder={"비밀번호 재입력"}
                    placeholderTextColor={isPasswordCheckWrong ? 'red' : undefined}
                    value={passwordCheck}
                    onChangeText={setPasswordCheck}
                    secureTextEntry
                    onSubmitEditing={handlePasswordCheck} />
            </View>
            <View style={styles.password_button_container}>
                <TouchableOpacity
                    style={styles.password_button}
                    onPress={handlePasswordCheck}
                    activeOpacity={0.7}><Text style={styles.password_button_text}>확인</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.bottom_blank}></View>
        </View>
        </>
    )
}

export function SignupNickname({navigation, route}){
    const {email, password} = route.params;
    const {nicknameChecking, signup} = useSignup();
    const [progress, setProgress] = useState(0.66);
    useEffect(()=>{
        setProgress(1);
    },[])   
    const [ nickname, setNickname ] = useState('');
    const [ nicknameWrong, setNicknameWrong ] = useState(false);
    const [ checked, setChecked ] = useState(false);
    useEffect(()=>{
        setChecked(false);
    }, [nickname])
    const profileIcons =[
        {id: 1, name: 'ai', image: require('../../assets/profile-icon/ai.jpg')},
        {id: 2, name: 'cloud', image: require('../../assets/profile-icon/cloud.jpg')},
        {id: 3, name: 'design', image: require('../../assets/profile-icon/design.jpg')},
        {id: 4, name: 'dog', image: require('../../assets/profile-icon/dog.jpg')},
        {id: 5, name: 'rabbit', image: require('../../assets/profile-icon/rabbit.jpg')},
    ]
    const [ profileIcon, setProfileIcon ] = useState({id: 1, name: 'ai', image: require('../../assets/profile-icon/ai.jpg')});
    const handleNicknameCheck = () => {
        const data = nicknameChecking(nickname);
        if (!data.isFailed){
            setChecked(true);   
        }
        setNicknameWrong(data.nicknameWrong);
    }
    const handleSignupComplete = () => {
        if (!checked) {
            setNicknameWrong(true);
            return Alert.alert('경고', '닉네임 중복검사를 해주세요.');
        }
        const userData = {
            email: `${email}@mju.ac.kr`,
            password: password,
            nickname: nickname,
            profileIcon: profileIcon.id,
        }
        signup(userData).then(data=>{
            if (!data.isFailed){
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                })
            }
        })
    }
    return (
        <>
        <Progress.Bar style={styles.progress} progress={progress} width={wp('100%')} height={10} animated={true} color={'#002E66'} />
        <View style={[styles.container, {alignItems:'center'}]}>
            <View style={styles.top_blank}></View>
            <View style={[styles.icon_container, { marginBottom:hp('5%'), width:hp('20%')}]}>
                <Image source={profileIcon.image} style={{borderRadius:100, width:hp('20%'), height:hp('20%')}}/>
                <Picker
                style={{width:'100%', height:'90%', opacity:0, position:'absolute'}}
                selectedValue={profileIcon.id}
                onValueChange={(value) => {
                    const selectedIcon = profileIcons.find((icon) => icon.id === value);
                    setProfileIcon(selectedIcon);
                }}>
                {profileIcons.map((icon) => (
                    <Picker.Item key={icon.id} label={icon.name} value={icon.id} />
                ))}
                </Picker>
            </View>
            <View style={styles.nickname_container}>
                <TextInput
                    style={nicknameWrong ? styles.nickname_input_wrong : styles.nickname_input}
                    placeholder="닉네임" 
                    placeholderTextColor={nicknameWrong? 'red' : undefined}
                    onChangeText={setNickname}
                    value={nickname}
                    onSubmitEditing={handleNicknameCheck} />
                <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={checked}
                    style={checked ? styles.nickname_check_done : styles.nickname_check}
                    onPress={handleNicknameCheck}>
                    <Text style={{color:'white'}}>중복확인</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.signup_button_container}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.signup_button}
                    onPress={handleSignupComplete}>
                    <Text style={styles.signup_button_text}>회원가입 완료</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.bottom_blank}></View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        marginHorizontal: wp('10%'),
    },
    progress:{
        alignSelf: 'stretch',
        borderWidth: 0,
        backgroundColor: '#E9ECEF',
    },
    icon_container:{height:hp('23%'), justifyContent: "center", alignItems: "center"},
    text_container: {height:hp('8%'), justifyContent: 'center', alignItems: 'center'},
    email_container: {height:hp('18%'), justifyContent: 'center', alignItems: 'center'},
    button_container: {height:hp('8%'), justifyContent: 'center', alignItems: 'center'},
    top_blank:{height:hp('12%')},
    bottom_blank:{height:hp('12%')},
    myongji_icon: {objectFit:'scale-down', flex:1},
    text: {fontSize: 18},
    email_box: { 
        height: hp('7.5%'),
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: wp('5%'),
    },
    email_value: {flex: 1},
    email_example: {color: 'gray'},
    email_send_button: {
        width: 140,
        height: 50,
        borderRadius: 30,
        backgroundColor: "#002E66",
        justifyContent: "center",
        alignItems: 'center',
    },
    send_button_text:{
        color: 'white'
    },
    code_container:{
        height:hp('7%'),
        flexDirection: 'row',
        alignItems: 'stretch',
        marginBottom: 35,
    },
    code_input:{
        width:wp('53%'),
        borderWidth: 1,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginRight: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between'
    },
    code_input_wrong:{
        width:wp('53%'),
        borderWidth: 1,
        borderColor: 'red',
        paddingHorizontal: 16,
        borderRadius: 10,
        marginRight: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between'
    },
    code_resend:{
        width: wp('20'),
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#008FD5',
    },
    resend_text:{
        color: 'white',
    },
    code_confirm_container:{
        alignItems: 'center',
    },
    code_not_confirm:{
        height:hp('7%'),
        borderRadius: 20,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#999999"
    },
    code_confirm:{
        height:hp('7%'),
        borderRadius: 20,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#002E66"
    },
    confirm_text: {
        color: 'white',
    },
    password_container: {
    },
    password_input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 16,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    password_input_wrong: {
        height: 50,
        borderWidth: 1,
        borderRadius: 16,
        marginBottom: 10,
        paddingHorizontal: 20,
        borderColor: 'red',
    },
    password_check_input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 16,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    password_check_input_wrong: {
        height: 50,
        borderWidth: 1,
        borderRadius: 16,
        marginBottom: 10,
        paddingHorizontal: 20,
        borderColor: 'red',
    },
    password_button_container:{
        flex: 1,
        alignItems: 'center'
    },
    password_button:{
        width: 140,
        height: 50,
        borderRadius: 30,
        backgroundColor: "#002E66",
        justifyContent: "center",
        alignItems: 'center',
    },
    password_button_text:{
        color: 'white',
    },
    nickname_container: {
        height: hp('8%'),
        flexDirection: 'row',
        marginBottom: 35,
    },
    nickname_input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 16,
        marginRight: 16,
        paddingHorizontal: 20,
    },
    nickname_input_wrong: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 16,
        marginRight: 16,
        paddingHorizontal: 20,
        borderColor: 'red',
    },
    nickname_check: {
        width: 60,
        backgroundColor: "#008FD5",
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nickname_check_done:{
        width: 60,
        backgroundColor: "gray",
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signup_button_container: {
        alignItems: 'center'
    },
    signup_button: {
        width: wp('35%'),
        height: hp('8%'),
        borderRadius: 30,
        backgroundColor: "#002E66",
        justifyContent: "center",
        alignItems: 'center',
    },
    signup_button_text: {
        color: 'white',
    }

});

export default Signup;