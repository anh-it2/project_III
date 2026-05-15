"use client";

import { Avatar } from "../../../Avatar";

interface MessageAvatarProps {
  /** false → render a fixed-width spacer (keeps stacked bubbles aligned) */
  show: boolean;
  name: string;
  seed?: string;
}

export function MessageAvatar({ show, name, seed }: MessageAvatarProps) {
  if (!show) return <span className="w-8 shrink-0" />;
  return <Avatar name={name} seed={seed ?? name} size={32} />;
}
