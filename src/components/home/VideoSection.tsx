"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { urlFor } from "@/sanity/image";
import Image from "next/image";

interface VideoItem {
  title: string;
  googleDriveUrl: string;
  thumbnail?: { asset?: { url?: string; metadata?: { dimensions?: { width?: number; height?: number }; lqip?: string } } };
  order?: number;
}

interface VideoSectionData {
  sectionTitle?: string;
  sectionSubtitle?: string;
  videos?: VideoItem[];
}

function getEmbedUrl(url: string): string {
  if (!url) return "";
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&rel=0`;
  const ytWatchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (ytWatchMatch) return `https://www.youtube.com/embed/${ytWatchMatch[1]}?autoplay=1&rel=0`;
  const ytShortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (ytShortMatch) return `https://www.youtube.com/embed/${ytShortMatch[1]}?autoplay=1&rel=0`;
  if (url.includes("youtube.com/embed/")) return url.includes("autoplay") ? url : `${url}?autoplay=1&rel=0`;
  const tiktokMatch = url.match(/tiktok\.com\/@([^/]+)\/video\/(\d+)/);
  if (tiktokMatch) return `https://www.tiktok.com/embed/v2/${tiktokMatch[2]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  return url;
}

function getVideoPlatform(url: string): { name: string; color: string } | null {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return { name: "YouTube", color: "#FF0000" };
  if (url.includes("tiktok.com")) return { name: "TikTok", color: "#00f2ea" };
  if (url.includes("vimeo.com")) return { name: "Vimeo", color: "#1ab7ea" };
  if (url.includes("drive.google.com")) return { name: "Google Drive", color: "#4285F4" };
  return null;
}

export function VideoSection({ data }: { data: VideoSectionData | null }) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  if (!data || !data.videos || data.videos.length === 0) return null;

  return (
    <>
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">{data.sectionTitle || "iTools en Acción"}</h2>
            {data.sectionSubtitle && <p className="text-muted-foreground mt-2">{data.sectionSubtitle}</p>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {data.videos.map((video, i) => {
              const platform = getVideoPlatform(video.googleDriveUrl);
              return (
                <button key={i} onClick={() => setActiveVideo(video)} className="group relative rounded-xl overflow-hidden bg-muted hover:ring-2 ring-primary transition-all">
                  {video.thumbnail?.asset?.url ? (
                    <Image src={urlFor(video.thumbnail).width(640).height(360).format("webp").url()!} alt={video.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="flex items-center justify-center aspect-video bg-gradient-to-br from-muted to-muted/50">
                      <Play className="h-12 w-12 text-muted-foreground/60" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Play className="h-6 w-6 text-primary fill-primary" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    {platform && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white/90 px-1.5 py-0.5 rounded mb-1" style={{ backgroundColor: `${platform.color}30` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: platform.color }} />
                        {platform.name}
                      </span>
                    )}
                    <p className="text-white text-xs font-medium line-clamp-2">{video.title}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {data.videos.length > 5 && (
            <div className="text-center mt-6">
              <a href="/videos" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                Ver más producciones <Play className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>
      </section>
      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black">
          <DialogTitle className="sr-only">{activeVideo?.title || "Video"}</DialogTitle>
          <button onClick={() => setActiveVideo(null)} className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors">
            <X className="h-4 w-4" />
          </button>
          {activeVideo && (
            <div className="aspect-video w-full">
              <iframe src={getEmbedUrl(activeVideo.googleDriveUrl)} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen title={activeVideo.title} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
