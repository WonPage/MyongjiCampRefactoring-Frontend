import { NavigationContainer } from "@react-navigation/native";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "../screen/(auth)/Login";
import Signup, { SignupNickname, SignupPassword } from "../screen/(auth)/Signup";
import PasswordFind from "../screen/(auth)/PasswordFind";
import MyPage from "../screen/(main)/MyPage";
import Apply from "../screen/(main)/Apply";
import { Platform, TouchableOpacity, View } from "react-native";
import Scrap from "../screen/(main)/Scrap";
import Post, { PostButton } from "../screen/(main)/Post";
import { AntDesign, Feather, FontAwesome5, Ionicons, Octicons } from "@expo/vector-icons";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Notification from "../screen/(main)/Notification";
import Resume from "../screen/(main)/Resume";
import Event from "../screen/(other)/Event";
import PasswordChange from "../screen/(other)/PasswordChange";
import NotifySetting from "../screen/(other)/NotifySetting";
import Notice from "../screen/(other)/Notice";
import Information from "../screen/(other)/Information";
import FAQ from "../screen/(other)/FAQ";
import ResumeDetailModal from "../modal/ResumeDetailModal";
import ResumeUpdateModal from "../modal/ResumeUpdateModal";
import ResumeAddModal from "../modal/ResumeAddModal";
import OnGoing, { Complete } from "../screen/(main)/Home";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Home from "../screen/(main)/Home";
import Search from "../screen/(main)/HomeSearch";
import HomeSearch from "../screen/(main)/HomeSearch";
import Finish from "../screen/(main)/Home_Finish";
import PostDetail from "../screen/(main)/PostDetail";
import BoardUpdateModal from "../modal/BoardUpdateModal";
import BoardReportModal from "../modal/BoardReportModal";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {/* Auth Pages */}
                <Stack.Screen name="Login" component={Login}
                options={{headerShown: false, cardStyle:{backgroundColor:'white'}}} />    
                <Stack.Screen name="Signup" component={Signup} 
                options={{cardStyle:{backgroundColor:'white'}, title: '회원가입', headerTitleAlign: 'center', headerShadowVisible: false}} />
                <Stack.Screen name="SignupPassword" component={SignupPassword} 
                options={{cardStyle:{backgroundColor:'white'}, title: '회원가입', headerTitleAlign: 'center', headerShadowVisible: false, cardStyleInterpolator: (CardStyleInterpolators.forNoAnimation)}} />
                <Stack.Screen name="SignupNickname" component={SignupNickname} 
                options={{cardStyle:{backgroundColor:'white'}, title: '회원가입', headerTitleAlign: 'center', headerShadowVisible: false, cardStyleInterpolator: (CardStyleInterpolators.forNoAnimation)}} />
                <Stack.Screen name="PasswordFind" component={PasswordFind}
                options={{cardStyle:{backgroundColor:'white'}, title:'비밀번호 찾기', headerTitleAlign:'center'}}/>

                {/* Home Page */}
                <Stack.Screen name="MainNavigation" component={MainNavigation}
                options={{headerShown: false, headerMode:'screen', cardStyleInterpolator:(Platform.OS==='ios' ? CardStyleInterpolators.forVerticalIOS : CardStyleInterpolators.forBottomSheetAndroid) }}/>
                <Stack.Screen name="Notification" component={Notification}
                options={{headerTitle: '알림', headerTitleAlign: 'center', cardStyleInterpolator: (Platform.OS==='ios' ? CardStyleInterpolators.forVerticalIOS : CardStyleInterpolators.forFadeFromBottomAndroid)}}/>

                {/* Important Page */}
                <Stack.Screen name="Post" component={Post}
                options={{headerTitle:'글 작성',headerTitleAlign: 'center',cardStyleInterpolator: (Platform.OS==='ios' ? CardStyleInterpolators.forVerticalIOS : CardStyleInterpolators.forBottomSheetAndroid)}}/>
                <Stack.Screen name="PostDetail" component={PostDetail} />
                <Stack.Screen name="Resume" component={Resume}
                options={{title: '이력서', headerTitleAlign: 'center', headerTitleStyle:{fontSize: 28}}}  />

                {/* Other Page */}
                <Stack.Screen name="Event" component={Event}/>
                <Stack.Screen name="FAQ" component={FAQ}/>
                <Stack.Screen name="Information" component={Information}/>
                <Stack.Screen name="Notice" component={Notice}/>
                <Stack.Screen name="NotifySetting" component={NotifySetting}/>
                <Stack.Screen name="PasswordChange" component={PasswordChange}
                options={{title:'비밀번호 변경'}}/>

                {/* Modal Page */}
                <Stack.Group screenOptions={{presentation:'transparentModal', headerShown:false}}>
                    <Stack.Screen name="ResumeDetailModal" component={ResumeDetailModal} />
                    <Stack.Screen name="ResumeUpdateModal" component={ResumeUpdateModal} />
                    <Stack.Screen name="ResumeAddModal" component={ResumeAddModal} />
                    <Stack.Screen name="BoardUpdateModal" component={BoardUpdateModal} />
                    <Stack.Screen name="BoardReportModal" component={BoardReportModal} />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const MainNavigation = ({navigation}) => {
    return (
        <Tab.Navigator sceneContainerStyle={{backgroundColor:undefined}} screenOptions={{
            headerRight : (props) => (
                <TouchableOpacity style={{marginRight:wp('4%')}} {...props} activeOpacity={0.7} onPress={()=>{navigation.navigate("Notification")}}>
                    <Ionicons name="notifications-outline" size={30} color="black" />
                </TouchableOpacity>),
            headerTitleStyle:{fontSize: 30, marginBottom:hp('1%'), marginLeft:wp('1%')}, headerStatusBarHeight:hp('5%'),
            tabBarActiveTintColor: '#003366', tabBarInactiveTintColor: '#a7a9ac',
            tabBarStyle:{ height: hp('8.5%'), paddingTop:hp('0.5%'), paddingBottom:hp('1%')},
        }}>
            <Tab.Screen name="Home" component={HomeNavigation}
            options={{ headerStyle:{backgroundColor:'#FFFBEB'}, title: '홈', tabBarIcon: ({color, size}) => <Octicons name="home" size={24} color={color} />,
            headerTitle: '명지캠프'}}/>
            <Tab.Screen name="Scrap" component={Scrap}
            options={{ headerStyle:{backgroundColor:'#FFFBEB'}, title: '스크랩', tabBarIcon: ({color, size}) => <Feather name="bookmark" size={24} color={color} />}}/>
            <Tab.Screen name="PostButton" component={PostButton}
            options={{ title: '글쓰기', tabBarIcon: ({color, size}) => <AntDesign name="pluscircle" size={34} color={'#003366'} />,
            tabBarButton: (props) => (<TouchableOpacity activeOpacity={0.7} {...props} onPress={()=>{navigation.push('Post');}}/>), tabBarLabelStyle: {display: 'none'}}}/>
            <Tab.Screen name="Apply" component={Apply}
            options={{ headerStyle:{backgroundColor:'#FFFBEB'}, title: '지원현황', tabBarIcon: ({color, size}) => <FontAwesome5 name="folder-open" size={24} color={color} />}}/>
            <Tab.Screen name="MyPage" component={MyPage}
            options={{ headerStyle:{backgroundColor:'#FFFBEB'}, title: '마이페이지', tabBarIcon: ({color, size}) => <Octicons name="person" size={24} color={color} />}}/>
        </Tab.Navigator>
    )
}




const HomeNavigation = () => {
    return (
        <TopTab.Navigator>
        <TopTab.Screen name="OnGoing" component={OnGoing} 
        options={{title:'모집 중'}}/>
{/*         <TopTab.Screen name="Complete" component={Complete}
        options={{title:'모집 완료'}}/> */}
        <TopTab.Screen name="Finish" component={Finish}
        options={{title:'개발 완료'}}/>
       </TopTab.Navigator>
    )
}


export default Navigation;
