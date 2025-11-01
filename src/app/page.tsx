"use client";

import Navbar from "@/components/navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useJukeboxEvents } from "@/hooks/useJukeboxEvents";
import {
  searchAndRequestSong,
  requestSongByUrl,
  pausePlayback,
  resumePlayback,
  skipSong,
  setVolume as setVolumeAPI,
  getVolume
} from "@/lib/api";

export default function Home() {
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [localVolume, setLocalVolume] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Connect to SSE for real-time updates
  const { currentSong, queue, volume, progress, isConnected } = useJukeboxEvents();

  // Sync local volume with server volume
  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);

  // Load initial volume
  useEffect(() => {
    getVolume().then(setLocalVolume).catch(console.error);
  }, []);

  const handleRequest = async () => {
    if (!searchInput.trim()) return;
    
    setIsSubmitting(true);
    try {
      if (isUrlMode) {
        await requestSongByUrl(searchInput);
      } else {
        await searchAndRequestSong(searchInput);
      }
      setSearchInput("");
    } catch (error) {
      console.error('Failed to request song:', error);
      alert('Failed to request song. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (progress.is_playing) {
        await pausePlayback();
      } else {
        await resumePlayback();
      }
    } catch (error) {
      console.error('Failed to toggle playback:', error);
    }
  };

  const handleSkip = async () => {
    try {
      await skipSong();
    } catch (error) {
      console.error('Failed to skip song:', error);
    }
  };

  const handleVolumeChange = async (newVolume: number) => {
    setLocalVolume(newVolume);
    try {
      await setVolumeAPI(newVolume);
    } catch (error) {
      console.error('Failed to set volume:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-gray-800">
        <div className="w-full max-w-7xl p-2">
          {/* Connection Status */}
          <div className="mb-4 text-center">
            <span className={`inline-flex items-center gap-2 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}></span>
              {isConnected ? 'Connected to server' : 'Disconnected from server'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-6">
            {/* Queue Section */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-10 h-fit">
              <h2 className="text-xl font-semibold mb-4">Queue ({queue.length})</h2>
              <div className="space-y-3">
                {queue.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No songs in queue
                  </p>
                ) : (
                  queue.map((song, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      {song.thumbnail ? (
                        <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                          <Image 
                            src={song.thumbnail} 
                            alt={song.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded flex-shrink-0"></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{song.title}</p>
                        {song.channel && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{song.channel}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Center Content */}
            <div className="space-y-6">
              {/* Search Section */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-center">Search</h2>
                <div className="mb-2">
                  <button
                    onClick={() => setIsUrlMode(!isUrlMode)}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    {isUrlMode ? "Search by text?" : "Have a YT URL?"}
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRequest()}
                    placeholder={isUrlMode ? "Enter a YT URL..." : "Enter a search prompt..."}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    disabled={isSubmitting}
                  />
                  <button 
                    onClick={handleRequest}
                    disabled={isSubmitting || !searchInput.trim()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Requesting...' : 'Request'}
                  </button>
                </div>
              </div>

              {/* Now Playing Section */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-center">Now Playing</h2>
                <div className="flex flex-col items-center gap-6">
                  {currentSong ? (
                    <>
                      {currentSong.thumbnail ? (
                        <div className="relative w-64 h-64 rounded-full overflow-hidden">
                          <Image 
                            src={currentSong.thumbnail} 
                            alt={currentSong.title}
                            fill
                            className={`object-cover ${progress.is_playing ? 'animate-spin-slow' : ''}`}
                            style={{ animationDuration: progress.is_playing ? '8s' : '0s' }}
                            sizes="256px"
                            priority
                          />
                        </div>
                      ) : (
                        <div className={`w-64 h-64 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center ${progress.is_playing ? 'animate-spin-slow' : ''}`}
                             style={{ animationDuration: progress.is_playing ? '8s' : '0s' }}>
                          <span className="text-gray-400">No Thumbnail</span>
                        </div>
                      )}
                      <div className="text-center w-full">
                        <h3 className="text-xl font-semibold mb-2">{currentSong.title}</h3>
                        {currentSong.channel && (
                          <p className="text-gray-600 dark:text-gray-400">{currentSong.channel}</p>
                        )}
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>{formatTime(progress.current_progress)}</span>
                          <span>{formatTime(currentSong.duration || 0)}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                            style={{ 
                              width: currentSong.duration 
                                ? `${(progress.current_progress / currentSong.duration) * 100}%` 
                                : '0%' 
                            }}
                          ></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-64 h-64 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-gray-400">No Song Playing</span>
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Nothing Playing</h3>
                        <p className="text-gray-600 dark:text-gray-400">Request a song to get started</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Playback Controls */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-center">Playback Controls</h2>
                <div className="flex flex-col items-center gap-6">
                  <div className="flex gap-4">
                    <button 
                      onClick={handlePlayPause}
                      disabled={!currentSong}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {progress.is_playing ? "Pause" : "Play"}
                    </button>
                    <button 
                      onClick={handleSkip}
                      disabled={!currentSong}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Skip
                    </button>
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Volume: {localVolume}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={localVolume}
                      onChange={(e) => handleVolumeChange(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, rgb(37, 99, 235) 0%, rgb(37, 99, 235) ${localVolume}%, rgb(229, 231, 235) ${localVolume}%, rgb(229, 231, 235) 100%)`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Favorites Section - Placeholder for now */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-10 h-fit">
              <h2 className="text-xl font-semibold mb-4">Favorites</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Feature coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
