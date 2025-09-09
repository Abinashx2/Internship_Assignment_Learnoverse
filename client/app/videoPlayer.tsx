import React, { useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


let WebView;
if (Platform.OS !== 'web') {
  try {
    WebView = require('react-native-webview').WebView;
  } catch (error) {
    console.log('WebView not available');
  }
}

export default function VideoPlayerScreen() {
  const { videoId, title, channelTitle } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
          }
          .container {
            position: relative;
            width: 100%;
            height: 0;
            padding-bottom: 56.25%;
          }
          iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1" 
            frameborder="0" 
            allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture" 
            allowfullscreen
          ></iframe>
        </div>
      </body>
    </html>
  `;

  const openInYouTube = () => {
    Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
  };

  const openInBrowser = () => {
    Linking.openURL(`https://www.youtube.com/embed/${videoId}`);
  };


  const WebPlayer = () => (
    <View style={styles.videoContainer}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        style={styles.iframe}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </View>
  );


  const NativePlayer = () => {
    if (!WebView) {
      return (
        <View style={styles.videoContainer}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#ff4444" />
            <Text style={styles.errorText}>WebView not available</Text>
            <TouchableOpacity onPress={openInYouTube} style={styles.youtubeButton}>
              <Text style={styles.youtubeButtonText}>Open in YouTube</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        allowsFullscreenVideo={true}
        allowsInlineMediaPlayback={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.channel} numberOfLines={1}>{channelTitle}</Text>
        </View>
      </View>

      {loading && Platform.OS !== 'web' && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff0000" />
          <Text style={styles.loadingText}>Loading video...</Text>
        </View>
      )}

      {error ? (
        <View style={styles.videoContainer}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#ff4444" />
            <Text style={styles.errorText}>Failed to load video</Text>
            <TouchableOpacity onPress={openInYouTube} style={styles.youtubeButton}>
              <Text style={styles.youtubeButtonText}>Open in YouTube</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {Platform.OS === 'web' ? <WebPlayer /> : <NativePlayer />}
        </>
      )}
      
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  channel: {
    color: '#aaa',
    fontSize: 14,
  },
  videoContainer: {
    height: 250,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 10,
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#0f0f0f',
  },
  infoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoChannel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  youtubeButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ff0000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  browserButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#4285f4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youtubeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  browserButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});