/** 담당자 채윤 
 * 240618 - 네트워크 문제 페이지 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function useApply(){
    // 지원현황
    async function getAppliedResume(){
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            const result = axios.get(`${API_URL}/api/auth/apply/applicant`,{
                    headers: {
                            Authorization: `Bearer ${token.token}`
                    },
            })
            .then(res => {
                    return res.data;
            })
            return result;
    }
    async function getReceivedResume(){
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            const result = axios.get(`${API_URL}/api/auth/apply/writer`,{
                    headers: {
                            Authorization: `Bearer ${token.token}`
                    },
            })
            .then(res => {
                    return res.data;
            })
            return result;
    }
    async function getResumeDetail(resumeId){
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            const result = axios.get(`${API_URL}/api/auth/apply/detail/${resumeId}`,{
                    headers: {
                            Authorization: `Bearer ${token.token}`
                    },
            })
            .then(res => {
                    return res.data;
            })
            return result;
    }
    async function getReceivedResumeList(boardId) {
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            const result = axios.get(`${API_URL}/api/auth/apply/list/${boardId}`,{
                    headers: {
                            Authorization: `Bearer ${token.token}`
                    },
            })
            .then(res => {
                    return res.data;
            })
            return result;
    }
    async function resumeProcess(type, resumeId) {
            const token = JSON.parse(await AsyncStorage.getItem('token'));
            if (type === 'Accept') {

            }
            const result = axios.put(`${API_URL}/api/auth/apply/first/${resumeId}`,{},{
                    headers: {
                            'Content-Type':'application/json',
                            Authorization: `Bearer ${token.token}`
                    },
            })
            .then(res => {
                    return res.data;
            })
            return result;
    }
    return {getAppliedResume, getReceivedResume, getResumeDetail, getReceivedResumeList, resumeProcess}
}