// import { useEffect } from 'react';
// import { View } from 'react-native';
// import { Slot } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
//
// import { useTheme } from '@/hooks/useTheme';
//
// import { loadCity } from '@/state/city/citySlice';
// import { useCustomDispatch } from '@/state/hoooks';
//
// // Компонент нужен, тк он использует bgColor из useTheme
// // Контекст theme обязательно должен загрузиться уже после loadingScreen
// export default function AppContainer() {
//   const { colors, isLoading, theme } = useTheme();
//
//   const dispatch = useCustomDispatch();
//   useEffect(() => {
//     dispatch(loadCity());
//   }, []);
//
//   if (isLoading) {
//     return null; // не рисуем UI, пока не подгрузится тема
//   }
//
//   return (
//     <View style={{ flex: 1, backgroundColor: colors.theme.white.bright }}>
//       {/* statusBar*/}
//       <StatusBar
//         style={theme == 'dark' ? 'light' : 'dark'}
//         backgroundColor={colors.theme.white.bright}
//       />
//       <Slot />
//     </View>
//   );
// }
