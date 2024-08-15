import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { Pressable, Text, View, } from "react-native"
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"

export default function HomeSearch (){
    const navigation = useNavigation();
    return(
        <View style={{backgroundColor:'#495579'}}>
            <Pressable
            onPress={()=>navigation.navigate("Search")}
            style={{
                height:hp('7%'), marginTop:hp('2%'), marginBottom:hp('1%'), marginHorizontal:wp(3),
                flexDirection:'row', justifyContent:'space-between', borderRadius:30,
                backgroundColor:'#263159', alignItems:'center', paddingHorizontal:wp(5)
            }}>
                <Text style={{
                    flex:1,
                    color: '#eff3f6',
                    borderColor:'#eff3f6',
                    borderBottomWidth: 1,
                    marginLeft: 15,
                    marginRight: 15,
                    fontSize: 20,
                    paddingBottom:2,
                }}>검색 창</Text>
                <Feather name="search" size={24} color="#eff3f6" />
            </Pressable>
        </View>
    )
}
