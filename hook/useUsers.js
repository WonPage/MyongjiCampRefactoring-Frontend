import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Buffer } from "buffer";
import { Alert } from "react-native";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const useUsers = () => {
    const navigation = useNavigation();
    /** 로그인 시도 */
    const tryLogin = (inputData, stayLoggedIn) => {
        axios.post(`${API_URL}/api/login`, inputData, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
            timeout:3000
        }).then(res=>{
            const result = res.data;
            const token = result.data.token;
            const decoded = Buffer.from(token, 'base64').toString('ascii');
            const decoded1 = decoded.split(',"userId":')[1];
            const userId = decoded1.split(',"iat"')[0];
            const refresh = result.data.refreshToken;
            const tokenExp = new Date(new Date().getTime() + 60 * 1000 * 60 * 12); //12시간 (만료 시간)
            const refreshExp = new Date(new Date().getTime() + 60 * 1000 * 60 * 5); //5시간 (만료 갱신 기준시간)
            const loginData = {
                userId: parseInt(userId),
                token: token,
                refresh: refresh,
                session: (stayLoggedIn ? true : undefined),
                tokenExp: tokenExp.toISOString(),
                refreshExp: refreshExp.toISOString()
            }
            AsyncStorage.setItem('token', JSON.stringify(loginData));
            navigation.replace('MainNavigation');
            return Alert.alert('안내', result.data.message);
        }).catch(err=>{
            // 로그인 실패 중, 서버에서 메세지를 가져왔다면 해당 메세지를, 안가져왔다면 네트워크 오류 메세지
            if (!err.response){
                return Alert.alert('경고', '서버 연결에 실패했습니다.');
            } 
            return Alert.alert('경고', err.response.data.data);
        })
    }
    /** 로그아웃 */
    const logout = async() => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        axios.post(`${API_URL}/api/auth/logout`, {}, {
            headers:{'Content-Type':'application/json', Authorization: `Bearer ${token.token}`}
        })
        .then(res => {
            AsyncStorage.clear();
            const data = res.data;
            console.log('Logout :', data);
            navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
            });
        })
    }
    /** 세션 체크 */
    const sessionCheck = async(route) => {
        const pageName = route.name;
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        if (pageName==='Login'){
            // 1. 세션이 존재하지 않음
            if (token?.session === undefined) {
                console.log('Session Check : 세션이 존재하지 않습니다.');
            }
            // 2. 세션이 존재하고 만료일이 지나지않음
            else if (token?.session && new Date(token.refreshExp) > new Date() && new Date(token.tokenExp) > new Date()) {
                console.log('Session Check : 세션이 존재합니다.');
                navigation.reset({
                    index:0,
                    routes:[{name:'MainNavigation'}],
                });
            }
            // 3. 세션이 존재하고 만료일이 얼마 남지않음. Refresh
            else if (new Date(token.refreshExp)<= new Date() && new Date(token.tokenExp) > new Date()){
                console.log('Session Check : 토큰이 만료되기 전입니다. 토큰을 재요청합니다.');
                axios.post(`${API_URL}/api/refresh`, {}, {
                    headers: {
                        'Content-Type':'application/json', Authorization: `Bearer ${token.refresh}`
                    }
                }).then(res => {
                    const decoded = Buffer.from(JSON.stringify(token), 'base64').toString('ascii');
                    const decoded1 = decoded.split(',"userId":')[1];
                    const userId = decoded1.split(',"iat"')[0];
                    const result = res.data.data;
                    const tokenExp = new Date(new Date().getTime() + 60 * 1000 * 60 * 12); //실제 만료 24시간 - login이랑 연결됨
                    const refreshExp = new Date(new Date().getTime() + 60 * 1000 * 60 * 5); //20시간을 만료갱신 기준으로 삼을 예정
                    const tokenData = {
                        userId: parseInt(userId), 
                        token: result.token,
                        refresh: result.refreshToken,
                        session: true,
                        tokenExp: tokenExp.toISOString(),
                        refreshExp: refreshExp.toISOString()
                    }
                    AsyncStorage.setItem('token', JSON.stringify(tokenData));
                    navigation.reset({
                        index:0,
                        routes:[{name:'MainNavigation'}],
                    });
                })
                .catch(err=>{
                    console.log(err);
                })
            }
            // 4. 세션이 존재하고 만료일이 지남
            else {
                console.log('Session Check : 토큰이 만료되었습니다. 다시 로그인해주세요.')
                AsyncStorage.clear();
            }
        } 
        // 로그인 페이지가 아닌 다른 페이지의 Session Check
        else {
            if (token?.token) {
                console.log(pageName,': 토큰 체크 완료.');
            } else {
                console.log('Session Check : 토큰이 만료되었습니다. 다시 로그인해주세요.')
                AsyncStorage.clear();
                navigation.navigate('Login');
            }
        }
    } 
    /** 프로필 조회 */
    const getProfile = async() => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        if (!token.token) return null;
        const response = await axios.get(`${API_URL}/api/auth/profile`, {
            headers: {Authorization: `Bearer ${token.token}`}
        })
        const result = response.data.data;
        return result
    }
    /** 아이콘 변경 */
    const updateIcon = async(iconId) => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        axios.put(`${API_URL}/api/auth/icon/update`, {profileIcon:iconId},{
            headers: {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${token.token}`
            }
        }).then(async(res)=>{
            if(res.data.status===200){
                const newTokenValue = res.data.data.token;
                const newToken = {...token, token: newTokenValue};
                AsyncStorage.setItem('token', JSON.stringify(newToken));
                return true;
            } else {
                return false;
            }
        })
    }
    /** 닉네임 변경 */
    const updateNickname = async(newNickname) => {
        try{
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            const res = await axios.put(`${API_URL}/api/auth/nickname/update`, {nickname:newNickname},{
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${token.token}`,
                },
                
            });
            if(res.data.status===200){
                const newTokenValue = res.data.data.token;
                const newToken = {...token, token: newTokenValue};
                AsyncStorage.setItem('token', JSON.stringify(newToken));
                return true
            } else {
                return false
            }
        }
        catch(err){
            if (!err.response){
                return Alert.alert('경고', err.message);
            } else {
                return Alert.alert('경고', err.response.data.data);
            }
        }
    }

    return {tryLogin, logout, sessionCheck, getProfile, updateIcon, updateNickname};
}

export default useUsers;