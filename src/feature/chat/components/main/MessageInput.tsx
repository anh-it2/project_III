"use client";

import {
  AudioOutlined,
  PictureOutlined,
  PlusOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Button, Flex, Input } from "antd";
import { useState } from "react";

interface MessageInputProps {
  recipientName: string;
  onSend: (text: string) => void | Promise<void>;
  disabled?: boolean;
}

const PILL_BTN =
  "!h-10 !w-10 !rounded-full !bg-[#f0f2f5] !text-[var(--color-primary)] hover:!bg-[#e4e6eb] dark:!bg-[#1f1f1f] dark:hover:!bg-[#262626]";

export function MessageInput({
  recipientName,
  onSend,
  disabled = false,
}: MessageInputProps) {
  const [draft, setDraft] = useState("");
  const trimmed = draft.trim();

  async function handleSend() {
    if (!trimmed) return;
    await onSend(trimmed);
    setDraft("");
  }

  return (
    <div className="flex h-20 items-center gap-3 border-t border-[var(--color-border)] bg-white px-6 dark:bg-[#141414]">
      <Flex align="center" gap={6}>
        <Button type="text" icon={<PlusOutlined />} className={PILL_BTN} />
        <Button type="text" icon={<PictureOutlined />} className={PILL_BTN} />
        <Button
          type="text"
          className={PILL_BTN + " !text-[11px] !font-bold"}
        >
          GIF
        </Button>
      </Flex>
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onPressEnter={handleSend}
        placeholder={`Message ${recipientName}`}
        disabled={disabled}
        suffix={
          <Flex align="center" gap={6}>
            <Button
              type="text"
              size="small"
              icon={<SmileOutlined />}
              className="!text-[var(--color-primary)]"
            />
            <Button
              type="text"
              size="small"
              icon={<AudioOutlined />}
              className="!text-[var(--color-primary)]"
            />
          </Flex>
        }
        className="!h-11 !flex-1 !rounded-[22px] !border-0 !bg-[#f0f2f5] !px-4 dark:!bg-[#1f1f1f] [&_input]:!bg-transparent [&_input]:!text-[15px]"
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleSend}
        disabled={!trimmed || disabled}
        className="!h-11 !w-11 !rounded-full !border-0"
        style={{
          background:
            "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary))",
        }}
      />
    </div>
  );
}
