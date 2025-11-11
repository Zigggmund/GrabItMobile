import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LoadingScreenProps {
  onPress: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onPress }) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.wrapper}>
        <View style={styles.label}>
          <Text style={styles.text}>Welcome!</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 0,
  },
  label: {
    borderWidth: 3,
    borderRadius: 20,
    // borderColor: colors.black,
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    // backgroundColor: colors.green.textBlock, // Пример фона для текста
  },
  text: {
    fontSize: 32,
  },
  wrapper: {
    zIndex: 1,
    height: '100%',
    width: '100%',
  },
});

export default LoadingScreen;
