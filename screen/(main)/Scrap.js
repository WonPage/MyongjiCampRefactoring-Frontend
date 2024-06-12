import useUsers from "../../hook/useUsers";
import { useFocusEffect } from "@react-navigation/native";

const Scrap = ({route}) => {
    const {sessionCheck} = useUsers();
    useFocusEffect(()=>{
        sessionCheck(route);
    })
    return(
        <></>
    )
}

export default Scrap;