"use client";

import { Typography } from "antd";

const { Paragraph } = Typography;

interface PostBodyProps {
  text: string;
  hasImage?: boolean;
}

export function PostBody({ text, hasImage }: PostBodyProps) {
  return (
    <div
      className="w-full"
      style={{ padding: hasImage ? "0 24px 16px 24px" : "0 24px 16px 24px" }}
    >
      <Paragraph
        className="!m-0"
        style={{
          color: "var(--color-text-secondary)",
          fontSize: 15,
          lineHeight: 1.55,
        }}
      >
        {text}
      </Paragraph>
    </div>
  );
}
