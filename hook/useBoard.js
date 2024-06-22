/** 담당자 채윤 
 * 240622 - 게시판 작성하기, 상세보기 조회 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"
import { Alert } from "react-native";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function useBoard(){
    /** 게시글 작성하기 */
    const postBoard = async(postData) => {
        const {title, content, preferredLocation, expectedDuration, roleAssignments} = postData;
        if (title.length < 1 || content.length < 1 || preferredLocation.length < 1 || expectedDuration.length < 1) {
            Alert.alert('안내', '빈칸을 채워주세요.');
            return {isFailed:true};
        }
        let roleCheck = new Set();
        roleAssignments.map((role)=>roleCheck.add(role.role))
        if (roleCheck.size !== roleAssignments.length) {
            Alert.alert('안내', '직무는 중복선택 할 수 없습니다.');
            return {isFailed:true};
        }
        let flag = false;
        let count = 0;
        roleAssignments.map((value) => {
            if (value.appliedNumber > value.requiredNumber) {
                flag = true;
                Alert.alert('안내', '현재인원은 필요인원보다 클 수 없습니다.');
                return {isFailed:true};
            }
            if (value.requiredNumber === '' || value.requiredNumber === 0){
                flag = true;
                Alert.alert('안내', '필요인원은 0이 될 수 없습니다.');
                return {isFailed:true};
            }
            if (value.appliedNumber === ''){
                value.appliedNumber = 0;
            }
            if (value.requiredNumber === value.appliedNumber) {
                count += 1;
            }
        })
        if (!flag && roleAssignments.length === count) {
            flag = true;
            Alert.alert('안내', '모든 인원이 꽉 차 있습니다.');
            return {isFailed:true};
        }
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const data = axios.post(`${API_URL}/api/auth/recruit`, postData, {
            headers : {
                'Content-Type':'application/json',
                Authorization: `Bearer ${token.token}`,
            }
        }).then(res => {
            if (res.data.status ===200){
                Alert.alert('안내', res.data.data);
                return {isFailed:false};
            } else {
                Alert.alert('안내', res.data.data);
                return {isFailed:true};
            }
        }).catch(err=>{
            Alert.alert('안내', err.response.data.data);
            return {isFailed:true};
        })
        return data;
    }
    /** 게시글 상세보기 */
    const getBoardDetail = async(boardId) => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const data = axios.get(`${API_URL}/api/auth/recruit/${boardId}`, {
            headers: {Authorization: `Bearer ${token.token}` }
        })
        .then(res => {
            if (res.status===200){
                return {isFailed: false, userId: token.userId, postData: res.data.data}
            } else {
                return {isFailed: true}
            }
        })
        .catch(err => {
            console.log('게시글 상세보기 오류 :',err.response.data);
            Alert.alert('안내', '게시글 불러오기에 실패하였습니다.');
            return {isFailed: true};
        })
        return data;
    }
    /** 게시글 스크랩 여부 확인하기 */
    const checkScrap = async(boardId) => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const data = axios.get(`${API_URL}/api/auth/scrap/${boardId}`, {
            headers: {Authorization: `Bearer ${token.token}`}
        })
        .then(res => {
            if (res.status===200){
                return {isFailed:false, isScrap:res.data.data}
            } else {
                return {isFailed:true}
            }
        })
        .catch(err=>{
            return {isFailed:true}
        })
        return data;
    }
    /** 게시글 삭제하기  */
    const deleteBoard = async(boardId) => {
        const token = JSON.parse(await AsyncStorage.getItem('token'));
        const data = axios.delete(`${API_URL}/api/auth/recruit/${boardId}`, {
            headers: {Authorization: `Bearer ${token.token}` }
        })
        .then(res => {
            if (res.data.status === 200){
                Alert.alert('안내', res.data.data);
                return {isFailed:false};
            } else {
                Alert.alert('안내', res.data.data);
                return {isFailed:true};
            }
        })
        .catch(err => {
            Alert.alert('안내', err.response.data.data);
            return {isFailed:true};
        })
        return data;
    }
    return {postBoard, getBoardDetail, checkScrap, deleteBoard}
}