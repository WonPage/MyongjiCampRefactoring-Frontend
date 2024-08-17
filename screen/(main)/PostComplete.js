import { useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import * as ImagePicker from 'expo-image-picker'
import { AntDesign } from "@expo/vector-icons";
import useBoard from "../../hook/useBoard";

export default function PostComplete({navigation}){
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postImages, setPostImages] = useState([]); 
    const {postCompleteBoard} = useBoard();
    
    const pickImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3,
        })
        // console.log(result);
        if (!result.canceled) {
            setPostImages([...postImages, result.assets[0]]);
        }
    }
    const handleDeleteImage = (imgIndex) => {
        const newImageList = [...postImages];
        newImageList.splice(imgIndex, 1);
        setPostImages(newImageList);
    }
    const handlePostCompleteBoard = () => {
        const postData = {
            title: postTitle,
            content: postContent,
            images: postImages
        }
        postCompleteBoard(postData).then(data=>{
            if (!data.isFailed) {
                // navigation.replace('MainNavigation') //홈으로 이동
                navigation.navigate('Finish');
            } else {
                Alert.alert('안내', '글 작성에 문제가 발생했습니다.');
            }
        })
    }
    return (
        <View style={{backgroundColor:'white', height:hp(100), paddingHorizontal:wp(5)}}>
            <View style={{ justifyContent:'center', height: hp(10), marginBottom: hp(3) }}>
                <Text style={{ marginLeft: 3, marginBottom: 3 }}>제목 (최대 20자)</Text>
                <TextInput onChangeText={setPostTitle} style={{borderBottomWidth: 1, color: 'black', fontSize: 28,}} placeholder="제목" maxLength={20} value={postTitle}/>
            </View>
            <View style={{ height: hp(35), marginBottom: hp(3) }}>
                <Text style={{ marginLeft: 3, marginBottom: 3 }}>내용</Text>
                <TextInput
                    maxLength={500}
                    multiline={true}
                    placeholder="개발 완료된 프로젝트에 대한 간단한 소개 및 홍보를 작성할 수 있습니다. "
                    style={{ flex:1,padding:16, textAlignVertical:'top', borderWidth: 1, borderRadius: 10, color: 'black', fontSize: 17}} 
                    onChangeText={setPostContent} value={postContent}/>
            </View>
            <View style={{ height: hp(25), marginBottom: hp(3) }}>
                <Text style={{ marginLeft: 3, marginBottom: 3 }}>이미지 (최대 5장)</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems:'center'}}>
                    {postImages.map((img, index) => (
                        <View key={index}>
                            <Image source={{uri:img.uri}} style={{width:wp(40), height:wp(40), marginRight:wp(3)}}/>
                            <TouchableOpacity onPress={()=>handleDeleteImage(index)} style={{position:'absolute', right:wp(5), top:wp(2)}}>
                                <AntDesign name="closecircle" size={30} color="darkred" />
                            </TouchableOpacity>
                        </View>
                        ))}
                    {postImages.length<5 &&
                        <TouchableOpacity onPress={pickImage} style={{borderRadius:wp(3)}}>
                            <AntDesign name="plussquare" size={wp(25)} color="lightgray" />
                        </TouchableOpacity>
                    }
                </ScrollView>
            </View>
            <View style={{ alignItems:'center'}}>
                <TouchableOpacity onPress={handlePostCompleteBoard}
                style={{backgroundColor:'#495579', width:wp(35), height:hp(8), justifyContent:'center', alignItems:'center', borderRadius:wp(2)}}>
                    <Text style={{fontSize:22, color:'white'}}>작성 완료</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}