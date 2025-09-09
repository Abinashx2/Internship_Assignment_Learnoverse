import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { 
  View, 
  StyleSheet, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Linking, 
  Platform, 
  FlatList,
  Image,
  ScrollView
} from 'react-native';
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

type Video = {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration: string;
};

export default function VideoPlayerScreen() {
  const { videoId, title, channelTitle } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [error, setError] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  useEffect(() => {
    fetchAllVideos();
  }, []);

  const fetchAllVideos = async () => {
    try {
      setLoadingVideos(true);
      const API_BASE_URL = 'http://localhost:3000';
      const response = await fetch(`${API_BASE_URL}/api/videos`);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      setVideos(data);
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setLoadingVideos(false);
    }
  };

  // Filter out the current playing video from the list
  const otherVideos = videos.filter(video => video.videoId !== videoId);

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
        onLoadEnd={() => setVideoLoading(false)}
        onError={() => {
          setVideoLoading(false);
          setError(true);
        }}
      />
    );
  };

  const handleVideoSelect = (selectedVideo: Video) => {
    // Navigate to the same screen but with new video parameters
    router.push({
      pathname: '/videoPlayer',
      params: { 
        videoId: selectedVideo.videoId,
        title: selectedVideo.title,
        channelTitle: selectedVideo.channelTitle
      }
    });
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = match?.[1] || '0';
    const minutes = match?.[2] || '0';
    const seconds = match?.[3] || '0';
    
    if (hours !== '0') {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const renderVideoItem = ({ item }: { item: Video }) => (
    <TouchableOpacity 
      style={styles.otherVideoItem}
      onPress={() => handleVideoSelect(item)}
    >
      <Image 
        source={{ uri: item.thumbnail }} 
        style={styles.otherVideoThumbnail}
        resizeMode="cover"
      />
      <View style={styles.otherVideoInfo}>
        <Text style={styles.otherVideoTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.otherVideoChannel}>{item.channelTitle}</Text>
        <Text style={styles.otherVideoDuration}>{formatDuration(item.duration)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    
    <SafeAreaView style={styles.container}>
      <Navbar></Navbar>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.channel} numberOfLines={1}>{channelTitle}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Video Player Section */}
        <View style={styles.playerSection}>
          {(videoLoading || loading) && Platform.OS !== 'web' && (
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
        </View>

        {/* Other Videos Section */}
        <View style={styles.otherVideosSection}>
          <Text style={styles.sectionTitle}>More Videos</Text>
          
          {loadingVideos ? (
            <ActivityIndicator size="small" color="#ff0000" style={styles.videosLoading} />
          ) : otherVideos.length > 0 ? (
            <FlatList
              data={otherVideos}
              renderItem={renderVideoItem}
              keyExtractor={item => item.videoId}
              scrollEnabled={false} // Let ScrollView handle scrolling
              contentContainerStyle={styles.otherVideosList}
            />
          ) : (
            <Text style={styles.noVideosText}>No other videos available</Text>
          )}
        </View>
      </ScrollView>
      <Footer></Footer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
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
  playerSection: {
    height: 250,
    backgroundColor: '#000',
  },
  videoContainer: {
    height: '100%',
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
  youtubeButton: {
    backgroundColor: '#ff0000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  youtubeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Other Videos Section
  otherVideosSection: {
    padding: 16,
    backgroundColor: '#0f0f0f',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  otherVideosList: {
    paddingBottom: 20,
  },
  otherVideoItem: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  otherVideoThumbnail: {
    width: 120,
    height: 90,
  },
  otherVideoInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  otherVideoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  otherVideoChannel: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 4,
  },
  otherVideoDuration: {
    color: '#888',
    fontSize: 11,
  },
  videosLoading: {
    marginVertical: 20,
  },
  noVideosText: {
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
});