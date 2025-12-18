// для сохранения история для переходов через goBack
import { Stack } from 'expo-router';

export default function AdsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="search" />
      <Stack.Screen name="rent" />
      <Stack.Screen name="myAds" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="booking/[id]" />
      <Stack.Screen name="reviews/[id]" />
    </Stack>
  );
}