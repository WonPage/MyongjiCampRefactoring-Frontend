import { ActivityIndicator, View } from "react-native";

export default function Loading() {
    return (
        <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
            <ActivityIndicator size={'large'}/>
        </View>
    )
}