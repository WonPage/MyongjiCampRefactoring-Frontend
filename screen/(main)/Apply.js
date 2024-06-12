import { useEffect } from "react";
import useUsers from "../../hook/useUsers";
import { useFocusEffect } from "@react-navigation/native";

const Apply = ({route}) => {
    const {sessionCheck} = useUsers();
    useFocusEffect(()=>{
        sessionCheck(route);
    })
    return(
        <></>
    )
}

export default Apply;