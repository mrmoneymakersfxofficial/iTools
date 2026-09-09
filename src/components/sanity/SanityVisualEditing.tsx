"use client";

import { useEffect, useState } from "react";
import { VisualEditing } from "@sanity/visual-editing/react";

export function SanityVisualEditing() {
  return <VisualEditing />;
}

export function VisualEditingWrapper({ isDraft }: { isDraft: boolean }) {
  const [inIframe, setInIframe] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.self !== window.top) {
      setInIframe(true);
    }
  }, []);

  if (!isDraft && !inIframe) {
    return null;
  }

  return <VisualEditing />;
}