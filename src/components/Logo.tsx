"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

interface LogoProps {
  /** Size in pixels (applies to icon height/width). Default is 36. */
  size?: number;
  /** Whether to show the "XIMATO" text next to the icon. Default is true. */
  showText?: boolean;
  /** If true, wraps in a link to "/" */
  asLink?: boolean;
  className?: string;
  textClassName?: string;
}

/**
 * Ximato Brand Icon SVG.
 * Features the signature strawberry/pin gradient with green leaves and
 * the courier scooter silhouette with speed motion lines.
 */
export function XimatoIcon({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 drop-shadow-sm", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ximatoIconPinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFA115" />
          <stop offset="25%" stopColor="#F8671C" />
          <stop offset="70%" stopColor="#E22424" />
          <stop offset="100%" stopColor="#B3121F" />
        </linearGradient>

        <linearGradient id="ximatoIconLeafGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#388E3C" />
          <stop offset="100%" stopColor="#66BB6A" />
        </linearGradient>

        <linearGradient id="ximatoIconHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.35} />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Top Leaves */}
      <g id="icon-leaves">
        <path
          d="M 100 56 C 85 44 78 38 70 44 C 76 54 88 60 100 56 Z"
          fill="url(#ximatoIconLeafGrad)"
        />
        <path
          d="M 118 54 C 122 36 134 26 142 20 C 136 36 128 48 118 54 Z"
          fill="url(#ximatoIconLeafGrad)"
        />
        <path
          d="M 112 55 C 104 34 94 28 88 31 C 94 44 104 52 112 55 Z"
          fill="url(#ximatoIconLeafGrad)"
        />
        <path
          d="M 126 56 C 138 42 148 40 154 46 C 146 54 136 58 126 56 Z"
          fill="url(#ximatoIconLeafGrad)"
        />
      </g>

      {/* Pin Body */}
      <g id="icon-pin">
        <path
          d="M 120 48 C 160 48 190 78 190 118 C 190 154 138 200 120 214 C 102 200 50 154 50 118 C 50 78 80 48 120 48 Z"
          fill="url(#ximatoIconPinGrad)"
        />
        <path
          d="M 120 52 C 154 52 182 78 184 112 C 172 74 142 58 120 58 C 98 58 68 74 56 112 C 58 78 86 52 120 52 Z"
          fill="url(#ximatoIconHighlight)"
        />
      </g>

      {/* Courier on Scooter (Silhouette) */}
      <g
        id="icon-silhouette"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Motion lines */}
        <line x1="38" y1="104" x2="66" y2="104" strokeWidth={4.5} />
        <line x1="28" y1="116" x2="68" y2="116" strokeWidth={4.5} />
        <line x1="36" y1="128" x2="62" y2="128" strokeWidth={4.5} />

        {/* Box */}
        <rect x="72" y="96" width="22" height="26" rx="4" fill="#FFFFFF" stroke="none" />

        {/* Head with visor */}
        <circle cx="122" cy="86" r="8.5" fill="#FFFFFF" stroke="none" />
        <path d="M 122 82 Q 132 82 136 85 L 128 87 Z" fill="#FFFFFF" stroke="none" />

        {/* Body & Arms */}
        <path
          d="M 112 96 C 118 95 126 98 128 108 L 120 130 L 108 130"
          fill="none"
          strokeWidth={6.5}
        />
        <path d="M 122 101 L 138 108 L 140 118" fill="none" strokeWidth={5} />

        {/* Handlebars / Steering column */}
        <path
          d="M 142 106 L 136 121 L 146 142 L 158 142"
          fill="none"
          strokeWidth={5.5}
        />

        {/* Footboard & seat frame */}
        <path
          d="M 94 122 L 115 122 L 122 139 L 146 139"
          fill="none"
          strokeWidth={5.5}
        />

        {/* Wheels */}
        <circle cx="94" cy="148" r="11" fill="none" strokeWidth={5.5} />
        <circle cx="154" cy="148" r="11" fill="none" strokeWidth={5.5} />

        {/* Mudguards */}
        <path d="M 83 144 C 84 134 102 134 105 144" fill="none" strokeWidth={4} />
        <path d="M 143 144 C 144 134 162 134 165 144" fill="none" strokeWidth={4} />
      </g>
    </svg>
  );
}

/**
 * Full Ximato Logo Component (Icon + Bold Wordmark).
 */
export default function Logo({
  size = 38,
  showText = true,
  asLink = true,
  className,
  textClassName,
}: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <XimatoIcon size={size} />
      {showText && (
        <span
          className={cn(
            "font-extrabold tracking-tight text-[#B71C1C]",
            textClassName || "text-2xl font-display",
          )}
          style={{ letterSpacing: "-0.01em" }}
        >
          XIMATO
        </span>
      )}
    </span>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-flex items-center transition opacity-95 hover:opacity-100">
        {content}
      </Link>
    );
  }

  return content;
}
