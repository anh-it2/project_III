"use client";

import { Button, Flex, Input } from "antd";
import { useState } from "react";
import { Icon } from "../../Icon";
import { PostAvatar } from "../PostAvatar";

interface CommentInputProps {
  onSubmit: (text: string) => void;
}

export function CommentInput({ onSubmit }: CommentInputProps) {
  const [value, setValue] = useState("");

  function handleSend() {
    const text = value.trim();
    if (!text) return;
    onSubmit(text);
    setValue("");
  }

  return (
    <Flex gap={8} className="!w-full">
      <PostAvatar size={32} gradient={["#4096ff", "#a855f7"]} />
      <Flex
        align="center"
        gap={8}
        className="!flex-1"
        style={{
          background: "#1f1f1f",
          borderRadius: 18,
          padding: "0 8px 0 16px",
          minHeight: 36,
        }}
      >
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onPressEnter={handleSend}
          placeholder="Write a comment..."
          variant="borderless"
          className="!flex-1 !p-0 !text-sm"
          style={{ background: "transparent", color: "#f0f0f0" }}
        />
        <Button
          type="text"
          size="small"
          onClick={handleSend}
          disabled={!value.trim()}
          className="!flex !h-7 !w-7 !items-center !justify-center !p-0"
          aria-label="Send"
        >
          <Icon
            name="send"
            size={18}
            color={value.trim() ? "#4096ff" : "#71717a"}
          />
        </Button>
      </Flex>
    </Flex>
  );
}
