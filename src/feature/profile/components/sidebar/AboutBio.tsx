"use client";

import { Typography } from "antd";

const { Paragraph } = Typography;

const BIO =
  "Designing digital experiences that matter. Passionate about human-centered design, accessibility, and building products that bring people together.";

export function AboutBio() {
  return (
    <Paragraph
      className="!m-0 !w-full"
      style={{
        color: "#8a8a9a",
        fontSize: 14,
        lineHeight: 1.65,
      }}
    >
      {BIO}
    </Paragraph>
  );
}
