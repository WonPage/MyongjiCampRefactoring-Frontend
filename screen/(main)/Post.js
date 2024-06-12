import useUsers from "../../hook/useUsers"
import { useFocusEffect } from "@react-navigation/native";

const Post = ({navigation, route}) => {
    const {sessionCheck} = useUsers();
    useFocusEffect(()=>{
        sessionCheck(route);
    })
    return(
        <></>
    )
}

export const PostButton = () => {
    return (
        <></>
    )
}

export default Post;