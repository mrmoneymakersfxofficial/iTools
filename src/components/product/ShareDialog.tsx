"use client";

import { Share2, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const socialNetworks = [
  { name: "WhatsApp", color: "#25D366", getUrl: (url: string, text: string) => `https://wa.me/?text=${encodeURIComponent(text + " " + url)}` },
  { name: "Facebook", color: "#1877F2", getUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  { name: "Twitter", color: "#1DA1F2", getUrl: (url: string, text: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}` },
];

export function ShareDialog({ productName, productUrl }: { productName: string; productUrl: string }) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${productUrl}` : productUrl;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <Share2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogTitle>Compartir producto</DialogTitle>
        <p className="text-sm text-muted-foreground truncate">{productName}</p>
        <div className="space-y-2">
          {socialNetworks.map((sn) => (
            <a
              key={sn.name}
              href={sn.getUrl(fullUrl, productName)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: sn.color }}>
                {sn.name[0]}
              </div>
              <span className="font-medium">{sn.name}</span>
            </a>
          ))}
          <button onClick={handleCopy} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors w-full text-left">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </div>
            <span className="font-medium">{copied ? "¡Copiado!" : "Copiar enlace"}</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
