import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Play,
  Pause,
  Disc3,
  Sparkles,
  SkipBack,
  SkipForward,
  Radio,
  Loader2
} from 'lucide-react';
import { soundFx } from '../hooks/useSoundEffects';

// Curated high-reliability restaurant lounge streams + offline ambient synthesizer
const LOUNGE_STREAMS = [
  {
    id: 'groove',
    title: "Zafaron Sunset Chillout",
    artist: "SomaFM Ambient Lounge",
    badge: "Jonli Efir",
    url: "https://ice1.somafm.com/groovesalad-128-mp3",
    isStream: true
  },
  {
    id: 'jazz',
    title: "Royal Dining Jazz",
    artist: "Classic Cocktail & Spy Lounge",
    badge: "Jonli Efir",
    url: "https://ice1.somafm.com/secretagent-128-mp3",
    isStream: true
  },
  {
    id: 'lush',
    title: "Oqshom Bog'i Melodiyalari",
    artist: "Sensuous Mellow Chill",
    badge: "Jonli Efir",
    url: "https://ice1.somafm.com/lush-128-mp3",
    isStream: true
  },
  {
    id: 'synth',
    title: "Zafaron Zen Sanctuary",
    artist: "Oflayn Relaks & Meditatsiya",
    badge: "100% Oflayn",
    url: "",
    isStream: false
  }
];

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const audioRef = useRef(null);
  const currentTrack = LOUNGE_STREAMS[currentTrackIndex];

  // Adjust volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    soundFx.setAmbientVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  // Handle Play/Pause
  const startPlayback = useCallback((track) => {
    const active = track || currentTrack;
    setStreamError(false);

    if (!active.isStream) {
      // Offline Web Audio synthesizer
      if (audioRef.current) audioRef.current.pause();
      soundFx.startAmbientLounge(isMuted ? 0 : volume);
      setIsLoading(false);
      setIsPlaying(true);
      return;
    }

    // Online stream
    soundFx.stopAmbientLounge();
    if (!audioRef.current) return;

    setIsLoading(true);
    audioRef.current.src = active.url;
    audioRef.current.volume = isMuted ? 0 : volume;
    
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setIsLoading(false);
    }).catch((err) => {
      console.warn("Audio play error, falling back to Zen Sanctuary:", err);
      setIsLoading(false);
      setStreamError(true);
      // Fallback to offline ambient synthesizer seamlessly
      soundFx.startAmbientLounge(isMuted ? 0 : volume);
      setIsPlaying(true);
    });
  }, [currentTrack, volume, isMuted]);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    soundFx.stopAmbientLounge();
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const togglePlay = () => {
    soundFx.playPop();
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const handleNextTrack = () => {
    soundFx.playPop();
    const nextIndex = (currentTrackIndex + 1) % LOUNGE_STREAMS.length;
    setCurrentTrackIndex(nextIndex);
    if (isPlaying) {
      startPlayback(LOUNGE_STREAMS[nextIndex]);
    }
  };

  const handlePrevTrack = () => {
    soundFx.playPop();
    const prevIndex = (currentTrackIndex - 1 + LOUNGE_STREAMS.length) % LOUNGE_STREAMS.length;
    setCurrentTrackIndex(prevIndex);
    if (isPlaying) {
      startPlayback(LOUNGE_STREAMS[prevIndex]);
    }
  };

  const selectTrack = (index) => {
    soundFx.playPop();
    setCurrentTrackIndex(index);
    if (isPlaying) {
      startPlayback(LOUNGE_STREAMS[index]);
    }
  };

  const toggleMute = () => {
    soundFx.playPop();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
    soundFx.setMuted(nextMuted);
    soundFx.setAmbientVolume(nextMuted ? 0 : volume);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      <audio
        ref={audioRef}
        preload="none"
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => {
          if (!currentTrack.isStream) return;
          setIsPlaying(false);
        }}
        onError={() => {
          // If live stream network drop occurs, gracefully switch to offline Zen
          console.warn("Live radio stream offline, switching to Zen Sanctuary");
          setStreamError(true);
          setIsLoading(false);
          soundFx.startAmbientLounge(isMuted ? 0 : volume);
          setIsPlaying(true);
        }}
      />

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="mb-3 w-80 p-4 rounded-3xl bg-dark-900/95 border border-gold-500/40 backdrop-blur-2xl shadow-2xl text-white animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-gold-500/10 text-gold-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-serif font-black tracking-wider text-gold-400 uppercase">
                Zafaron Lounge FM
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-xs text-gray-400 hover:text-white px-2 py-0.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Current Track Info */}
          <div className="py-3.5 flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-gold-400 flex items-center justify-center shadow-lg relative ${isPlaying && !isLoading ? 'animate-spin-slow' : ''}`}>
              <Disc3 className="w-6 h-6 text-dark-950" />
              {isPlaying && !isLoading && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-dark-900 animate-pulse" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                  currentTrack.isStream ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {streamError ? "Oflayn Rejim" : currentTrack.badge}
                </span>
              </div>
              <p className="text-xs font-bold text-white truncate mt-0.5">{currentTrack.title}</p>
              <p className="text-[11px] text-gray-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Equalizer Visualizer */}
          <div className="h-4 flex items-end justify-center gap-1 mb-2 px-4">
            {[40, 75, 55, 90, 60, 85, 45, 100, 70, 50, 80, 65].map((height, i) => (
              <span
                key={i}
                style={{
                  height: isPlaying && !isLoading ? `${height}%` : '20%',
                  transition: 'height 0.25s ease'
                }}
                className={`w-1 rounded-full ${
                  isPlaying && !isLoading
                    ? 'bg-gradient-to-t from-amber-500 to-gold-300 animate-pulse'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Station Selector Pills */}
          <div className="grid grid-cols-2 gap-1.5 py-2 border-t border-b border-white/5 my-2">
            {LOUNGE_STREAMS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => selectTrack(idx)}
                className={`text-left p-1.5 px-2 rounded-xl text-[10px] transition-all flex items-center justify-between ${
                  currentTrackIndex === idx
                    ? 'bg-gold-500/20 border border-gold-500/50 text-gold-300 font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <span className="truncate">{s.title.split(' ')[0]} {s.title.split(' ')[1] || ''}</span>
                {currentTrackIndex === idx && <Radio className="w-2.5 h-2.5 text-gold-400 flex-shrink-0" />}
              </button>
            ))}
          </div>

          {/* Controls & Volume */}
          <div className="pt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevTrack}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Oldingi kanal"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={togglePlay}
                disabled={isLoading}
                className="w-10 h-10 rounded-2xl gold-gradient-bg flex items-center justify-center text-dark-950 font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-dark-950" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4 fill-dark-950" />
                ) : (
                  <Play className="w-4 h-4 fill-dark-950 ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNextTrack}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Keyingi kanal"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-1.5 flex-1 max-w-[120px]">
              <button
                onClick={toggleMute}
                className="p-1 text-gray-400 hover:text-gold-400 transition-colors flex-shrink-0"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (isMuted && val > 0) setIsMuted(false);
                }}
                className="w-full accent-gold-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill Toggle Button */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-dark-900/95 hover:bg-dark-900 border border-gold-500/40 shadow-2xl backdrop-blur-xl transition-all hover:scale-105 group">
        <button
          onClick={togglePlay}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-gradient-to-tr from-amber-500 to-gold-400 text-dark-950 shadow-glow'
              : 'bg-white/10 text-gold-400 hover:bg-gold-500/20'
          }`}
          title={isPlaying ? "Musiqani to'xtatish" : "Zafaron Lounge musiqasini yoqish"}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
          ) : isPlaying ? (
            <div className="flex items-center gap-0.5 h-3.5">
              <span className="w-0.5 h-full bg-dark-950 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
              <span className="w-0.5 h-2 bg-dark-950 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
              <span className="w-0.5 h-3 bg-dark-950 rounded-full animate-[pulse_0.5s_ease-in-out_infinite]" />
            </div>
          ) : (
            <Music className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-2.5 py-1 text-left hidden sm:block text-xs font-semibold text-gray-200 hover:text-gold-400 transition-colors"
        >
          <span className="block text-[10px] text-gold-400 font-bold uppercase tracking-wider flex items-center gap-1">
            Lounge Audio
            {isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />}
          </span>
          <span className="block text-[11px] text-gray-300 font-light truncate max-w-[110px]">
            {isLoading ? "Ulanmoqda..." : isPlaying ? currentTrack.title : "Yoqish uchun bosing"}
          </span>
        </button>
      </div>
    </div>
  );
};
