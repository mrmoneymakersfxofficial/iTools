"use client";

import { useState } from "react";
import { Star, ThumbsUp, ShieldCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Review {
  author: string;
  authorAvatar?: { asset?: { url?: string } };
  rating: number;
  title?: string;
  comment?: string;
  isVerified?: boolean;
  isLocalGuide?: boolean;
  reviewCount?: number;
  datePublished?: string;
  source?: string;
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${cls} ${s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
      ))}
    </div>
  );
}

function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          className="p-0.5"
        >
          <Star className={`h-6 w-6 ${(hover || value) >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} transition-colors`} />
        </button>
      ))}
    </div>
  );
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "Hoy";
  if (diffDays < 30) return `Hace ${diffDays} días`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `Hace ${diffMonths} meses`;
  return `Hace ${Math.floor(diffMonths / 12)} años`;
}

export function ProductReviews({ reviews, productSlug }: { reviews: Review[]; productSlug: string }) {
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const avgRating = reviews.length > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;

  // Separate Google and website reviews
  const googleReviews = reviews.filter((r) => r.source === "google");
  const websiteReviews = reviews.filter((r) => r.source !== "google");

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-4xl font-bold">{avgRating.toFixed(1)}</p>
          <StarRating rating={Math.round(avgRating)} size="lg" />
          <p className="text-sm text-muted-foreground mt-1">{reviews.length} reseñas</p>
        </div>
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((s) => {
            const count = reviews.filter((r) => Math.round(r.rating) === s).length;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={s} className="flex items-center gap-2">
                <span className="text-sm w-3">{s}</span>
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-6">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Google Reviews Section */}
      {googleReviews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.99 7.72 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.72 1 3.99 3.01 2.18 7.07l3.66 2.84c.87-2.6 =3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <h3 className="text-sm font-semibold">Reseñas de Google</h3>
            <span className="text-xs text-muted-foreground">({googleReviews.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {googleReviews.map((review, i) => (
              <div key={`google-${i}`} className="border rounded-lg p-4 space-y-2 bg-blue-50/30 dark:bg-blue-950/10">
                <div className="flex items-center gap-3">
                  {review.authorAvatar?.asset?.url ? (
                    <Image
                      src={review.authorAvatar.asset.url}
                      alt={review.author}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-sm">
                      {review.author.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm truncate">{review.author}</span>
                      {review.isLocalGuide && (
                        <Badge variant="secondary" className="text-[10px] gap-0.5 px-1.5 py-0">
                          <ShieldCheck className="h-3 w-3" /> Local Guide
                        </Badge>
                      )}
                    </div>
                    {review.reviewCount && (
                      <p className="text-[10px] text-muted-foreground">{review.reviewCount} reseñas</p>
                    )}
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                {review.title && <p className="font-medium text-sm">{review.title}</p>}
                {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                {review.datePublished && (
                  <p className="text-xs text-muted-foreground">{timeAgo(review.datePublished)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Website Reviews List */}
      {websiteReviews.length > 0 && (
        <div className="space-y-3">
          {googleReviews.length > 0 && <h3 className="text-sm font-semibold">Reseñas del sitio</h3>}
          {websiteReviews.map((review, i) => (
            <div key={`web-${i}`} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{review.author}</span>
                  {review.isVerified && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <ThumbsUp className="h-3 w-3" /> Verificada
                    </Badge>
                  )}
                </div>
                <StarRating rating={review.rating} />
              </div>
              {review.title && <p className="font-medium">{review.title}</p>}
              {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
              {review.datePublished && (
                <p className="text-xs text-muted-foreground">{timeAgo(review.datePublished)}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {reviews.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!
        </p>
      )}

      {/* Write Review Button */}
      <Button variant="outline" onClick={() => setShowForm(!showForm)} className="w-full">
        {showForm ? "Cancelar" : "Escribir una reseña"}
      </Button>

      {/* Review Form (simple client-side, posts to /api/reviews) */}
      {showForm && (
        <form
          className="border rounded-lg p-4 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const res = await fetch("/api/reviews", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productSlug,
                author: (form.author as HTMLInputElement).value,
                rating: formRating,
                title: (form.reviewTitle as HTMLInputElement).value,
                comment: (form.reviewComment as HTMLTextAreaElement).value,
              }),
            });
            if (res.ok) {
              setShowForm(false);
              window.location.reload();
            }
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-1">Calificación</label>
            <StarSelector value={formRating} onChange={setFormRating} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tu nombre</label>
            <Input name="author" required placeholder="Juan Pérez" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Título (opcional)</label>
            <Input name="reviewTitle" placeholder="¡Excelente producto!" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tu reseña</label>
            <Textarea name="reviewComment" rows={3} placeholder="Cuéntanos tu experiencia..." />
          </div>
          <Button type="submit" className="w-full">Enviar reseña</Button>
        </form>
      )}
    </div>
  );
}
