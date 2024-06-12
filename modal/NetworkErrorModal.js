import { View, Text, Modal, StyleSheet } from 'react-native';

const NetworkErrorModal = ({ visible }) => {
    return (
        <Modal transparent={true} animationType="slide" visible={visible}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>네트워크 문제가 발생했습니다. 연결 상태를 확인해주세요.</Text>
                </View>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 18,
      color: 'red',
      textAlign: 'center',
    },
  });
export default NetworkErrorModal;