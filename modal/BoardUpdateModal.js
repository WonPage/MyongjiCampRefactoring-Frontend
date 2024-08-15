/** 담당자 채윤 
 * 240622 - 게시글 수정 모달 구현 */
import { useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import useBoard from "../hook/useBoard";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome6 } from "@expo/vector-icons";

export default function BoardUpdateModal({navigation, route}){
    const postData = route.params.data;
    const boardId = route.params.boardId;
    const refreshBoardDetail = route.params.callback;
    const refreshOngoingList = route.params.refresh;
    const [postTitle, setPostTitle] = useState(postData.title);
    const [postContent, setPostContent] = useState(postData.content);
    const [postLocation, setPostLocation] = useState(postData.preferredLocation)
    const duration = {num : postData.expectedDuration.replace(/[^0-9]/g, ""), unit : postData?.expectedDuration.replace(/[0-9]/g, "")};
    const [postDuration, setPostDuration] = useState(duration.num);
    const [durationUnit, setDurationUnit] = useState(duration.unit); 
    const [roleData, setRoleData] = useState(postData.roleAssignments);
    const handleRoleAdd = () => {
        setRoleData([...roleData, {role:'FRONT', appliedNumber:"", requiredNumber:""}]);
    }
    const {updateBoard} = useBoard();
    const handleUpdate = () => {
        let flag = false;
        roleData.map((value) => {
            if (value.appliedNumber > value.requiredNumber) {
                flag = true;
                return Alert.alert('안내', '현재인원은 필요인원보다 클 수 없습니다.');
            }
            if (value.requiredNumber === '' || value.requiredNumber === 0){
                flag = true;
                return Alert.alert('안내', '필요인원은 0이 될 수 없습니다.');
            }
            if (value.appliedNumber === ''){
                value.appliedNumber = 0;
            }
        })
        if (postData.roleAssignments === roleData && postData.title === postTitle && postData.content === postContent && postData.expectedDuration === (postDuration+ durationUnit) && postData.preferredLocation === postLocation) {
            flag = true;
            return Alert.alert('안내', '수정된 정보가 없습니다.');
        }
        if (!flag){
            const updateData = {
                boardId : boardId,
                title : postTitle,
                content : postContent,
                status: "RECRUIT_ONGOING",
                preferredLocation: postLocation,
                expectedDuration: `${postDuration}${durationUnit}`,
                roleAssignments: roleData
            }
            updateBoard(updateData).then(data=>{
                if (!data.isFailed) {
                    navigation.pop();
                    refreshBoardDetail();
                    refreshOngoingList();
                }
            })
        }
    }
    return (
        <ScrollView>
            <View style={{backgroundColor:'white', padding: 20}}>
                <View style={{ justifyContent:'center', height: hp('10%'), marginBottom: hp('3%') }}>
                    <Text style={{ marginLeft: 3, marginBottom: 3 }}>제목 (최대 20자)</Text>
                    <TextInput onChangeText={setPostTitle} style={{borderBottomWidth: 1, color: 'black', fontSize: 32,}} placeholder="제목" maxLength={20} value={postTitle}/>
                </View>
                <View style={{ height: hp('42%'), marginBottom: hp('3%') }}>
                    <Text style={{ marginLeft: 3, marginBottom: 3 }}>내용</Text>
                    <TextInput
                        maxLength={500}
                        multiline={true}
                        placeholder="ex) 구하고자 하는 팀원의 기술, 언어, 도구 등 다양한 내용을 작성해보세요."
                        style={styles.content_input_box} value={postContent}
                        onChangeText={setPostContent} />
                </View>
                <View style={[styles.role_container, { marginBottom: hp('3%') }]}>
                    <Text style={{ marginLeft: 3, marginBottom: 3 }}>필요 직무</Text>
                    <View style={styles.role_list_container}>
                        <View style={[styles.role_list_description, { marginTop: hp('1%') }]}>
                            <Text style={{ fontSize: 12 }}>현재인원 / 필요인원</Text>
                        </View>
                        <View style={styles.role_item_container}>
                            <RoleItem roleData={roleData} setRoleData={setRoleData}/>
                        </View>
                        <TouchableOpacity
                            style={[styles.role_add_button, { height: hp('6%'), marginTop: hp('2%'), display: (roleData.length >= 7 ? 'none' : undefined) }]} onPress={handleRoleAdd}>
                            <Text style={{color:'white', fontSize:15}}>추가</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.location_container, { height: hp('10%'), marginBottom: hp('3%') }]}>
                    <Text style={{ marginLeft: 3, marginBottom: 3 }}>희망 지역 (최대 10글자)</Text>
                    <TextInput
                        maxLength={10}
                        placeholder="ex) 온라인, 명진당, 역북동 등.."
                        style={styles.location_input_box} value={postLocation}
                        onChangeText={setPostLocation} />
                </View>
                <View style={[styles.duration_container, { height: hp('10%'), marginBottom: hp('3%') }]}>
                    <Text style={{ marginLeft: 3, marginBottom: 3 }}>예상 기간</Text>
                    <View style={styles.duration_input_container}>
                        <TextInput
                            maxLength={3}
                            style={styles.input_bar} value={postDuration}
                            placeholder="0"
                            onChangeText={setPostDuration} keyboardType="number-pad" />
                        <Picker
                            style={styles.duration_picker}
                            selectedValue={durationUnit}
                            onValueChange={(itemValue, itemIndex) => setDurationUnit(itemValue)}>
                            <Picker.Item label="일" value={'일'} />
                            <Picker.Item label="주" value={'주'} />
                            <Picker.Item label="개월" value={'개월'} />
                        </Picker>
                    </View>
                </View>

                <View style={[styles.post_button_container, { height: hp('10%') }]}>
                    <TouchableOpacity onPress={handleUpdate}
                        style={styles.post_button}>
                        <Text style={{color:'white'}}>수정완료</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

