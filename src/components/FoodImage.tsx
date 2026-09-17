"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { cn } from "@/lib/cn";

interface FoodImageProps {
  src: string | null | undefined;
  alt: string;
  emoji?: string;
  className?: string;
  emojiClassName?: string;
}

/**
 * Food photo with a graceful gradient + emoji fallback when the URL is
 * missing or fails to load (e.g. a temporarily unavailable stock photo).
 */
export default function FoodImage({
  src,
  alt,
  emoji = "🍽️",
  className,
  emojiClassName,
}: FoodImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-linear-to-br from-orange-100 via-amber-50 to-rose-100",
          className,
        )}
      >
        <span className={cn("text-5xl drop-shadow-sm", emojiClassName)}>
          {emoji}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
