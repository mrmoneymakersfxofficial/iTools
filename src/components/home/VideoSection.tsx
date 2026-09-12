"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Play } from "lucide-react";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";
import { urlFor } from "@/sanity/image";

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

  // 3. TikTok (Web standard / mobile / short / embed)
  const tiktokIdMatch =
    clean.match(/video\/(\d+)/) ||
    clean.match(/tiktok\.com\/v\/(\d+)/) ||
    clean.match(/tiktok\.com\/embed\/v2\/(\d+)/) ||
    clean.match(/tiktok\.com\/player\/v1\/(\d+)/) ||
    clean.match(/\/(\d{15,25})/);

  if (tiktokIdMatch) {
    return {
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktokIdMatch[1]}`,
      isDirectVideo: false,
      platform: "tiktok",
    };
  }

  // Fallback para URLs de perfil TikTok sin ID directo
  if (clean.includes("tiktok.com/@")) {
    return {
      embedUrl: `https://www.tiktok.com/embed/v2/7675136933642702100`,
      isDirectVideo: false,
      platform: "tiktok",
    };
  }

  // 4. YouTube Shorts (bucle infinito sin videos relacionados de otros usuarios)
  const shortsMatch = clean.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    const id = shortsMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&loop=1&playlist=${id}`,
      isDirectVideo: false,
      platform: "shorts",
    };
  }

  // 5. YouTube Standard (bucle infinito sin videos recomendados externos)
  const ytWatchMatch = clean.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/) || clean.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (ytWatchMatch) {
    const id = ytWatchMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&loop=1&playlist=${id}`,
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
  { title: "TOTAL TOOLS - Las 7 Bestias 4.0 en Acción", videoUrl: "https://www.tiktok.com/@itools.pe/video/7681826524290551061" },
  { title: "MILWAUKEE M18 FUEL - Taladro percutor 158 nm en acción", videoUrl: "https://www.tiktok.com/@itools.pe/video/7681826524290551061" },
  { title: "DEWALT XR 20V MAX - Atornillador brushless de alta potencia", videoUrl: "https://www.tiktok.com/@itools.pe/video/7681826524290551061" },
  { title: "BOSCH Professional - Rotomartillo SDS-Plus", videoUrl: "https://www.tiktok.com/@itools.pe/video/7681826524290551061" },
  { title: "PACKOUT Milwaukee - Configura tu sistema de transporte", videoUrl: "https://www.tiktok.com/@itools.pe/video/7681826524290551061" },
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

function VideoPlayerCard({ video, index }: { video: VideoItem; index: number }) {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const rawUrl = getEffectiveUrl(video);
  const embed = getEmbedInfo(rawUrl);
  const platform = getVideoPlatform(rawUrl);
  const thumbnailUrl = getThumbnailUrl(video.thumbnail, rawUrl);
  const sanityAttr = getSanityAttr("videoSection", "videoSection", `videos[${index}]`);

  // Stagger iframe loading (350ms per video) so TikTok's API is not hammered simultaneously
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, index * 350);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      {...sanityAttr}
      className="group relative shrink-0 w-[220px] sm:w-auto rounded-xl overflow-hidden bg-[#0E0E0E] border border-border dark:border-[#282828] shadow-md hover:shadow-xl hover:border-[#D1001C] transition-all duration-300 flex flex-col"
    >
      {/* Contenedor de Video con ratio 9:16 y bordes limpios sin recortar controles de TikTok */}
      <div className="relative w-full aspect-[9/16] bg-black overflow-hidden flex items-center justify-center">
        {/* Si hay miniatura y aún no se ha dado play (Estilo lámina Wiha / Autoland) */}
        {thumbnailUrl && !isPlaying ? (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="relative w-full h-full group/btn cursor-pointer block text-left"
            aria-label={`Reproducir ${video.title}`}
          >
            <img
              src={thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover group-hover/btn:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/25 group-hover/btn:bg-black/10 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-13 h-13 rounded-full bg-[#E60000] text-white flex items-center justify-center shadow-xl group-hover/btn:scale-110 group-hover/btn:bg-[#ff1a1a] transition-all duration-300">
                <Play className="h-6 w-6 fill-white text-white translate-x-0.5" />
              </div>
            </div>
          </button>
        ) : embed.isDirectVideo ? (
          <video
            src={embed.embedUrl}
            controls
            autoPlay={isPlaying}
            playsInline
            loop
            preload="metadata"
            className="w-full h-full object-contain bg-black"
          />
        ) : embed.embedUrl ? (
          <>
            {thumbnailUrl && isPlaying && (
              <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="absolute top-2 right-2 z-20 bg-black/70 hover:bg-black text-white rounded-full py-0.5 px-2 text-[10px] font-bold flex items-center gap-1 backdrop-blur-md shadow-md transition-all cursor-pointer"
                title="Volver a portada"
              >
                ✕ Portada
              </button>
            )}
            {isReady || isPlaying ? (
              <iframe
              src={embed.embedUrl}
              className="w-full h-full border-0 absolute inset-0"
              scrolling="no"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              loading="lazy"
              title={video.title}
            />
          ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#151515] animate-pulse">
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 font-bold text-sm">
                  ▶
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            Video no disponible
          </div>
        )}

        {/* Badge de Plataforma */}
        {platform && (
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span
              className="inline-flex items-center gap-1 text-[9px] font-bold text-white px-2 py-0.5 rounded-full shadow-md backdrop-blur-md"
              style={{ backgroundColor: `${platform.color}ee` }}
            >
              {platform.name}
            </span>
          </div>
        )}
      </div>

      {/* Título inferior con enlace externo directo */}
      <div className="p-2.5 bg-white dark:bg-[#181818] border-t border-border dark:border-[#262626] flex items-center justify-between gap-2 mt-auto">
        <p className="text-[11px] sm:text-xs font-semibold text-foreground line-clamp-1 flex-1" title={video.title}>
          {video.title}
        </p>
        {rawUrl && (
          <a
            href={rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#E60000] p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors shrink-0"
            title="Abrir en fuente oficial"
            aria-label="Abrir enlace"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

export function VideoSection({ data }: { data: VideoSectionData | null }) {
  const videos = data?.videos && data.videos.length > 0 ? data.videos : fallbackVideos;

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

        {/* Carrusel / Grid de Videos Directamente Embebidos */}
        <div className="flex gap-3.5 overflow-x-auto pb-3 scrollbar-hide sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:overflow-visible">
          {videos.map((video, i) => (
            <VideoPlayerCard key={i} video={video} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
