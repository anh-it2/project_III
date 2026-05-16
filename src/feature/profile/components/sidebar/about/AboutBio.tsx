"use client";

import { Typography } from "antd";

const { Paragraph } = Typography;

export function AboutBio({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <Paragraph
      className="!m-0 !w-full"
      style={{
        color: "#8a8a9a",
        fontSize: 14,
        lineHeight: 1.65,
      }}
    >
      {text}
    </Paragraph>
  );
}
