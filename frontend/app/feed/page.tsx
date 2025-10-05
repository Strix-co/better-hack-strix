"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Play,
  Pause,
  VolumeX,
  Volume2,
  Music2,
} from "lucide-react";

type VideoItem = {
  id: string;
  src: string;
  poster?: string;
  caption?: string;
  author?: string;
};

// Creative Commons sample videos (Blender / Google samples)
const videos: VideoItem[] = [
  {
    id: "bunny",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    caption: "Big Buck Bunny",
    author: "@blenderfoundation",
  },
  {
    id: "sintel",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
    caption: "Sintel",
    author: "@blenderfoundation",
  },
  {
    id: "elephants-dream",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    caption: "Elephants Dream",
    author: "@blenderfoundation",
  },
];

export default function FeedPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeVideo = useMemo(
    () => videoRefs.current[activeIndex] ?? null,
    [activeIndex]
  );

  // Playback state for the active video
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5); // 0..1
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showVolume, setShowVolume] = useState(false);

  // Autoplay the video in view, pause others
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLVideoElement;
          const idx = videoRefs.current.findIndex((v) => v === target);
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setActiveIndex(idx);
            const playPromise = target.play();
            if (playPromise && typeof playPromise.then === "function") {
              playPromise.catch(() => {
                // Autoplay can be blocked; ensure muted stays true
              });
            }
          } else {
            target.pause();
          }
        });
      },
      { root: container, threshold: [0, 0.25, 0.6, 0.75, 1] }
    );

    videoRefs.current.forEach((vid) => {
      if (vid) observer.observe(vid);
    });

    return () => observer.disconnect();
  }, []);

  // Keyboard navigation (optional): ArrowUp / ArrowDown to snap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollToIndex(Math.min(activeIndex + 1, videos.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollToIndex(Math.max(activeIndex - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    const section = container?.querySelector<HTMLDivElement>(
      `[data-index="${index}"]`
    );
    if (section && container) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleVideoClick = (video: HTMLVideoElement | null) => {
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  const handleConnect = () => {
    // Placeholder action for the overlay button
    // You can wire this to open a modal, start a websocket, or navigate
    alert("Connect clicked");
  };

  // Bind events to active video and sync state
  useEffect(() => {
    const vid = activeVideo;
    if (!vid) return;
    // apply current settings
    vid.muted = isMuted;
    vid.volume = volume;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => setCurrentTime(vid.currentTime || 0);
    const onMeta = () => setDuration(vid.duration || 0);

    vid.addEventListener("play", onPlay);
    vid.addEventListener("pause", onPause);
    vid.addEventListener("timeupdate", onTime);
    vid.addEventListener("loadedmetadata", onMeta);
    vid.addEventListener("durationchange", onMeta);
    // initialize immediately
    setIsPlaying(!vid.paused);
    setCurrentTime(vid.currentTime || 0);
    setDuration(vid.duration || vid.seekable?.end(0) || 0);

    return () => {
      vid.removeEventListener("play", onPlay);
      vid.removeEventListener("pause", onPause);
      vid.removeEventListener("timeupdate", onTime);
      vid.removeEventListener("loadedmetadata", onMeta);
      vid.removeEventListener("durationchange", onMeta);
    };
  }, [activeVideo]);

  // When mute/volume state changes, apply to active
  useEffect(() => {
    if (!activeVideo) return;
    activeVideo.muted = isMuted;
    activeVideo.volume = volume;
  }, [isMuted, volume, activeVideo]);

  const togglePlay = () => {
    if (!activeVideo) return;
    if (activeVideo.paused) activeVideo.play();
    else activeVideo.pause();
  };

  const toggleMute = () => setIsMuted((m) => !m);

  const onSeek = (value: number) => {
    if (!activeVideo || !duration) return;
    const t = Math.max(0, Math.min(1, value)) * duration;
    activeVideo.currentTime = t;
    setCurrentTime(t);
  };

  const onVolumeChange = (value: number) => {
    const v = Math.max(0, Math.min(1, value));
    setVolume(v);
    if (v > 0 && isMuted) setIsMuted(false);
  };

  const progress = duration ? currentTime / duration : 0;
  const timeFmt = (sec: number) => {
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Feed container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
      >
        {videos.map((v, i) => (
          <section
            key={v.id}
            data-index={i}
            className="relative h-screen w-full snap-start grid place-items-center"
          >
            {/* Centered narrow phone-like viewport */}
            <div className="relative h-full w-full max-w-[420px] sm:max-w-[430px] md:max-w-[460px] lg:max-w-[500px] mx-auto">
              {/* Video frame with rounded corners */}
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]">
                {/* Progress bar on top */}
                {i === activeIndex && (
                  <div className="absolute inset-x-0 top-0 z-20 h-1 bg-white/10">
                    <div
                      className="h-full bg-white/90 transition-[width] duration-100 ease-linear"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                )}

                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  className="h-full w-full object-cover"
                  src={v.src}
                  poster={v.poster}
                  playsInline
                  muted
                  loop
                  onClick={() => handleVideoClick(videoRefs.current[i])}
                />

                {/* Playback toolbar (bottom center) for active video */}
                {i === activeIndex && (
                  <div className="pointer-events-none absolute inset-x-3 bottom-3 z-30">
                    <div className="pointer-events-auto mx-auto flex w-full items-center gap-3 rounded-full bg-black/40 px-4 py-2 backdrop-blur-md border border-white/10">
                      <button
                        aria-label={isPlaying ? "Pause" : "Play"}
                        onClick={togglePlay}
                        className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-black hover:bg-white"
                      >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                      </button>

                      {/* Seek slider */}
                      <div className="flex w-full items-center gap-2">
                        <span className="select-none text-xs tabular-nums text-white/80">
                          {timeFmt(currentTime)}
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={1000}
                          value={Math.round(progress * 1000) || 0}
                          onChange={(e) => onSeek(Number(e.target.value) / 1000)}
                          className="h-1 w-full appearance-none rounded-full bg-white/20 accent-white outline-none"
                        />
                        <span className="select-none text-xs tabular-nums text-white/80">
                          {timeFmt(duration)}
                        </span>
                      </div>

                      {/* Volume controls */}
                      <div className="relative ml-1">
                        <button
                          onClick={toggleMute}
                          aria-label={isMuted ? "Unmute" : "Mute"}
                          className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-black hover:bg-white"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX size={18} />
                          ) : (
                            <Volume2 size={18} />
                          )}
                        </button>
                        {/* Toggleable vertical volume slider */}
                        <button
                          onClick={() => setShowVolume((s) => !s)}
                          className="ml-2 hidden rounded-full px-2 py-1 text-xs text-white/80 hover:bg-white/10 sm:block"
                        >
                          lvl
                        </button>
                        {showVolume && (
                          <div className="absolute -top-2 right-0 z-50 -translate-y-full rounded-xl border border-white/10 bg-black/60 px-3 py-3 backdrop-blur-md">
                            <div className="flex h-28 w-6 items-center justify-center">
                              <input
                                type="range"
                                min={0}
                                max={100}
                                value={Math.round((isMuted ? 0 : volume) * 100)}
                                onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
                                className="h-24 w-1 rotate-[-90deg] origin-center appearance-none rounded-full bg-white/20 accent-white outline-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Right side action bar */}
                <div className="absolute right-3 top-1/2 z-30 -translate-y-1/2">
                  <div className="flex flex-col items-center gap-5 text-white">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-black">JD</div>
                    <button className="grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                      <Heart />
                    </button>
                    <button className="grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                      <MessageCircle />
                    </button>
                    <button className="grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                      <Share2 />
                    </button>
                    <button className="grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                      <MoreVertical />
                    </button>
                  </div>
                </div>

                {/* Bottom-left metadata overlay */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 text-white/95 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <div className="max-w-[85%]">
                    {v.author && (
                      <p className="text-sm font-semibold drop-shadow-sm">{v.author}</p>
                    )}
                    {v.caption && (
                      <p className="mt-1 text-sm/5 drop-shadow-sm">
                        {v.caption} <span className="opacity-70">#demo #video</span>
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-xs text-white/80">
                      <Music2 size={16} />
                      <div className="relative w-40 overflow-hidden">
                        <div className="animate-[marquee_8s_linear_infinite] whitespace-nowrap">
                          Original sound · {v.author ?? "creator"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlay connect button inside the viewport */}
              {i === activeIndex && (
                <div className="pointer-events-none absolute inset-0 z-40">
                  <div className="pointer-events-auto absolute bottom-5 right-5">
                    <Button
                      size="lg"
                      className="rounded-full px-6 py-6 text-base shadow-lg"
                      onClick={handleConnect}
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}