function RoleItem({roleData, setRoleData}){
    const inputRefs = useRef([]);
    const inputRefs2 = useRef([]);
    const handleNumberChange = (type, index, value) => {
        setRoleData((prevState) =>
          prevState.map((v, i) => {
            if (i === index) {
              return {
                ...v,
                [type]: ( value === '' ? '' : parseInt(value)),
              };
            }
            return v;
          })
        );
      };
      const handleNext = (index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].focus();
        }
      };
      const handleNext2 = (index) => {
        if (inputRefs2.current[index]) {
          inputRefs2.current[index].focus();
        }
      };
      const handleRoleDelete = (index) => {
        const updatedRoleData = [...roleData];
        updatedRoleData.splice(index, 1);
        setRoleData(updatedRoleData);
      };
    return (
        <>
        {roleData.map((value, index) => {
            if (index<1) {
                return (
                    <View style={[styles.role_item, {height:hp('8%')}]} key={index}>
                         <Picker
                            style={styles.role_picker}
                            selectedValue={value.role}
                            onValueChange={(itemValue, itemIndex) => { setRoleData((prev) => {
                                return prev.map((v, i) => {
                                    if (i === index) { return { ...v, role: itemValue }}
                                    return v;
                                });
                            })}}>
                            <Picker.Item style={styles.picker_item} label="프론트엔드" value={'FRONT'} />
                            <Picker.Item style={styles.picker_item} label="백엔드" value={'BACK'} />
                            <Picker.Item style={styles.picker_item} label="AI" value={'AI'} />
                            <Picker.Item style={styles.picker_item} label="디자인" value={'DESIGN'} />
                            <Picker.Item style={styles.picker_item} label="풀스택" value={'FULL'} />
                            <Picker.Item style={styles.picker_item} label="기획" value={'PM'} />
                            <Picker.Item style={styles.picker_item} label="ETC" value={'ETC'} />
                        </Picker> 
                        <View style={styles.role_number_container}>
                            <TextInput 
                            // autoFocus={index>0 ? true : undefined}
                            ref={(ref) => (inputRefs2.current[index] = ref)}
                            style={styles.role_input} placeholder="0" value={value.appliedNumber.toString()}
                            maxLength={1} keyboardType='number-pad' returnKeyType="next"
                            onChangeText={(text) => handleNumberChange('appliedNumber', index, text)}
                            onSubmitEditing={() => handleNext(index)}/>
                            <TextInput 
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={styles.role_input} placeholder="0" value={value.requiredNumber.toString()}
                            maxLength={1} keyboardType='number-pad'
                            onChangeText={(text) => handleNumberChange('requiredNumber', index, text)}
                            onSubmitEditing={() => handleNext2(index+1)}/>
                        </View>
                        <TouchableOpacity style={styles.role_delete} activeOpacity={0.7}>
                            <FontAwesome6 name="trash-can" size={20} color="lightgray" />
                        </TouchableOpacity>
                    </View>
                )
            } else {
                return (
                <View style={[styles.role_item, {height:hp('8%')}]} key={index}>
                    <Picker
                       style={styles.role_picker}
                       selectedValue={value.role}
                       onValueChange={(itemValue, itemIndex) => { setRoleData((prev) => {
                           return prev.map((v, i) => {
                               if (i === index) {
                                   return { ...v, role: itemValue }
                               }
                               return v;
                           });
                       })}}>
                       <Picker.Item style={styles.picker_item} label="프론트엔드" value={'FRONT'} />
                       <Picker.Item style={styles.picker_item} label="백엔드" value={'BACK'} />
                       <Picker.Item style={styles.picker_item} label="AI" value={'AI'} />
                       <Picker.Item style={styles.picker_item} label="디자인" value={'DESIGN'} />
                       <Picker.Item style={styles.picker_item} label="풀스택" value={'FULL'} />
                       <Picker.Item style={styles.picker_item} label="기획" value={'PM'} />
                       <Picker.Item style={styles.picker_item} label="ETC" value={'ETC'} />
                    </Picker> 
                    <View style={styles.role_number_container}>
                       <TextInput 
                       ref={(ref) => (inputRefs2.current[index] = ref)}
                       style={styles.role_input} placeholder="0" value={value.appliedNumber.toString()}
                       maxLength={1} keyboardType='number-pad' returnKeyType="next"
                       onChangeText={(text) => handleNumberChange('appliedNumber', index, text)}
                       onSubmitEditing={() => handleNext(index)}/>
                       <TextInput 
                       ref={(ref) => (inputRefs.current[index] = ref)}
                       style={styles.role_input} placeholder="0" value={value.requiredNumber.toString()}
                       maxLength={1} keyboardType='number-pad'
                       onChangeText={(text) => handleNumberChange('requiredNumber', index, text)}
                       onSubmitEditing={() => handleNext2(index+1)}/>
                    </View>
                    <TouchableOpacity style={styles.role_delete} activeOpacity={0.6} onPress={()=>handleRoleDelete(index)}>
                        <FontAwesome6 name="trash-can" size={20} color="black" />
                    </TouchableOpacity>
               </View>
                )
            }
        })}        
        </>
    )
}

