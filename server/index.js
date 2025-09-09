const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/youtube_videos_db?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'youtube_videos_db' 
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  console.log('Database name:', mongoose.connection.db.databaseName);
})
.catch((error) => {
  console.log('MongoDB connection error:', error.message);
});


mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to database:', mongoose.connection.db.databaseName);
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error:', err);
});


const videoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    unique: true
  }
}, { collection: 'videos' }); 

const Video = mongoose.model('Video', videoSchema);


const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'YOUR_YOUTUBE_API_KEY';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/videos';


async function fetchVideoDetails(videoId) {
  try {
    const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: 'snippet,contentDetails',
        id: videoId,
        key: YOUTUBE_API_KEY
      }
    });
    
    if (response.data.items.length === 0) {
      throw new Error('Video not found');
    }
    
    const item = response.data.items[0];
    return {
      videoId: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.medium.url,
      duration: item.contentDetails.duration
    };
  } catch (error) {
    console.error('Error fetching video details:', error.message);
    throw error;
  }
}

app.get('/api/debug', async (req, res) => {
  try {
    const videos = await Video.find({});
    const dbName = mongoose.connection.db.databaseName;
    
    res.json({
      database: dbName,
      collection: 'videos',
      videoCount: videos.length,
      videos: videos
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find({});
    
    console.log(`Found ${videos.length} videos in database`);
    
    if (videos.length === 0) {
      return res.status(404).json({ 
        error: 'No videos found in database. Please seed the database first.' 
      });
    }
    
    const enrichedVideos = [];
    for (const video of videos) {
      try {
        console.log(`Fetching details for video: ${video.videoId}`);
        const videoDetails = await fetchVideoDetails(video.videoId);
        enrichedVideos.push(videoDetails);
      } catch (error) {
        console.error(`Failed to fetch details for video ${video.videoId}:`, error.message);
      }
    }
    
    res.json(enrichedVideos);
  } catch (error) {
    console.error('Error in /api/videos:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching videos' 
    });
  }
});


app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: mongoose.connection.db.databaseName,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Learnoverse YouTube API', 
    database: mongoose.connection.db.databaseName,
    endpoints: {
      videos: '/api/videos',
      health: '/health',
      debug: '/api/debug'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoint: http://localhost:${PORT}/api/videos`);
  console.log(`Debug endpoint: http://localhost:${PORT}/api/debug`);
});