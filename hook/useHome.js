import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function useHome(){
    const getRecruitList = async(recruits) => {
        const params = new URLSearchParams();
        params.append('keyword','');
        params.append('pageNum',recruits[0]);
        params.append('direction',recruits[1]);
        params.append('boardType',recruits[2]);
        params.append('status',recruits[3]);
        const result = axios.get(`${API_URL}/api/board?${params.toString()}`, {
            headers:{'Cache-Control':'no-store', Pragma: 'no-store', Expires: '0',}, timeout:5000
        })
        .then(res=>{
            return res.data.data; //axios로 값을 얻어오기 위함
        })
        .catch(error=>{
            console.log('에러:',error);
        })

    //    console.log('result : ',result)
        return result; //결과
    }

    return {getRecruitList}
}