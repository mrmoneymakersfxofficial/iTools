"use client";

import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Review {
  author: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified?: boolean;
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

export function ProductReviews({ reviews, productSlug }: { reviews: Review[]; productSlug: string }) {
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const avgRating = reviews.length > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;

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

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{review.author}</span>
                {review.isVerified && (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <ThumbsUp className="h-3 w-3" /> Verificada
                  </Badge>
                )}
                {review.source === "google" && (
                  <Badge variant="outline" className="text-xs">Google</Badge>
                )}
              </div>
              <StarRating rating={review.rating} />
            </div>
            {review.title && <p className="font-medium">{review.title}</p>}
            {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!
          </p>
        )}
      </div>

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
