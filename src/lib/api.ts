export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (typeof window !== "undefined" ? `http://${window.location.hostname}:8000` : "http://localhost:8000");

export interface Song {
  title: string;
  channel?: string;
  duration?: number;
  thumbnail?: string;
  url?: string;
}

export interface CurrentSong extends Song {
  current_progress: number;
  is_playing: boolean;
}

export interface AudioDevice {
  device_id: string | null;
  description: string;
}

// Search and request song by text prompt
export async function searchAndRequestSong(prompt: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/search_and_request_song`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  
  if (!response.ok) {
    throw new Error('Failed to search and request song');
  }
}

// Request song by direct URL
export async function requestSongByUrl(url: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/request_song_url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  
  if (!response.ok) {
    throw new Error('Failed to request song');
  }
}

// Get current queue
export async function getQueue(): Promise<Song[]> {
  const response = await fetch(`${API_BASE_URL}/get_queue`);
  const data = await response.json();
  return data.queue || [];
}

// Get current playing song
export async function getCurrentSong(): Promise<CurrentSong | null> {
  const response = await fetch(`${API_BASE_URL}/current_song`);
  const data = await response.json();
  return data.current_song;
}

// Playback controls
export async function pausePlayback(): Promise<void> {
  await fetch(`${API_BASE_URL}/pause_playback`, { method: 'POST' });
}

export async function resumePlayback(): Promise<void> {
  await fetch(`${API_BASE_URL}/resume_playback`, { method: 'POST' });
}

export async function skipSong(): Promise<void> {
  await fetch(`${API_BASE_URL}/skip`, { method: 'POST' });
}

// Volume control
export async function getVolume(): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/get_volume`);
  const data = await response.json();
  return data.volume;
}

export async function setVolume(volume: number): Promise<void> {
  await fetch(`${API_BASE_URL}/set_volume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ volume })
  });
}

// Audio device management
export async function getAudioDevices(): Promise<AudioDevice[]> {
  const response = await fetch(`${API_BASE_URL}/get_audio_devices`);
  const data = await response.json();
  return data.devices || [];
}

export async function getCurrentAudioDevice(): Promise<AudioDevice> {
  const response = await fetch(`${API_BASE_URL}/get_current_audio_device`);
  return await response.json();
}

export async function setAudioDevice(deviceId: string | null): Promise<void> {
  await fetch(`${API_BASE_URL}/set_audio_device`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ device_id: deviceId })
  });
}