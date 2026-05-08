"use client";

import { Avatar } from "antd";
import { Icon } from "../Icon";
import { gradientBg } from "../../utils/gradient";

interface PostAvatarProps {
  size?: number;
  gradient?: [string, string];
  initial?: string;
  bg?: string;
  iconColor?: string;
}

export function PostAvatar({
  size = 44,
  gradient,
  initial,
  bg = "#1f1f1f",
  iconColor = "#FFFFFF",
}: PostAvatarProps) {
  const background = gradient ? gradientBg([...gradient]) : bg;
  if (initial) {
    return (
      <Avatar
        size={size}
        style={{
          background,
          color: iconColor,
          fontWeight: 700,
          fontSize: Math.round(size * 0.4),
          flexShrink: 0,
        }}
      >
        {initial}
      </Avatar>
    );
  }
  return (
    <Avatar
      size={size}
      icon={<Icon name="person" size={Math.round(size * 0.55)} color={iconColor} />}
      style={{ background, flexShrink: 0 }}
    />
  );
}
