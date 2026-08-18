import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iTools CMS Studio",
  robots: "noindex, nofollow",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[9999]" style={{ height: "100dvh" }}>
      {children}
    </div>
  );
}