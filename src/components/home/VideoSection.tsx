"use client";

import { useState } from "react";
import { Play, X, Smartphone } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { urlFor } from "@/sanity/image";
import Image from "next/image";

interface VideoItem {
  title: string;
  googleDriveUrl: string | null;
  thumbnail?: { asset?: { url?: string; metadata?: { dimensions?: { width?: number; height?: number }; lqip?: string } } };
  order?: number;
}

interface VideoSectionData {
  sectionTitle?: string;
  sectionSubtitle?: string;
  videos?: VideoItem[];
}

function getEmbedInfo(url: string | null | undefined): { embedUrl: string; isDirectVideo: boolean } {
  if (!url) return { embedUrl: "", isDirectVideo: false };
  const clean = url.trim();

  // Direct MP4 / WebM
  if (clean.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i)) {
    return { embedUrl: clean, isDirectVideo: true };
  }

  // Google Drive
  const driveMatch = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || clean.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return { embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`, isDirectVideo: false };
  }

  // TikTok
  const tiktokMatch = clean.match(/tiktok\.com\/@?[^/]+\/video\/(\d+)/) || clean.match(/tiktok\.com\/v\/(\d+)/);
  if (tiktokMatch) {
    return { embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`, isDirectVideo: false };
  }

  // YouTube Shorts
  const shortsMatch = clean.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    return { embedUrl: `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&rel=0&loop=1`, isDirectVideo: false };
  }

  // YouTube Standard
  const ytWatchMatch = clean.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/) || clean.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (ytWatchMatch) {
    return { embedUrl: `https://www.youtube.com/embed/${ytWatchMatch[1]}?autoplay=1&rel=0`, isDirectVideo: false };
  }

  if (clean.includes("youtube.com/embed/")) {
    return { embedUrl: clean.includes("autoplay") ? clean : `${clean}?autoplay=1&rel=0`, isDirectVideo: false };
  }

  // Vimeo
  const vimeoMatch = clean.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return { embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`, isDirectVideo: false };
  }

  return { embedUrl: clean, isDirectVideo: false };
}

function getVideoPlatform(url: string | null | undefined): { name: string; color: string } | null {
  if (!url) return null;
  if (url.includes("tiktok.com")) return { name: "TikTok", color: "#FE2C55" };
  if (url.includes("drive.google.com")) return { name: "Drive", color: "#4285F4" };
  if (url.includes("youtube.com/shorts")) return { name: "Shorts", color: "#FF0000" };
  if (url.includes("youtube.com") || url.includes("youtu.be")) return { name: "YouTube", color: "#FF0000" };
  if (url.includes("vimeo.com")) return { name: "Vimeo", color: "#1ab7ea" };
  return { name: "Video", color: "#D1001C" };
}

export function VideoSection({ data }: { data: VideoSectionData | null }) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  if (!data || !data.videos || data.videos.length === 0) return null;

  const embedInfo = activeVideo ? getEmbedInfo(activeVideo.googleDriveUrl) : null;

  return (
    <section className="py-6 md:py-8 bg-white dark:bg-[#111111] border-y border-border dark:border-[#222]">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600/10 text-[#D1001C]">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-impact text-foreground uppercase tracking-wide">
                {data.sectionTitle || "Videos y Demostraciones"}
              </h2>
              {data.sectionSubtitle && (
                <p className="text-xs text-muted-foreground">{data.sectionSubtitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Vertical Videos Scroll / Grid */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:overflow-visible">
          {data.videos.map((video, i) => {
            const platform = getVideoPlatform(video.googleDriveUrl);
            return (
              <button
                key={i}
                onClick={() => setActiveVideo(video)}
                className="group relative shrink-0 w-[140px] sm:w-auto aspect-[9/16] rounded-2xl overflow-hidden bg-[#1A1A1A] border border-border dark:border-[#333] shadow-sm hover:shadow-lg hover:border-[#D1001C] transition-all duration-300 text-left cursor-pointer"
              >
                {/* Thumbnail Image */}
                {video.thumbnail?.asset?.url ? (
                  <Image
                    src={urlFor(video.thumbnail).width(360).height(640).format("webp").url()!}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#222] to-[#111] p-3 text-center">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#D1001C] transition-colors mb-2">
                      <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 group-hover:via-black/10 transition-colors" />

                {/* Play Badge in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/80 group-hover:bg-[#D1001C] text-[#111] group-hover:text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Top Platform Tag */}
                {platform && (
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className="inline-flex items-center gap-1 text-[9px] font-bold text-white px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md"
                      style={{ backgroundColor: `${platform.color}dd` }}
                    >
                      {platform.name}
                    </span>
                  </div>
                )}

                {/* Bottom Title Info */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                  <p className="text-white text-[11px] sm:text-xs font-semibold line-clamp-2 leading-tight drop-shadow">
                    {video.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vertical Video Modal Player (TikTok/Reel style) */}
      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent className="max-w-[380px] p-0 overflow-hidden bg-black border border-white/10 rounded-2xl shadow-2xl">
          <DialogTitle className="sr-only">{activeVideo?.title || "Video"}</DialogTitle>
          <button
            onClick={() => setActiveVideo(null)}
            className="absolute right-3 top-3 z-30 rounded-full bg-black/70 p-2 text-white hover:bg-[#D1001C] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {activeVideo && embedInfo && (
            <div className="relative aspect-[9/16] w-full bg-black flex items-center justify-center overflow-hidden">
              {embedInfo.isDirectVideo ? (
                <video
                  src={embedInfo.embedUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <iframe
                  src={embedInfo.embedUrl}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={activeVideo.title}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
