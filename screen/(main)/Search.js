/** 담당자 채윤 
 * 240810 - 글 검색 창 */

import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
export default function Search({navigation}) {
    const [searchWord, setSearchWord] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const tags = [
        {name:'프론트엔드', value:'FRONT'},
        {name:'백엔드', value:'BACK'},
        {name:'디자인', value:'DESIGN'},
        {name:'AI', value:'AI'},
        {name:'풀스택', value:'FULL'},
        {name:'ETC', value:'ETC'},
        {name:'기획', value:'PM'},
    ]
    const moveSearchResult = () => {
        if (searchWord.trim() === '' && selectedTags.length==0) {
            setSearchWord('');
            return Alert.alert('키워드를 입력해주세요.');
        } 
        navigation.navigate('SearchResult', {
            keyword: searchWord,
            roles: selectedTags
        });
    }
    const handleTagSelect = (tag) => {
      const newSelectedTags = [...selectedTags];
      if (newSelectedTags.includes(tag)) {
        newSelectedTags.splice(newSelectedTags.indexOf(tag), 1);
      } else {
        newSelectedTags.push(tag);
      }
      setSelectedTags(newSelectedTags);
    };
    return (
        <View>
            <View style={[styles.search_container, {marginBottom:hp('3%')}]}>
                <TextInput style={styles.search_input} placeholder="검색창"
                    value={searchWord} onChangeText={setSearchWord}
                    onSubmitEditing={moveSearchResult} autoFocus={true} />
                <Pressable style={styles.search_icon} onPress={moveSearchResult}>
                    <Feather name="search" size={24} color="black" />
                </Pressable>
            </View>
            <View style={styles.tag_container}>
                {tags.map((tag) => (
                    <BouncyCheckbox
                        style={styles.tag_item}
                        textStyle={{
                            textDecorationLine: "none", 
                        }}
                        key={tag.value} text={tag.name}
                        isChecked={selectedTags.includes(tag.name)}
                        onPress={() => handleTagSelect(tag.name)}
                    />)
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    search_container: {
        marginVertical: hp('2.5%'),
        height:hp('7%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 30,
        borderRadius: 30,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        marginHorizontal:wp(3),
        paddingHorizontal: wp(5),
    },
    search_input: {
        flex:1, 
        borderBottomWidth: 1,
        marginHorizontal: 10,
        fontSize: 20,
    },
    tag_container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    tag_item:{        
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#ffffff",
        paddingVertical: wp(2),
        paddingHorizontal: wp(4),
        marginBottom: 10,
        marginRight: 10
    },
});