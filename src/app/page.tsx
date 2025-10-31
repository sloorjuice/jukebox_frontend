"use client";

import Navbar from "@/components/navbar";
import { useState } from "react";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [volume, setVolume] = useState(50);

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-gray-800">
        <div className="w-full max-w-7xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-6">
            {/* Queue Section */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-10 h-fit">
              <h2 className="text-xl font-semibold mb-4">Queue</h2>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Song Title {item}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">Artist Name</p>
                    </div>
                  </div>
                ))}
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
                    placeholder={isUrlMode ? "Enter a YT URL..." : "Enter a search prompt..."}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                    Request
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-center">Now Playing</h2>
                <div className="flex flex-col items-center gap-6">
                  <div className="w-64 h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Album Art</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Song Title</h3>
                    <p className="text-gray-600 dark:text-gray-400">Artist Name</p>
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>0:00</span>
                      <span>3:45</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-center">Playback Controls</h2>
                <div className="flex flex-col items-center gap-6">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      {isPlaying ? "Pause" : "Play"}
                    </button>
                    <button className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
                      Skip
                    </button>
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Volume: {volume}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:bg-blue-700 [&::-webkit-slider-thumb]:transition-colors [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz	range-thumb]:bg-blue-600 [&::-moz	range-thumb]:border-0 [&::-moz	range-thumb]:cursor-pointer [&::-moz	range-thumb]:shadow-md [&::-moz	range-thumb]:hover:bg-blue-700 [&::-moz	range-thumb]:transition-colors"
                      style={{
                        background: `linear-gradient(to right, rgb(37, 99, 235) 0%, rgb(37, 99, 235) ${volume}%, rgb(229, 231, 235) ${volume}%, rgb(229, 231, 235) 100%)`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Favorites Section */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-10 h-fit">
              <h2 className="text-xl font-semibold mb-4">Favorites</h2>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Favorite {item}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">Artist Name</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
