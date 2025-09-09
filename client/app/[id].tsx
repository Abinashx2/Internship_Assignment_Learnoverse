import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useVideos } from '../hooks/useVideos';

const VideoPlayerScreen = () => {
  const { id } = useLocalSearchParams();
  const { videos } = useVideos();
  
  const video = videos.find(v => v.videoId === id);

  if (!video) {
    return (
      <View style={styles.center}>
        <Text>Video not found</Text>
      </View>
    );
  }
  const ebmedUrl = `https://www.youtube.com/embed/${video.videoId}`;

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        source={{ uri: embedUrl }}
        allowsFullscreenVideo={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{video.title}</Text>
        <Text style={styles.channel}>{video.channel}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    height: 300,
    width: '100%',
  },
  infoContainer: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  channel: {
    fontSize: 16,
    color: '#666',
  },
});

export default VideoPlayerScreen;