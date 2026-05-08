"use client";

import { Avatar } from "antd";
import { Icon } from "../Icon";
import { gradientBg } from "../../data/mock";

interface PostAvatarProps {
  size?: number;
  gradient?: [string, string];
  bg?: string;
  iconColor?: string;
}

export function PostAvatar({
  size = 44,
  gradient,
  bg = "#1f1f1f",
  iconColor = "#FFFFFF",
}: PostAvatarProps) {
  return (
    <Avatar
      size={size}
      icon={<Icon name="person" size={Math.round(size * 0.55)} color={iconColor} />}
      style={{
        background: gradient ? gradientBg([...gradient]) : bg,
        flexShrink: 0,
      }}
    />
  );
}
