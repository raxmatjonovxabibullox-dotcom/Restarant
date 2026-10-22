import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, Disc3, Sparkles } from 'lucide-react';
import { soundFx } from '../hooks/useSoundEffects';

// Curated royalty-free relaxing restaurant lounge instrumental stream & ambient tracks
const LOUNGE_STREAMS = [
  {
    title: "Zafaron Sunset Lounge",
    artist: "Royal Oriental Chillout",
    // Reliable luxury lounge audio stream URL
    url: "https://stream.zeno.fm/4n8h4vsv27zuv"
  },
  {
    title: "Tashkent Evening Jazz",
    artist: "Acoustic Dining Ambience",
    url: "https://streams.ilovemusic.de/iloveradio/ilovechillhop.mp3"
  }
];

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  const currentTrack = LOUNGE_STREAMS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    soundFx.playPop();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn("Audio autoplay blocked:", e);
        setIsPlaying(false);
      });
    }
  };

  const toggleMute = () => {
    soundFx.playPop();
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    soundFx.setMuted(nextMuted);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        preload="none"
        onEnded={() => setCurrentTrackIndex((prev) => (prev + 1) % LOUNGE_STREAMS.length)}
        onError={() => {
          // Switch to fallback if stream has issues
          setCurrentTrackIndex((prev) => (prev + 1) % LOUNGE_STREAMS.length);
        }}
      />

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="mb-3 w-72 p-4 rounded-2xl bg-dark-900/95 border border-gold-500/30 backdrop-blur-xl shadow-2xl text-white animate-slide-up">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-serif font-bold tracking-wider text-gold-400 uppercase">
                Zafaron Lounge FM
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-xs text-gray-400 hover:text-white px-1.5 py-0.5 rounded-md hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <div className="py-3 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 to-gold-400 flex items-center justify-center shadow-lg ${isPlaying ? 'animate-spin-slow' : ''}`}>
              <Disc3 className="w-6 h-6 text-dark-950" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentTrack.title}</p>
              <p className="text-[11px] text-gold-400/80 truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Controls & Volume */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center text-dark-950 font-bold shadow-md hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 text-gray-300 hover:text-gold-400 transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
      )}

      {/* Floating Pill Toggle Button */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-dark-900/90 hover:bg-dark-900 border border-gold-500/40 shadow-xl backdrop-blur-md transition-all hover:scale-105 group">
        <button
          onClick={togglePlay}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-gradient-to-tr from-amber-500 to-gold-400 text-dark-950 shadow-glow'
              : 'bg-white/10 text-gold-400 hover:bg-gold-500/20'
          }`}
          title={isPlaying ? "Musiqani to'xtatish" : "Zafaron Lounge musiqasini yoqish"}
        >
          {isPlaying ? (
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
          <span className="block text-[10px] text-gold-400 font-bold uppercase tracking-wider">Lounge Audio</span>
          <span className="block text-[11px] text-gray-300 font-light truncate max-w-[100px]">
            {isPlaying ? "Musiqa yangramoqda" : "Yoqish uchun bosing"}
          </span>
        </button>
      </div>
    </div>
  );
};
