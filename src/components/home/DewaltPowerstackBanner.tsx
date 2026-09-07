"use client";

import Link from "next/link";
import Image from "next/image";

interface DewaltPowerstackBannerProps {
  banner?: any;
}

export function DewaltPowerstackBanner({ banner }: DewaltPowerstackBannerProps) {
  const imageUrl = banner?.image?.asset?.url || "/banners/sections/dewalt-powerstack.webp";
  const linkUrl = banner?.link || "/marca/dewalt";

  return (
    <section className="py-2.5 md:py-3 w-full" data-section="Banner DeWalt Powerstack">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-6">
        <Link
          href={linkUrl}
          className="group relative block w-full h-[110px] sm:h-[130px] md:h-[150px] rounded-xl overflow-hidden shadow-md border border-[#222] transition-transform duration-300 hover:scale-[1.005]"
        >
          <img
            src={imageUrl}
            alt="DeWalt Powerstack Kit S/ 2,099.90"
            className="w-full h-full object-cover object-center"
          />
        </Link>
      </div>
    </section>
  );
}
