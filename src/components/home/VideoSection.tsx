"use client";

import { useState } from "react";
import { Play, X, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { urlFor } from "@/sanity/image";
import Image from "next/image";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";

interface VideoItem {
  title: string;
  videoUrl?: string | null;
  googleDriveUrl?: string | null;
  thumbnail?: {
    asset?: {
      url?: string;
      metadata?: {
        dimensions?: { width?: number; height?: number };
        lqip?: string;
      };
    };
  };
  isVertical?: boolean;
  order?: number;
}

interface VideoSectionData {
  sectionTitle?: string;
  sectionSubtitle?: string;
  videoSourceType?: string;
  videos?: VideoItem[];
}

function getEffectiveUrl(video: VideoItem): string {
  return (video.videoUrl || video.googleDriveUrl || "").trim();
}

function getEmbedInfo(url: string | null | undefined): { embedUrl: string; isDirectVideo: boolean; platform: string } {
  if (!url) return { embedUrl: "", isDirectVideo: false, platform: "none" };
  const clean = url.trim();

  // 1. Archivos de video directo (MP4, WebM, MOV)
  if (clean.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i)) {
    return { embedUrl: clean, isDirectVideo: true, platform: "direct" };
  }

  // 2. Google Drive
  const driveMatch = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || clean.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return {
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
      isDirectVideo: false,
      platform: "drive",
    };
  }

  // 3. TikTok (Web standard / mobile / con o sin query params)
  const tiktokIdMatch = clean.match(/video\/(\d+)/) || clean.match(/tiktok\.com\/v\/(\d+)/) || clean.match(/\/(\d{15,25})/);
  if (tiktokIdMatch) {
    return {
      embedUrl: `https://www.tiktok.com/player/v1/${tiktokIdMatch[1]}`,
      isDirectVideo: false,
      platform: "tiktok",
    };
  }

  // 4. YouTube Shorts
  const shortsMatch = clean.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    return {
      embedUrl: `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&rel=0&loop=1`,
      isDirectVideo: false,
      platform: "shorts",
    };
  }

  // 5. YouTube Standard
  const ytWatchMatch = clean.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/) || clean.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (ytWatchMatch) {
    return {
      embedUrl: `https://www.youtube.com/embed/${ytWatchMatch[1]}?autoplay=1&rel=0`,
      isDirectVideo: false,
      platform: "youtube",
    };
  }

  if (clean.includes("youtube.com/embed/")) {
    return {
      embedUrl: clean.includes("autoplay") ? clean : `${clean}?autoplay=1&rel=0`,
      isDirectVideo: false,
      platform: "youtube",
    };
  }

  // 6. Vimeo
  const vimeoMatch = clean.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      isDirectVideo: false,
      platform: "vimeo",
    };
  }

  return { embedUrl: clean, isDirectVideo: false, platform: "other" };
}

function getVideoPlatform(url: string | null | undefined): { name: string; color: string } | null {
  if (!url) return null;
  const lower = url.toLowerCase();
  if (lower.includes("tiktok.com")) return { name: "TikTok", color: "#FE2C55" };
  if (lower.includes("drive.google.com")) return { name: "Drive", color: "#4285F4" };
  if (lower.includes("youtube.com/shorts")) return { name: "Shorts", color: "#FF0000" };
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return { name: "YouTube", color: "#FF0000" };
  if (lower.includes("vimeo.com")) return { name: "Vimeo", color: "#1AB7EA" };
  return { name: "Video", color: "#D1001C" };
}

const fallbackVideos: VideoItem[] = [
  { title: "MILWAUKEE M18 FUEL - Taladro percutor 158 nm en acción", videoUrl: "https://www.tiktok.com/@itoolsperu" },
  { title: "TOTAL TOOLS - Rotomartillo inalámbrico 20V industrial brushless", videoUrl: "https://www.tiktok.com/@itoolsperu" },
  { title: "DEWALT XR 20V MAX - Atornillador brushless de alta potencia", videoUrl: "https://www.tiktok.com/@itoolsperu" },
  { title: "BOSCH Professional - Rotomartillo SDS-Plus", videoUrl: "https://www.tiktok.com/@itoolsperu" },
  { title: "MAKITA 18V LXT - Atornillador de impacto", videoUrl: "https://www.tiktok.com/@itoolsperu" },
];

function getThumbnailUrl(thumbnail: any, rawUrl?: string): string | null {
  if (thumbnail?.asset?.url) {
    try {
      return urlFor(thumbnail).width(360).height(640).format("webp").url() || thumbnail.asset.url;
    } catch {
      return thumbnail.asset.url;
    }
  }
  if (rawUrl) {
    const ytMatch = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:shorts\/|watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
    if (ytMatch) {
      return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    }
  }
  return null;
}

