"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

/**
 * Click-to-load YouTube player. Nothing from YouTube loads (and no cookies
 * are set) until the visitor presses play; then it uses youtube-nocookie.
 */
export function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const t = useTranslations("video");
  const [play, setPlay] = useState(false);

  if (!id) return null;

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-[20px] bg-primary shadow-e3">
        {play ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full focus-visible:outline-offset-4">
            <Image
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover opacity-80 transition-opacity group-hover:opacity-95"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-primary shadow-cw-modal transition-transform group-hover:scale-105 motion-reduce:group-hover:scale-100">
                <svg aria-hidden width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
            <span className="sr-only">{t("play", { title })}</span>
          </button>
        )}
      </div>
      {!play && <p className="mt-3 text-sm opacity-80">{t("notice")}</p>}
    </div>
  );
}
