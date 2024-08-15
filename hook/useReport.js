/** 담당자 채윤 
 * 240811 - 게시글 및 댓글 신고 기능 구현 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function useReport(){
    /** 게시글 신고 */
    const reportPost = async (boardId, reason) => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const inputData = {
            targetType : 'Post',
            reporterId: token.userId,
            targetId: boardId,
            reason: reason
        }
        axios.post(`${API_URL}/api/auth/report/${inputData.targetId}`, inputData, {
            headers: { Authorization: `Bearer ${token.token}`, 'Content-Type':'application/json' }
        })
        .then(res => {
            if (res.status === 200) {
                Alert.alert("신고가 접수되었습니다.");
            } else {
                Alert.alert("신고를 실패했습니다.");
            }
        })
        .catch(err => {
            Alert.alert("신고를 실패했습니다.");
        })
    }
    /** 댓글 신고 */
    const reportComment = async (commentId, reason) => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const inputData = {
            targetType : 'Comment',
            reporterId: token.userId,
            targetId: commentId,
            reason: reason
        }
        axios.post(`${API_URL}/api/auth/report/${inputData.targetId}`, inputData, {
            headers: { Authorization: `Bearer ${token.token}`, 'Content-Type':'application/json' }
        })
        .then(res => {
            if (res.status === 200) {
                Alert.alert("신고가 접수되었습니다.");
            } else {
                Alert.alert("신고를 실패했습니다.");
            }
        })
        .catch(err => {
            Alert.alert("신고를 실패했습니다.");
        })
    }
    return {reportPost, reportComment};
}