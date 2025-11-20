import { FlatList, Modal, Pressable, View } from 'react-native';

import { useLanguage } from '@/hooks/useLanguage';

import { CustomText } from '@/components/ui/text/CustomText';

interface Props {
  visible: boolean;
  onClose: () => void;
  cities: string[];
  currentCity: string;
  onSelect: (value: string) => void;
}

export default function CityModal({
  visible,
  onClose,
  cities,
  currentCity,
  onSelect,
}: Props) {
  const { l } = useLanguage();

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable
        style={{ flex: 1, backgroundColor: '#00000055' }}
        onPress={onClose}
      />

      <View
        style={{
          position: 'absolute',
          top: 100,
          left: 20,
          right: 20,
          bottom: 100,
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 10,
        }}
      >
        <FlatList
          data={cities}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Pressable onPress={() => onSelect(item)}>
              <CustomText
                className="text-18 mb-2"
                style={{
                  fontWeight: currentCity === item ? 'bold' : 'normal',
                }}
              >
                {l[item]}
              </CustomText>
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}
