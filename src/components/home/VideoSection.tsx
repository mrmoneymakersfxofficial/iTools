"use client";

import { useState } from "react";
import { Play, X, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/image";
import Image from "next/image";

interface VideoItem {
  title: string;
  videoUrl?: string;
  googleDriveUrl?: string;
  thumbnail?: { asset?: { url?: string; metadata?: { dimensions?: { width?: number; height?: number }; lqip?: string } } };
  isVertical?: boolean;
  productSlug?: string;
  order?: number;
}

interface VideoSectionData {
  sectionTitle?: string;
  sectionSubtitle?: string;
  videoSourceType?: string;
  ctaText?: string;
  ctaLink?: string;
  videos?: VideoItem[];
}

function getVideoUrl(video: VideoItem): string {
  // Prefer videoUrl (new field), fallback to googleDriveUrl (legacy)
  const url = video.videoUrl || video.googleDriveUrl || "";
  return url;
}

function getEmbedUrl(url: string): { embedUrl: string; isExternal: boolean } {
  // Google Drive: convert to embed URL
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return { embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`, isExternal: false };
  }

  // YouTube: convert to embed URL
  // Standard: https://www.youtube.com/watch?v=VIDEO_ID
  const ytWatchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (ytWatchMatch) {
    return { embedUrl: `https://www.youtube.com/embed/${ytWatchMatch[1]}`, isExternal: false };
  }
  // Short: https://youtu.be/VIDEO_ID
  const ytShortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (ytShortMatch) {
    return { embedUrl: `https://www.youtube.com/embed/${ytShortMatch[1]}`, isExternal: false };
  }
  // Shorts: https://www.youtube.com/shorts/VIDEO_ID
  const ytShortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (ytShortsMatch) {
    return { embedUrl: `https://www.youtube.com/embed/${ytShortsMatch[1]}`, isExternal: false };
  }

  // TikTok: embed URL format
  // https://www.tiktok.com/@user/video/1234567890
  const tiktokMatch = url.match(/tiktok\.com\/@([^\/]+)\/video\/(\d+)/);
  if (tiktokMatch) {
    // TikTok oEmbed API format - we'll open in new tab instead
    return { embedUrl: url, isExternal: true };
  }
  // Short TikTok: https://vm.tiktok.com/XXXXX/
  if (url.includes("tiktok.com") || url.includes("vm.tiktok.com")) {
    return { embedUrl: url, isExternal: true };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return { embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`, isExternal: false };
  }

  // Default: try iframe embed, or fallback to external
  return { embedUrl: url, isExternal: true };
}

export function VideoSection({ data }: { data: VideoSectionData | null }) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  if (!data || !data.videos || data.videos.length === 0) return null;

  const isTikTokMode = data.videoSourceType === "tiktok";
  const isShortsMode = data.videoSourceType === "youtube" || isTikTokMode;

  // Vertical videos (TikTok/Shorts) get a different layout
  const hasVerticalVideos = data.videos.some((v) => v.isVertical) || isShortsMode;

  return (
    <>
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{data.sectionTitle || "Videos"}</h2>
              {data.sectionSubtitle && (
                <p className="text-muted-foreground mt-2">{data.sectionSubtitle}</p>
              )}
            </div>
            {data.ctaText && data.ctaLink && (
              <a href={data.ctaLink}>
                <Button variant="outline" className="gap-2">
                  {data.ctaText}
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>

          {hasVerticalVideos ? (
            /* Vertical video layout (TikTok/Shorts style) */
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {data.videos.map((video, i) => {
                const videoInfo = getVideoUrl(video);
                const embedData = getEmbedUrl(videoInfo);

                return (
                  <div
                    key={i}
                    className="shrink-0 snap-start relative group"
                    style={{ width: "200px", height: "356px" }}
                  >
                    <button
                      onClick={() => {
                        if (embedData.isExternal) {
                          window.open(embedData.embedUrl, "_blank", "noopener,noreferrer");
                        } else {
                          setActiveVideo(video);
                        }
                      }}
                      className="relative w-full h-full rounded-xl overflow-hidden bg-muted hover:ring-2 ring-primary transition-all"
                    >
                      {video.thumbnail?.asset?.url ? (
                        <Image
                          src={urlFor(video.thumbnail).width(400).height(700).format("webp").url()!}
                          alt={video.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-b from-muted to-muted/60">
                          <Play className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          <Play className="h-6 w-6 text-primary fill-primary" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <p className="text-white text-xs font-medium truncate">{video.title}</p>
                        {video.productSlug && (
                          <a
                            href={`/producto/${video.productSlug}`}
                            className="text-primary-foreground text-[10px] underline mt-0.5 inline-block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Ver producto
                          </a>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Standard horizontal video grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.videos.map((video, i) => {
                const videoInfo = getVideoUrl(video);
                const embedData = getEmbedUrl(videoInfo);

                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (embedData.isExternal) {
                        window.open(embedData.embedUrl, "_blank", "noopener,noreferrer");
                      } else {
                        setActiveVideo(video);
                      }
                    }}
                    className="group relative aspect-video rounded-xl overflow-hidden bg-muted hover:ring-2 ring-primary transition-all"
                  >
                    {video.thumbnail?.asset?.url ? (
                      <Image
                        src={urlFor(video.thumbnail).width(640).height(360).format("webp").url()!}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted">
                        <Play className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <Play className="h-6 w-6 text-primary fill-primary" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white text-sm font-medium truncate">{video.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Video Player Modal */}
      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black">
          <DialogTitle className="sr-only">{activeVideo?.title || "Video"}</DialogTitle>
          <button
            onClick={() => setActiveVideo(null)}
            className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          {activeVideo && (() => {
            const videoInfo = getVideoUrl(activeVideo);
            const embedData = getEmbedUrl(videoInfo);
            return (
              <div className={activeVideo.isVertical ? "aspect-[9/16] max-h-[80vh] mx-auto" : "aspect-video w-full"}>
                <iframe
                  src={embedData.embedUrl}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={activeVideo.title}
                />
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </>
  );
}
