/** 담당자 채윤 
 * 240618 - 지원서 훅 설계 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"
import { Alert } from "react-native";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function useApply() {
    const navigation = useNavigation();

    async function getAppliedResume() {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const result = axios.get(`${API_URL}/api/auth/apply/applicant`, {
            headers: {

                Authorization: `Bearer ${token.token}`
            },
        })
            .then(res => {
                return res.data;
            })
        return result;
    }
    async function getReceivedResume() {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const result = axios.get(`${API_URL}/api/auth/apply/writer`, {
            headers: {
                Authorization: `Bearer ${token.token}`
            },
        })
            .then(res => {
                return res.data;
            })
        return result;
    }
    async function getResumeDetail(resumeId) {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const result = axios.get(`${API_URL}/api/auth/apply/detail/${resumeId}`, {
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
        const result = axios.get(`${API_URL}/api/auth/apply/list/${boardId}`, {
            headers: {
                Authorization: `Bearer ${token.token}`
            },
        })
            .then(res => {
                return res.data;
            })
        return result;
    }
    async function resumeProcess(resumeId, firstStatus, resultContent, resultUrl = undefined) {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const inputData = {
            firstStatus: firstStatus,
            resultContent: resultContent,
            resultUrl: resultUrl 
        }
        const result = axios.put(`${API_URL}/api/auth/apply/first/${resumeId}`, inputData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.token}`
            },
        })
        .then(res => {
            if (res.data.status === 200) {
                Alert.alert(res.data.data);
                navigation.replace('MainNavigation');
            } else {
                Alert.alert("처리에 실패했습니다.");
            }
        })
        .catch(err => {
            Alert.alert("처리에 실패했습니다.");
        })
        return result;
    }
    async function resumeFinalProcess(resumeId, finalStatus) {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const inputData = {
            finalStatus: finalStatus
        }
        const result = axios.put(`${API_URL}/api/auth/apply/final/${resumeId}`, inputData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.token}`
            },
        })
        .then(res => {
            if (res.data.status === 200) {
                console.log(res.data);
                Alert.alert(res.data.data);
                navigation.replace('MainNavigation');
            } else {
                Alert.alert(res.data.data);
                // console.log(res.data.data);
            }
        })
        .catch(err => {
            Alert.alert("처리에 실패했습니다.");
        })
        return result;
    }
    async function cancleApply(applyId) {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        axios.delete(`${API_URL}/api/auth/apply/${applyId}`, {
            headers: { Authorization: `Bearer ${token.token}` }
        })
        .then(res => {
            if (res.data.status === 200) {
                Alert.alert("지원이 취소었습니다.");
            } else {
                Alert.alert("안내", res.data.data);
            }
        })
        .catch(err => {
            Alert.alert("지원 취소를 실패했습니다.");
        })
    }
    async function completeRecruit(boardId, boardData) {
        const boardDataList = boardData.roleAssignments.filter(role=>role.appliedNumber>0);
        if (boardDataList.length === 0){
            Alert.alert("모집된 인원이 한 명도 없습니다.");
            return {isFailed:true};
        }
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const putData = {
            title: boardData.title,
            content: boardData.content,
            status: "RECRUIT_COMPLETE",
            preferredLocation: boardData.preferredLocation,
            expectedDuration: boardData.expectedDuration,
            roleAssignments: boardData.roleAssignments
        }
        const data = axios.put(`${API_URL}/api/auth/recruit/${boardId}`, putData, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token.token}` }
        })
        .then(res => {
            if (res.data.status === 200) {
                Alert.alert("모집 마감되었습니다.");
                navigation.replace('MainNavigation');
                return {isFailed:false};
            } else {
                Alert.alert("모집 마감을 실패했습니다.");
                return {isFailed:true};
            }
        })
        .catch(err => {
            Alert.alert("모집 마감을 실패했습니다.");
            return {isFailed:true};
        })
        return data;
    }

    /** 지원 보내기 */
    const sendApply = async(boardId, resume, selectedRole) => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        axios.get(`${API_URL}/api/auth/resume/${resume.id}`, {
            headers:{"Content-Type":'application/json', Authorization: `Bearer ${token.token}`}
        })
        .then(res => {
            const content = res.data.data.content;
            const url = res.data.data.url;
            const inputData = {
                role : selectedRole,
                content : content,
                url : url
            }
            axios.post(`${API_URL}/api/auth/apply/${boardId}`, inputData, {
                headers: { Authorization: `Bearer ${token.token}`, "Content-Type":"application/json" }
            })
            .then(res => {
                navigation.goBack();
                Alert.alert("안내", res.data.data);
            })
        })
    }

    return { getAppliedResume, getReceivedResume, getResumeDetail, getReceivedResumeList, resumeProcess, cancleApply, completeRecruit,
        sendApply, resumeFinalProcess
     }
}