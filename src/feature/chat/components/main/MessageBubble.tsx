"use client";

import { Flex, Typography } from "antd";
import { Avatar } from "../Avatar";

const { Text } = Typography;

interface MessageBubbleProps {
  content: string;
  mine: boolean;
  senderName: string;
  senderSeed?: string;
  showAvatar?: boolean;
}

const BUBBLE_BASE = "px-4 py-3 max-w-[70%]";

export function MessageBubble({
  content,
  mine,
  senderName,
  senderSeed,
  showAvatar = true,
}: MessageBubbleProps) {
  if (mine) {
    return (
      <Flex justify="end" className="w-full">
        <div
          className={
            BUBBLE_BASE +
            " rounded-[20px] rounded-br-[6px] text-white shadow-sm"
          }
          style={{
            background:
              "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary))",
          }}
        >
          <Text className="!text-[14px] !leading-[1.5] !text-white">
            {content}
          </Text>
        </div>
      </Flex>
    );
  }

  return (
    <Flex justify="start" align="end" gap={8} className="w-full">
      {showAvatar ? (
        <Avatar name={senderName} seed={senderSeed ?? senderName} size={32} />
      ) : (
        <span className="w-8 shrink-0" />
      )}
      <div
        className={
          BUBBLE_BASE +
          " rounded-[20px] rounded-bl-[6px] border border-[var(--color-border)] bg-white dark:bg-[#1f1f1f]"
        }
      >
        <Text className="!text-[14px] !leading-[1.5] !text-[var(--color-text)]">
          {content}
        </Text>
      </div>
    </Flex>
  );
}
