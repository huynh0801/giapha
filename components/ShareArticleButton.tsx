"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";

interface ShareArticleButtonProps {
  title: string;
  url?: string;
  className?: string;
}

export default function ShareArticleButton({
  title,
  url,
  className = "",
}: ShareArticleButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const targetUrl =
      url || (typeof window !== "undefined" ? window.location.href : "");

    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title,
          url: targetUrl,
        });
        return;
      } catch {
        // Fallback to clipboard if share cancelled/failed
      }
    }

    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-2 rounded-xl border border-[#deb887] bg-[#fffdf8] px-3.5 py-2 text-xs font-black uppercase tracking-wider text-[#800000] shadow-xs transition-all hover:bg-[#f5e7c7] active:scale-95 ${className}`}
      title="Sao chép liên kết chia sẻ cho bà con dòng họ"
    >
      {copied ? (
        <>
          <Check className="size-4 text-emerald-600" />
          <span className="text-emerald-700">Đã chép link!</span>
        </>
      ) : (
        <>
          <Share2 className="size-4 text-[#800000]" />
          <span>Chia sẻ bài viết</span>
        </>
      )}
    </button>
  );
}
