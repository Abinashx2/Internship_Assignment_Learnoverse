import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

const VideoPlayerScreen = () => {
  const { video } = useLocalSearchParams();
  const videoData = JSON.parse(video as string);
  const videoUrl = `https://www.youtube.com/embed/${videoData.videoId}?autoplay=1`;

  return (
    <View style={styles.playerContainer}>
      <WebView
        source={{ uri: videoUrl }}
        style={styles.webview}
        allowsFullscreenVideo={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
      <View style={styles.videoInfoContainer}>
        <Text style={styles.playerTitle}>{videoData.title}</Text>
        <Text style={styles.playerChannel}>{videoData.channelTitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    width: width,
  },
  videoInfoContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  playerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  playerChannel: {
    fontSize: 16,
    color: '#666',
  },
});

export default VideoPlayerScreen;