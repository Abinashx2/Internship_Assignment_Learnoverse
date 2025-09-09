import { useState, useEffect } from 'react';
import axios from 'axios';
import { Config } from '../constants/Config';

export interface Video {
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
}

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${Config.API_BASE_URL}/api/videos`);
        setVideos(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch videos');
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, loading, error };
};