export function VideoSection({ data }: { data: VideoSectionData | null }) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const videos = data?.videos && data.videos.length > 0 ? data.videos : fallbackVideos;

  const activeUrl = activeVideo ? getEffectiveUrl(activeVideo) : null;
  const embedInfo = activeUrl ? getEmbedInfo(activeUrl) : null;

  return (
    <section
      className="py-6 md:py-8 bg-white dark:bg-[#111111] border-y border-border dark:border-[#222]"
      id="ofertas-en-tendencia"
      data-section="Ofertas en Tendencia"
      data-sanity-doc="videoSection"
    >
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        {/* Cabecera de Sección */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[#E60000] font-black text-lg tracking-tighter">▶▶</span>
            <h2 className="text-base sm:text-lg font-black text-foreground uppercase tracking-wider">
              {data?.sectionTitle || "VIDEOS DE PRODUCTOS Y PROMOCIONES"}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {data?.sectionSubtitle || "Descubre nuestras herramientas en acción — Tutoriales, demos y más"}
          </p>
        </div>

        {/* Carrusel / Grid de Videos */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:overflow-visible">
          {videos.map((video, i) => {
            const rawUrl = getEffectiveUrl(video);
            const platform = getVideoPlatform(rawUrl);
            const thumbUrl = getThumbnailUrl(video.thumbnail, rawUrl);
            const sanityAttr = getSanityAttr("videoSection", "videoSection", `videos[${i}]`);

            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveVideo(video)}
                {...sanityAttr}
                className="group relative shrink-0 w-[140px] sm:w-auto aspect-[9/16] rounded-2xl overflow-hidden bg-[#1A1A1A] border border-border dark:border-[#333] shadow-sm hover:shadow-lg hover:border-[#D1001C] transition-all duration-300 text-left cursor-pointer"
              >
                {/* Miniatura */}
                {thumbUrl ? (
                  <Image
                    src={thumbUrl}
                    alt={video.title}
                    fill
                    sizes="(max-width: 640px) 140px, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-between bg-gradient-to-b from-[#181818] via-[#111111] to-[#0a0a0a] p-3 text-center border-t-2 border-[#FE2C55]/80">
                    <div className="w-full flex justify-end">
                      <span className="text-[10px] font-black tracking-widest text-[#25F4EE] drop-shadow-[0_0_8px_rgba(37,244,238,0.5)]">
                        TIK<span className="text-[#FE2C55]">TOK</span>
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-11 w-11 rounded-full bg-white/10 group-hover:bg-[#FE2C55] transition-all flex items-center justify-center shadow-lg group-hover:scale-110 mb-1">
                        <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">Ver video</span>
                    </div>
                    <div className="h-2" />
                  </div>
                )}

                {/* Overlay oscuro */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 group-hover:via-black/10 transition-colors" />

                {/* Botón de Play Central */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/80 group-hover:bg-[#D1001C] text-[#111] group-hover:text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Badge de Plataforma */}
                {platform && (
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span
                      className="inline-flex items-center gap-1 text-[9px] font-bold text-white px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md"
                      style={{ backgroundColor: `${platform.color}dd` }}
                    >
                      {platform.name}
                    </span>
                  </div>
                )}

                {/* Título inferior */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 z-10">
                  <p className="text-white text-[11px] sm:text-xs font-semibold line-clamp-2 leading-tight drop-shadow">
                    {video.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal Reproductor */}
      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent className="max-w-[420px] p-0 overflow-hidden bg-black border border-white/10 rounded-2xl shadow-2xl">
          <DialogTitle className="sr-only">{activeVideo?.title || "Video"}</DialogTitle>
          <button
            type="button"
            onClick={() => setActiveVideo(null)}
            aria-label="Cerrar video"
            className="absolute right-3 top-3 z-30 rounded-full bg-black/70 p-2 text-white hover:bg-[#D1001C] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {activeVideo && embedInfo && embedInfo.embedUrl && (
            <div className="relative aspect-[9/16] w-full bg-black flex flex-col items-center justify-center overflow-hidden">
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
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={activeVideo.title}
                />
              )}

              {/* Botón de respaldo en la parte inferior para abrir directamente */}
              {activeUrl && (
                <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-center">
                  <a
                    href={activeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#FE2C55] hover:bg-[#E60000] text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl transition-all hover:scale-105 border border-white/20"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Ver en {embedInfo.platform === "tiktok" ? "TikTok Oficial ↗" : "Fuente Original ↗"}</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
