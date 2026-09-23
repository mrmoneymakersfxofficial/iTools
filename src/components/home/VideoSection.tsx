"use client";

import { useState, useEffect, useRef } from "react";
import { ExternalLink, Play, Pause, Volume2, VolumeX, Maximize2, ShoppingCart, X, RotateCcw } from "lucide-react";
import { getSanityAttr } from "@/lib/sanity/visual-attributes";
import { urlFor } from "@/sanity/image";

interface VideoItem {
  title: string;
  videoUrl?: string | null;
  videoFileUrl?: string | null;
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
  productSlug?: string;
  productLink?: string;
  order?: number;
}

interface VideoSectionData {
  sectionTitle?: string;
  sectionSubtitle?: string;
  videoSourceType?: string;
  videos?: VideoItem[];
}

function getEffectiveUrl(video: VideoItem): string {
  return (video.videoFileUrl || video.videoUrl || video.googleDriveUrl || "").trim();
}

function getEmbedInfo(url: string | null | undefined): { embedUrl: string; isDirectVideo: boolean; platform: string } {
  if (!url) return { embedUrl: "", isDirectVideo: false, platform: "none" };
  const clean = url.trim();

  // 1. Archivos de video directo subidos a Sanity o URLs .mp4 / .webm
  if (clean.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i) || clean.includes("cdn.sanity.io/files/")) {
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

  // 3. TikTok
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

  // 4. YouTube Shorts
  const shortsMatch = clean.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    const id = shortsMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&loop=1&playlist=${id}`,
      isDirectVideo: false,
      platform: "shorts",
    };
  }

  // 5. YouTube Standard
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
  { title: "TOTAL 4.0 — Las 7 Bestias en Acción", videoUrl: "https://www.tiktok.com/@itools.pe/video/7681826524290551061", productSlug: "akd2101" },
  { title: "Milwaukee M18 FUEL — Taladro Percutor 158Nm", videoUrl: "https://www.tiktok.com/@itools.pe/video/7681826524290551061", productSlug: "2904-20" },
  { title: "DeWalt 20V MAX XR — Atornillador Brushless", videoUrl: "https://www.tiktok.com/@itools.pe/video/7681826524290551061", productSlug: "dcf850" },
  { title: "Bosch Professional — Rotomartillo SDS-Plus", videoUrl: "https://www.tiktok.com/@itools.pe/video/7681826524290551061", productSlug: "gbh-180-li" },
  { title: "PACKOUT Milwaukee — Sistema Modular", videoUrl: "https://www.tiktok.com/@itools.pe/video/7681826524290551061", productSlug: "packout-48-22-8426" },
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

function getProductHref(video: VideoItem): string {
  if (video.productLink) return video.productLink;
  if (video.productSlug) return `/producto/${video.productSlug}`;
  return `/buscar?q=${encodeURIComponent(video.title)}`;
}

function VideoPlayerCard({
  video,
  index,
  onExpand,
}: {
  video: VideoItem;
  index: number;
  onExpand: (video: VideoItem) => void;
}) {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const rawUrl = getEffectiveUrl(video);
  const embed = getEmbedInfo(rawUrl);
  const platform = getVideoPlatform(rawUrl);
  const thumbnailUrl = getThumbnailUrl(video.thumbnail, rawUrl);
  const sanityAttr = getSanityAttr("videoSection", "videoSection", `videos[${index}]`);
  const productHref = getProductHref(video);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, index * 300);
    return () => clearTimeout(timer);
  }, [index]);

  const toggleDirectPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      {...sanityAttr}
      className="group relative shrink-0 w-[240px] sm:w-auto min-w-[220px] rounded-xl overflow-hidden bg-[#0E0E0E] border border-border dark:border-[#282828] shadow-md hover:shadow-xl hover:border-[#D1001C] transition-all duration-300 flex flex-col"
    >
      {/* Contenedor de Video 9:16 */}
      <div className="relative w-full aspect-[9/16] bg-black overflow-hidden flex items-center justify-center">
        {embed.isDirectVideo ? (
          <div className="relative w-full h-full cursor-pointer" onClick={toggleDirectPlay}>
            <video
              ref={videoRef}
              src={embed.embedUrl}
              autoPlay
              muted={isMuted}
              playsInline
              loop
              preload="metadata"
              className="w-full h-full object-cover bg-black"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Play overlay button if paused */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-[#E60000] text-white flex items-center justify-center shadow-xl">
                  <Play className="h-6 w-6 fill-white text-white translate-x-0.5" />
                </div>
              </div>
            )}

            {/* Top Right: Volume Mute/Unmute */}
            <button
              type="button"
              onClick={toggleMute}
              className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md shadow-md transition-transform hover:scale-105"
              aria-label={isMuted ? "Activar audio" : "Silenciar audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>
          </div>
        ) : thumbnailUrl && !isPlaying ? (
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
        ) : embed.embedUrl ? (
          <>
            <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5">
              {thumbnailUrl && isPlaying && (
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  className="bg-black/75 hover:bg-black text-white rounded-full py-0.5 px-2 text-[10px] font-bold flex items-center gap-1 backdrop-blur-md shadow-md transition-all cursor-pointer"
                  title="Volver a portada"
                >
                  ✕ Portada
                </button>
              )}
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="bg-black/75 hover:bg-black text-white/90 hover:text-white rounded-full p-1.5 backdrop-blur-md shadow-md transition-all cursor-pointer"
                title="Reiniciar video"
                aria-label="Reiniciar video"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
            {isReady || isPlaying ? (
              <iframe
                key={reloadKey}
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

        {/* Bottom Right of video: Expand/Fullscreen button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onExpand(video);
          }}
          className="absolute bottom-2.5 right-2.5 z-20 w-8 h-8 rounded-md bg-black/60 hover:bg-[#E60000] text-white flex items-center justify-center backdrop-blur-md shadow-md transition-all hover:scale-110"
          title="Agrandar video"
          aria-label="Agrandar video en pantalla completa"
        >
          <Maximize2 className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Título inferior con botón rojo de compra / carrito (Imagen 3) */}
      <div className="p-2.5 bg-white dark:bg-[#181818] border-t border-border dark:border-[#262626] flex items-center justify-between gap-2 mt-auto">
        <a
          href={productHref}
          className="text-[11px] sm:text-xs font-semibold text-foreground hover:text-[#E60000] line-clamp-1 flex-1 transition-colors"
          title={video.title}
        >
          {video.title}
        </a>
        <a
          href={productHref}
          aria-label={`Comprar ${video.title}`}
          className="w-8 h-8 rounded-md bg-[#E60000] text-white flex items-center justify-center shrink-0 hover:bg-[#c20000] active:scale-95 shadow-md transition-all"
        >
          <ShoppingCart className="w-4 h-4 text-white" />
        </a>
      </div>
    </div>
  );
}

export function VideoSection({ data }: { data: VideoSectionData | null }) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const videos = data?.videos && data.videos.length > 0 ? data.videos : fallbackVideos;

  return (
    <>
      <section
        className="py-6 md:py-8 bg-white dark:bg-[#111111] border-y border-border dark:border-[#222]"
        id="ofertas-en-tendencia"
        data-section="Ofertas en Tendencia"
        data-sanity-doc="videoSection"
      >
        <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
          {/* Cabecera de Sección (Imagen 3) */}
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

          {/* Grid de 5 Videos (Imagen 3) */}
          <div className="flex gap-3.5 overflow-x-auto pb-3 scrollbar-hide sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:overflow-visible">
            {videos.map((video, i) => (
              <VideoPlayerCard
                key={i}
                video={video}
                index={i}
                onExpand={(v) => setSelectedVideo(v)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal Pantalla Ampliada / Fullscreen */}
      {selectedVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-[420px] aspect-[9/16] max-h-[90vh] bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/70 hover:bg-[#E60000] text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer"
              aria-label="Cerrar video"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Content */}
            <div className="relative flex-1 w-full bg-black flex items-center justify-center overflow-hidden">
              {(() => {
                const raw = getEffectiveUrl(selectedVideo);
                const info = getEmbedInfo(raw);
                if (info.isDirectVideo) {
                  return (
                    <video
                      src={info.embedUrl}
                      controls
                      autoPlay
                      playsInline
                      loop
                      className="w-full h-full object-cover"
                    />
                  );
                }
                if (info.embedUrl) {
                  return (
                    <iframe
                      src={info.embedUrl}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                      allowFullScreen
                      title={selectedVideo.title}
                    />
                  );
                }
                return <div className="text-white text-sm">Video no disponible</div>;
              })()}
            </div>

            {/* Bottom Bar with Product Title and Red Buy Button */}
            <div className="p-3.5 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between gap-3 shrink-0">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{selectedVideo.title}</p>
                <p className="text-[10px] text-gray-400">iTools Perú Oficial</p>
              </div>
              <a
                href={getProductHref(selectedVideo)}
                className="px-4 py-2 rounded-lg bg-[#E60000] hover:bg-[#c20000] text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Comprar</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
