import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
import type { Song, CurrentSong } from '@/lib/api';

interface ProgressData {
  current_progress: number;
  duration: number;
  is_playing: boolean;
}

export function useJukeboxEvents(url?: string) {
  // Resolve default to configured API base so clients always connect to the backend host
  const resolvedUrl =
    url ||
    (typeof window !== 'undefined'
      ? `${API_BASE_URL.replace(/\/$/, '')}/events`
      : 'http://localhost:8000/events');

  const [currentSong, setCurrentSong] = useState<CurrentSong | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [volume, setVolume] = useState(100);
  const [progress, setProgress] = useState<ProgressData>({
    current_progress: 0,
    duration: 0,
    is_playing: false
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        eventSource = new EventSource(resolvedUrl);

        eventSource.addEventListener('connected', () => {
          console.log('SSE connected');
          setIsConnected(true);
        });

        eventSource.addEventListener('song_started', (e) => {
          try {
            const data = JSON.parse(e.data);
            setCurrentSong({
              ...data,
              current_progress: 0,
              is_playing: true
            });
            setProgress({
              current_progress: 0,
              duration: data.duration || 0,
              is_playing: true
            });
          } catch (error) {
            console.error('Error parsing song_started:', error);
          }
        });

        eventSource.addEventListener('playback_progress', (e) => {
          try {
            const data = JSON.parse(e.data);
            setProgress(data);
            
            // Update current song with progress
            setCurrentSong(prev => prev ? {
              ...prev,
              current_progress: data.current_progress,
              is_playing: data.is_playing,
              duration: data.duration
            } : null);
          } catch (error) {
            console.error('Error parsing playback_progress:', error);
          }
        });

        eventSource.addEventListener('song_ended', () => {
          // Clear current song immediately
          setCurrentSong(null);
          setProgress({ current_progress: 0, duration: 0, is_playing: false });
        });

        eventSource.addEventListener('song_skipped', () => {
          // Clear current song immediately when skipped
          setCurrentSong(null);
          setProgress({ current_progress: 0, duration: 0, is_playing: false });
        });

        eventSource.addEventListener('queue_updated', (e) => {
          try {
            const data = JSON.parse(e.data);
            setQueue(data.queue || []);
          } catch (error) {
            console.error('Error parsing queue_updated:', error);
          }
        });

        eventSource.addEventListener('volume_changed', (e) => {
          try {
            const data = JSON.parse(e.data);
            setVolume(data.volume);
          } catch (error) {
            console.error('Error parsing volume_changed:', error);
          }
        });

        eventSource.addEventListener('playback_paused', () => {
          setProgress(prev => ({ ...prev, is_playing: false }));
          setCurrentSong(prev => prev ? { ...prev, is_playing: false } : null);
        });

        eventSource.addEventListener('playback_resumed', () => {
          setProgress(prev => ({ ...prev, is_playing: true }));
          setCurrentSong(prev => prev ? { ...prev, is_playing: true } : null);
        });

        eventSource.onerror = (error) => {
          console.error('SSE connection error, will attempt to reconnect...', error);
          setIsConnected(false);
          
          if (eventSource) {
            eventSource.close();
          }
          
          // Attempt to reconnect after 3 seconds
          reconnectTimeout = setTimeout(() => {
            console.log('Attempting to reconnect SSE...');
            connect();
          }, 3000);
        };

        eventSource.onopen = () => {
          console.log('SSE connection opened');
          setIsConnected(true);
        };

      } catch (error) {
        console.error('Failed to create EventSource:', error);
        setIsConnected(false);
        
        // Retry connection after 3 seconds
        reconnectTimeout = setTimeout(() => {
          console.log('Retrying SSE connection...');
          connect();
        }, 3000);
      }
    };

    // Initial connection
    connect();

    // Cleanup
    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (eventSource) {
        eventSource.close();
      }
      setIsConnected(false);
    };
  }, [resolvedUrl]);

  return {
    currentSong,
    queue,
    volume,
    progress,
    isConnected
  };
}