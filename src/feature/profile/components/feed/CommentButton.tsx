"use client";

import { Button, Typography } from "antd";
import { Icon } from "../Icon";

const { Text } = Typography;

interface CommentButtonProps {
  onClick: () => void;
}

export function CommentButton({ onClick }: CommentButtonProps) {
  return (
    <Button
      type="text"
      onClick={onClick}
      className="!flex !h-auto !items-center !gap-2 !rounded-lg !px-4 !py-2.5"
    >
      <Icon name="mode_comment" size={20} color="#a1a1aa" />
      <Text className="!text-sm !font-medium" style={{ color: "#a1a1aa" }}>
        Comment
      </Text>
    </Button>
  );
}
