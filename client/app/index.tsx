import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Alert,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

type Video = {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration: string;
  description?: string;
  publishedAt?: string;
};

const VIDEOS_PER_PAGE = 5; // Number of videos to show per page

export default function VideoListScreen() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchVideos();
  }, []);

  // Calculate paginated videos
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * VIDEOS_PER_PAGE,
    currentPage * VIDEOS_PER_PAGE
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
    
      const API_BASE_URL = 'http://localhost:3000'; 
      
      console.log('Fetching videos from:', `${API_BASE_URL}/api/videos`);
      
      const response = await fetch(`${API_BASE_URL}/api/videos`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setVideos(data);
      setFilteredVideos(data);
      setCurrentPage(1); // Reset to first page when new data loads
    } catch (err) {
      console.error('Error fetching videos:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load videos';
      setError(errorMessage);
      
      if (err.message.includes('Network request failed')) {
        Alert.alert(
          'Connection Error',
          'Could not connect to the server. Please make sure your backend is running and accessible.',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
            { text: 'Retry', onPress: fetchVideos }
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(video =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.channelTitle.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredVideos(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredVideos(videos);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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

  const openVideo = (video: Video) => {
    router.push({
      pathname: '/videoPlayer',
      params: { 
        videoId: video.videoId,
        title: video.title,
        channelTitle: video.channelTitle
      }
    });
  };

  const renderVideoItem = ({ item }: { item: Video }) => (
    <TouchableOpacity 
      style={styles.videoItem}
      onPress={() => openVideo(item)}
    >
      <Image 
        source={{ uri: item.thumbnail }} 
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.channelTitle}>{item.channelTitle}</Text>
        <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPaginationControls = () => {
    if (filteredVideos.length <= VIDEOS_PER_PAGE) return null;

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          onPress={goToPrevPage}
          disabled={currentPage === 1}
          style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
        >
          <Text style={[styles.paginationText, currentPage === 1 && styles.disabledText]}>
            ← Previous
          </Text>
        </TouchableOpacity>

        <View style={styles.pageInfo}>
          <Text style={styles.pageText}>
            Page {currentPage} of {totalPages}
          </Text>
        </View>

        <TouchableOpacity 
          onPress={goToNextPage}
          disabled={currentPage === totalPages}
          style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
        >
          <Text style={[styles.paginationText, currentPage === totalPages && styles.disabledText]}>
            Next →
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ff0000" />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Navbar/>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search videos or channels..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#888"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchVideos} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <FlatList
        data={paginatedVideos}
        renderItem={renderVideoItem}
        keyExtractor={item => item.videoId}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              {searchQuery ? (
                <>
                  <Text style={styles.emptyText}>No videos found for "{searchQuery}"</Text>
                  <Text style={styles.emptySubText}>Try a different search term</Text>
                </>
              ) : (
                <>
                  <Text style={styles.emptyText}>No videos available</Text>
                  <Text style={styles.emptySubText}>Make sure your backend server is running</Text>
                </>
              )}
              <TouchableOpacity onPress={fetchVideos} style={styles.retryButton}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )
        }
        ListFooterComponent={renderPaginationControls}
      />
      <Footer></Footer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  // Search Bar Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    padding: 10,
    flexGrow: 1,
  },
  videoItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  thumbnail: {
    width: 120,
    height: 90,
  },
  videoInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  channelTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  duration: {
    fontSize: 12,
    color: '#888',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#ff0000',
    padding: 8,
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
    textAlign: 'center',
  },
  // Pagination Styles
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: '#ff0000',
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  paginationText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#666',
  },
  pageInfo: {
    alignItems: 'center',
  },
  pageText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});