const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-connection-string';
const DB_NAME = 'youtube_videos_db';
const COLLECTION_NAME = 'videos';


const YOUTUBE_VIDEO_IDS = [
  'dQw4w9WgXcQ',  
  'jNQXAC9IVRw',  
  '9bZkp7q19f0',  
  'OPf0YbXqDm0',  
  'kJQP7kiw5Fk',  
  'RgKAFK5djSk', 
  'CevxZvSJLk8', 
  '09R8_2nJtjg', 
  'YQHsXMglC9A',
  'AJtDXIazrMo'   
];

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
   
    await collection.deleteMany({});
    console.log('Cleared existing data');
    
  
    const videoDocuments = YOUTUBE_VIDEO_IDS.map(videoId => ({
      videoId: videoId
   
    }));
    
   
    const result = await collection.insertMany(videoDocuments);
    console.log(`Inserted ${result.insertedCount} videos into MongoDB`);
   
    const videos = await collection.find({}).toArray();
    console.log('\nInserted videos:');
    videos.forEach(video => {
      console.log(`- Video ID: ${video.videoId}`);
    });
    
 
    console.log('\nSample document structure:');
    if (videos.length > 0) {
      console.log(JSON.stringify(videos[0], null, 2));
    }
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('\nMongoDB connection closed');
  }
}

const fs = require('fs');
if (!fs.existsSync('.env')) {
  fs.writeFileSync('.env', `MONGODB_URI=your-mongodb-connection-string-here\nYOUTUBE_API_KEY=your-youtube-api-key-here`);
  console.log('.env file created. Please update it with your actual MongoDB URI and YouTube API key.');
  process.exit(0);
}
seedDatabase();