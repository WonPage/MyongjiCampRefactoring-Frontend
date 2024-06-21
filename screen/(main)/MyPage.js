import { useFocusEffect } from "@react-navigation/native";
import useUsers from "../../hook/useUsers";
import { useEffect, useState } from "react";
import { Alert, FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Picker } from "@react-native-picker/picker";
import { Octicons } from "@expo/vector-icons";

const MyPage = ({navigation, route}) => {
    const [userData, setUserData] = useState();
    const [nicknameModalVisible, setNicknameModalVisible] = useState(false);
    const [newNickname, setNewNickname] = useState('');
    const {sessionCheck, getProfile, updateIcon, updateNickname} = useUsers();
    useFocusEffect(()=>{
        sessionCheck(route);
    })
    useEffect(()=>{
        getProfile().then(res=>{
            if (!res) Alert.alert('로그인한 회원만 사용가능합니다.')
            setUserData(res);
        });
    },[])
    const page_list = [
        {page:'Notice', title:'공지사항'},
        {page:'FAQ', title:'FAQ'},
        {page:'Event', title:'이벤트'},
        {page:'Information', title:'이용안내'},
        {page:'NotifySetting', title:'알림설정'},
        {page:'PasswordChange', title: '비밀번호 변경'},
        {page:'Logout', title:'로그아웃'}
    ]
    const iconPath = {
        1 : require('../../assets/profile-icon/ai.jpg'),
        2 : require('../../assets/profile-icon/cloud.jpg'),
        3 : require('../../assets/profile-icon/design.jpg'),
        4 : require('../../assets/profile-icon/dog.jpg'),
        5 : require('../../assets/profile-icon/rabbit.jpg')
    }
    const profileIcons =[
        {id: 1, name: 'ai', image: require('../../assets/profile-icon/ai.jpg')},
        {id: 2, name: 'cloud', image: require('../../assets/profile-icon/cloud.jpg')},
        {id: 3, name: 'design', image: require('../../assets/profile-icon/design.jpg')},
        {id: 4, name: 'dog', image: require('../../assets/profile-icon/dog.jpg')},
        {id: 5, name: 'rabbit', image: require('../../assets/profile-icon/rabbit.jpg')},
    ]
    const handleNicknameChange = async() => {
        updateNickname(newNickname).then(isUpdated=>{
            if (isUpdated){
                getProfile().then(res => {
                    if (!res) return;
                    const newUserData = {...res};
                    newUserData.nickname = newNickname;
                    setUserData(newUserData);
                });
                setNicknameModalVisible(false);
                setNewNickname("");
            } else {
                Alert.alert('닉네임 변경에 실패했습니다.');
            }
        })
    }
    return(
        <View style={styles.container}>
            <View style={styles.profile_container}>
                <View>
                    <View style={{justifyContent:'center', alignItems:'center', width:100,height:100, marginLeft:wp('0.5%'), marginRight:wp('2%')}}>
                        <Picker
                        selectedValue={userData?.profileIcon ? userData.profileIcon : undefined}
                        style={{width:'100%', height:'100%', opacity:1, position:'absolute'}}
                        onValueChange={(iconId) => {
                            if (userData.profileIcon === iconId) return;
                            updateIcon(iconId).then(()=>{
                                getProfile().then(res=>{
                                    if (!res) return;
                                    const newUserData = {...res}
                                    newUserData.profileIcon = iconId;
                                    setUserData(newUserData);
                        })})}}>
                        {profileIcons.map((icon, index) => (
                            <Picker.Item key={index} label={icon.name} value={icon.id} />
                        ))}
                        </Picker>
                        <Image style={{borderRadius: 50, width:100, height:100}} source={iconPath[userData?.profileIcon?userData.profileIcon:undefined]}/>
                    </View>
                </View>
                <View style={{marginLeft:wp('3%')}}>
                    <TouchableOpacity onPress={()=>setNicknameModalVisible(true)} style={{marginBottom:hp('0.5%'), flexDirection:'row', alignItems:"center"}}>
                        <Text style={{fontSize: 30, color:'#251749', fontWeight:'500'}}>{userData?.nickname}</Text>
                        <Octicons style={{marginLeft:wp('2%'), marginTop:hp('1%')}} name="pencil" size={18} color="black" />
                    </TouchableOpacity>
                    <Text style={{fontSize: 15, color:'#251749'}}>{userData?.email}</Text>
                </View>
            </View>
            <View style={styles.resume_container}>
                <TouchableOpacity style={styles.resume_button} onPress={()=>{navigation.navigate('Resume')}}>
                    <Text style={{fontSize: 20, color:'white'}}>이력서 관리</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.pages_container}>
                <FlatList
                style={{marginTop: hp('3%'), backgroundColor:'#495579'}}
                contentContainerStyle= {{paddingVertical: hp('3.2%'), paddingHorizontal:wp('10%')}}
                data={page_list}
                renderItem={({item}) => <Item title={item.title} page={item.page} navigation={navigation}/>}
                />
            </View>
            {/* 닉네임 변경 Modal */}
            <Modal
            animationType="fade" visible={nicknameModalVisible}
            onRequestClose={()=>setNicknameModalVisible(false)} transparent={true}>
                <Pressable style={{height:'100%', backgroundColor:'rgba(0, 0, 0, 0.4)'}} onPress={()=>setNicknameModalVisible(false)}/>
                <View style={{borderRadius:30, position:'absolute', height:hp('43%'), width:'75%', marginLeft:'12%', marginTop:'45%', backgroundColor:'white',}}>
                    <View style={{flex:1, padding:'10%'}}>
                        <Text style={{fontSize:28, textAlign:'center', marginTop:'10%'}}>닉네임 변경</Text>
                        <TextInput value={newNickname} onChangeText={(text)=>setNewNickname(text)}
                        style={{borderWidth:1, height:hp('8%'), marginTop:'10%', borderRadius:20, paddingHorizontal:16}}/>
                        <View style={{alignItems:'center', marginTop:'20%'}}>
                            <TouchableOpacity style={{borderRadius:40,backgroundColor:'skyblue', height:hp('10%'),alignItems:'center', justifyContent:'center',
                            paddingHorizontal: hp('2%')}} onPress={handleNicknameChange}>
                                <Text>중복 확인 및 변경</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const Item = ({title, page, navigation}) => {
    const {logout} = useUsers();
    if (page === 'Logout') {
        return (
            <TouchableOpacity style={styles.page_item} onPress={()=>logout()}>
                <Text style={styles.page_title}>{title}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <TouchableOpacity style={styles.page_item} onPress={()=>{navigation.navigate(page)}}>
            <Text style={styles.page_title}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#FFFBEB'
    },
    profile_container:{
        height:hp('25%'),
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal:'8%'
    },
    resume_container:{
        height: hp('10%'),
        flexDirection: 'row',
        justifyContent:'center'
    },
    resume_button:{
        width:wp('50%'),
        height:hp('9%'),
        borderRadius: 10,
        backgroundColor: '#263159',
        justifyContent: 'center', alignItems:'center',
    },
    pages_container:{
        height:hp('50%'),
    },
    page_item :{
        marginBottom: 27,
    },
    page_title: {
        fontSize: 23,
        color:'#FFFBEB'
    }
});

export default MyPage;