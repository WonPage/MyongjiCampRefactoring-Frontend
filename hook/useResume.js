import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function useResume(){
    // 이력서 페이지
    const getResumeList = async() => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const result = axios.get(`${API_URL}/api/auth/resume`, {
            headers: {Authorization: `Bearer ${token.token}`}
        })
        .then(res => {
            return res.data.data;
        })
        .catch(err => {
            console.log(err)
        });
        return result;
    }
    const getResumeDetail = async(resumeId) => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const result = axios.get(`${API_URL}/api/auth/resume/${resumeId}`, {
            headers: {
                Authorization: `Bearer ${token.token}`,
            }
        }).then(res => {
            return res.data.data;
        })
        .catch(err=>{
            Alert.alert('경고', '문제가 발생했습니다.');
        })
        return result;
    }
    const postResume = async(resumeData) => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const result = axios.post(`${API_URL}/api/auth/resume`, resumeData, {
            headers: {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${token.token}`
            }})
        .then(res => {
            Alert.alert('안내', res.data.data);
            return false;
        })
        .catch(error=> {
            Alert.alert('경고', '글 작성에 실패하였습니다.');
            return true;
        })
        return result;
    }
    const updateResume = async(resumeId, resumeData) => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const isFailed = axios.put(`${API_URL}/api/auth/resume/${resumeId}`, resumeData, {
            headers: {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${token.token}`
            }})
        .then(res => {
            Alert.alert('안내', res.data.data);
            return false
        })
        .catch(error=> {
            Alert.alert('경고', '글 수정에 실패하였습니다.');
            return true
        })
        return isFailed;
    }
    const deleteResume = async(resumeId) => {
        try{
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            const result = axios.delete(`${API_URL}/api/auth/resume/${resumeId}`, {
                headers: {Authorization: `Bearer ${token.token}`}
            })
            .then(res => {
                const result = res.data.data;
                Alert.alert('안내', result);
                return false
            })
            .catch(err=>{
                Alert.alert('경고', err);
                return true;
            })
            return result;
        } catch (error) {
            console.log(error);
        }
    }
    return {getResumeList, getResumeDetail, postResume, updateResume, deleteResume}
}