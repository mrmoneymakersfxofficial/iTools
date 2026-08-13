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
  // Convert Google Drive file URL to embed URL
  // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // → https://drive.google.com/file/d/FILE_ID/preview
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  // Already a preview link or other embeddable URL
  return url;
}

export function VideoSection({ data }: { data: VideoSectionData | null }) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  if (!data || !data.videos || data.videos.length === 0) return null;

  return (
    <>
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">{data.sectionTitle || "Videos"}</h2>
            {data.sectionSubtitle && (
              <p className="text-muted-foreground mt-2">{data.sectionSubtitle}</p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.videos.map((video, i) => (
              <button
                key={i}
                onClick={() => setActiveVideo(video)}
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
            ))}
          </div>
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
          {activeVideo && (
            <div className="aspect-video w-full">
              <iframe
                src={getEmbedUrl(activeVideo.googleDriveUrl)}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={activeVideo.title}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