const styles = StyleSheet.create({
        role_list_container:{
            borderWidth: 1, borderRadius:10, alignItems: 'center', padding: 10
        },
        role_list_description: {
            alignSelf:'stretch', flexDirection: 'row', justifyContent:'flex-end', marginBottom: 5, marginRight: 5
        },
        role_item_container:{
            alignSelf:'stretch',
            borderWidth: 1,
            borderRadius: 20,
        },
        role_item: {
            alignItems: 'center', justifyContent: 'space-between',
            flexDirection: 'row', marginHorizontal: '2%',
        },
        role_picker: {
            flex: 5,
            marginRight: '3%'
        },
        picker_item: {
            fontSize: 18
        },
        role_number_container: {
            marginRight: '6%',
            justifyContent:'center',
            flex: 2,
            flexDirection: 'row',
            borderWidth: 1,
            borderRadius: 30,
        },
        role_input: {
            marginHorizontal: '5%',
            textAlign: 'center',
            fontSize: 15,
        },
        role_delete:{
            flex: 1,
        },
        role_add_button:{
            backgroundColor: '#495579',
            borderRadius: wp('5%'),
            justifyContent: 'center', alignItems:'center',
            width: wp('30%'),
        },
    location_container: {
        justifyContent:'center',
    },
    content_input_box: {
        flex:1,
        padding:16, textAlignVertical:'top',
        borderWidth: 1, borderRadius: 10, color: 'black', fontSize: 17,
    },
    location_input_box: {
        padding:13, borderWidth: 1, borderRadius: 10, color: 'black', fontSize: 17,
    },
    duration_container:{
    },
    duration_input_container:{
        flexDirection: 'row',
        width:'60%',
    },
    input_bar: {
        flex: 0.5,
        borderBottomWidth: 1,
        paddingHorizontal: 16,
    },
    duration_picker: {
        flex: 1.2
    },
    post_button_container: { alignItems: 'center', justifyContent:'center'},
    post_button: {borderRadius: wp('5%'), backgroundColor: '#263159', width: wp('50%'), height:hp('7%'), alignItems: 'center', justifyContent: 'center' }
});