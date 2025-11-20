import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  get: async <T>(key: string, defaultValue?: T): Promise<T | undefined> => {
    try {
      const json = await AsyncStorage.getItem(key);
      return json ? JSON.parse(json) : defaultValue;
    } catch (e) {
      console.error('Ошибка при чтении данных из AsyncStorage:', e);
      return defaultValue;
    }
  },

  set: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Ошибка при записи данных в AsyncStorage:', e);
    }
  },

  remove: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Ошибка при удалении данных из AsyncStorage:', e);
    }
  },
};
