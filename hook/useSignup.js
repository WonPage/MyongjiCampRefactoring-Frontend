import axios from "axios";
import { Alert } from "react-native";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function useSignup(){
    /** 이메일 인증 */
    const emailVerify = async(email) => {
        const regex = /^[a-zA-Z0-9]+$/
        if (email===''){
            Alert.alert('경고', '이메일을 입력해주세요.');
            return true;
        }
        if (!regex.test(email)){
            Alert.alert('경고', '영문, 숫자만 입력 가능합니다.');
            return true;
        }
        const isFailed = axios.post(`${API_URL}/api/email`, {email:`${email}@mju.ac.kr`}, {
            headers: {'Content-Length':'application/json'}
        })
        .then(res => {
            if (res.status===200){
                Alert.alert('안내', '인증번호를 전송했습니다.\n입력한 이메일을 통해 인증번호를 확인하세요.'); 
                return false;
            }
            else {
                Alert.alert('안내', res.data.data);
                return true;
            }
        })
        .catch(err=>{
            Alert.alert('안내', err.response.data);
            return true;
        })
        return isFailed;
    }
    /** 인증코드 확인 */
    const verifyCode = (email, code) => {
        const isFailed = axios.post(`${API_URL}/api/email/verify`,{email:`${email}@mju.ac.kr`, code:code}, {
            headers: {"Content-Type":'application/json'}
        }).then(res=>{
            if (res.data.status===200){
                return false;
            } else {
                Alert.alert('경고', '인증번호가 일치하지 않습니다.');
                return true;
            }
        })
        .catch(err => {
            Alert.alert('경고', '인증번호가 일치하지 않습니다.');
            return true;
        })
        return isFailed;
    }
    /** 비밀번호 검사 */
    const passwordChecking = (password='', passwordCheck='') => {
        const passwordRegExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*&])(?=.*[0-9]).{8,20}$/; //안전 비밀번호 정규식
        if (password.length === 0){
            Alert.alert('경고', '비밀번호를 입력해주세요.');
            return {isFailed:true, passwordWrong:true};
        } else if (!passwordRegExp.test(password)){
            Alert.alert('경고', '안전하지 않은 비밀번호입니다.\n\n영문, 숫자, 특수문자 포함 8글자 이상의 비밀번호를 설정해주세요.');
            return {isFailed:true, passwordWrong:true};
        } else if (passwordCheck.length ===0){
            Alert.alert('경고', '비밀번호 재입력을 입력해주세요.')
            return {isFailed:true, passwordWrong:false, passwordCheckWrong:true};
        } else if (password !== passwordCheck){
            Alert.alert('경고', '동일한 비밀번호를 입력해주세요.')
            return {isFailed:true, passwordWrong:false, passwordCheckWrong:true};
        }
        return {isFailed:false, passwordWrong:false, passwordCheckWrong:false};
    }
    /** 닉네임 중복검사 */
    const nicknameChecking = (nickname='') => {
        const nicknameRegex = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$/
        if (nickname===''){
            Alert.alert('경고' , '닉네임을 입력해주세요.');
            return {isFailed:true};
        } else if (!nicknameRegex.test(nickname)){
            Alert.alert('경고', '닉네임은 특수문자 제외 2자 이상 8자 이하 입력해주세요.');
            return {isFailed:true};
        }
        Alert.alert('안내', '사용 가능한 닉네임입니다.');
        return {isFailed:false, nicknameWrong:false}
    }
    /** 회원가입 */
    const signup = (userData) => {
        const data = axios.post(`${API_URL}/api/members`, userData, { headers: { 'Content-Type': 'application/json'}})
        .then(res => {
            if (res.data.status === 200){
                Alert.alert('안내', '회원가입에 성공했습니다.');
                return {isFailed:false};
            } else {
                Alert.alert('경고', '회원가입에 실패했습니다.');
                return {isFailed:true};
            }
        })
        .catch(error => {
            Alert.alert('경고', '회원가입에 실패했습니다.');
            // const result = error.response.data;
            // Alert.alert('경고', result.data);
            return {isFailed:true};
        })
        return data;
    }
    return {emailVerify, verifyCode, passwordChecking, nicknameChecking, signup}
}