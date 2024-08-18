/** 담당자 채윤 
 * 240622 - 댓글 조회, 작성, 삭제 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { Alert } from "react-native";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function useComment(){
    const navigation = useNavigation();
    const route = useRoute();

    const getComment = async(boardId) => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const data = axios.get(`${API_URL}/api/auth/recruit/${boardId}/comment`, {
            headers: { Authorization: `Bearer ${token.token}` },
        }).then(res=>{
            if (res.status===200){
                return {isFailed: false, commentList: res.data.data};
            } else {
                return {isFailed: true}
            }
        }).catch(err=>{
            return {isFailed: true}
        })
        return data;
    };
    const deleteComment = async(boardId, commentId) => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const data = axios.delete(`${API_URL}/api/auth/recruit/${boardId}/comment/${commentId}`, {
            headers: {Authorization: `Bearer ${token.token}` }
        })
        .then(res => {
            if (res.data.status===200){
                Alert.alert('안내', res.data.data);
                return {isFailed: false};
            } else {
                Alert.alert('안내', res.data.data);
                return {isFailed: true}
            }
        })
        .catch(err => {
            Alert.alert('안내', err.response.data.data);
            return {isFailed: true}
        })
        return data;
    }

    const writeComment = async(boardId, comment, cdepth = 0, isSecret, writer) => {
        if (comment === '') {
            Alert.alert('안내', '메세지를 입력해주세요.');
            return {isFailed:true};
        }
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const expoToken = JSON.parse(await AsyncStorage.getItem('expoToken'))
        // const aaa = {
        //     content: comment,
        //     cdepth: cdepth,
        //     isSecret: (isSecret ? 1 : 0),
        //     parentId: (writer?writer:undefined),
        //     expoToken:expoToken
        // }
        // console.log(aaa);
        const data = axios.post(`${API_URL}/api/auth/recruit/${boardId}/comment`, {
            content: comment,
            cdepth: cdepth,
            isSecret: (isSecret ? 1 : 0),
            parentId: (writer?writer:undefined),
            expoToken:expoToken
        }, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token.token}`},
        }).then(res=>{
            if (res.data.status===200){
                // console.log(token)
                // Alert.alert('안내', res.data.data); 
                return {isFailed:false};
            } else {
                Alert.alert('안내', res.data.data);
                return {isFailed:true};
            }
        }).catch(err=>{
            Alert.alert('안내', err.response.data.data);
            return {isFailed:true};
        })
        return data
    };

    return { getComment, deleteComment, writeComment };
};