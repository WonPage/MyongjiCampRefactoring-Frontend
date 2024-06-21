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
        const result = axios.get(`${API_URL}/api/board?${params.toString()}`)
        .then(res=>{
    //        console.log('res.data.data : ', res.data.data);
            return res.data.data; //axios로 값을 얻어오기 위함
        })
        .catch(error=>{
            console.log(error);
        })

  //      console.log('result : ',result)
        return result; //결과
    }

    return {getRecruitList}
}