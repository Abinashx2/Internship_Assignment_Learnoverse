import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="videos/index" 
        options={{ title: 'YouTube Videos' }} 
      />
      <Stack.Screen 
        name="videoPlayer" 
        options={{ 
          title: 'Video Player',
          headerShown: false 
        }} 
      />
    </Stack>
  );
}