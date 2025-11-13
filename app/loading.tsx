import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { CustomText } from '@/components/ui/text/CustomText';

interface LoadingScreenProps {
  onPress: () => void;
  loading?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onPress, loading }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.wrapper}>
        <View style={styles.label}>
          <CustomText highlight>Welcome!</CustomText>
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
  wrapper: {
    zIndex: 1,
    height: '100%',
    width: '100%',
  },
});

export default LoadingScreen;
