import Link from "next/link";
import { trendingTags } from "@/app/data/mock";

export function TrendingTags() {
  return (
    <div className="bg-gray-50 border-b border-gray-200 py-2.5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {trendingTags.map((tag) => (
            <Link
              key={tag}
              href="#"
              className="shrink-0 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-medium text-gray-700 hover:border-[#D1001C] hover:text-[#D1001C] transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}