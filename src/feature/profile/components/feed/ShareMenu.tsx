"use client";

import { Button, Dropdown, Typography, message } from "antd";
import type { MenuProps } from "antd";
import { Icon } from "../Icon";

const { Text } = Typography;

interface ShareMenuProps {
  postId: string;
  onShared: () => void;
}

export function ShareMenu({ postId, onShared }: ShareMenuProps) {
  const [api, contextHolder] = message.useMessage();

  function handleAction(action: string) {
    if (action === "copy") {
      const url = `${window.location.origin}/posts/${postId}`;
      void navigator.clipboard.writeText(url);
      api.success("Link copied");
    } else {
      api.success(`Shared via ${action}`);
    }
    onShared();
  }

  const items: MenuProps["items"] = [
    {
      key: "now",
      label: "Share now (Public)",
      icon: <Icon name="public" size={16} color="#a1a1aa" />,
      onClick: () => handleAction("now"),
    },
    {
      key: "feed",
      label: "Share to feed",
      icon: <Icon name="post_add" size={16} color="#a1a1aa" />,
      onClick: () => handleAction("feed"),
    },
    {
      key: "messenger",
      label: "Send in Messenger",
      icon: <Icon name="chat_bubble" size={16} color="#a1a1aa" />,
      onClick: () => handleAction("messenger"),
    },
    {
      key: "story",
      label: "Share to your story",
      icon: <Icon name="auto_stories" size={16} color="#a1a1aa" />,
      onClick: () => handleAction("story"),
    },
    { type: "divider" },
    {
      key: "copy",
      label: "Copy link",
      icon: <Icon name="link" size={16} color="#a1a1aa" />,
      onClick: () => handleAction("copy"),
    },
  ];

  return (
    <>
      {contextHolder}
      <Dropdown menu={{ items }} trigger={["click"]} placement="topRight">
        <Button
          type="text"
          className="!flex !h-auto !items-center !gap-2 !rounded-lg !px-4 !py-2.5"
        >
          <Icon name="share" size={20} color="#a1a1aa" />
          <Text className="!text-sm !font-medium" style={{ color: "#a1a1aa" }}>
            Share
          </Text>
        </Button>
      </Dropdown>
    </>
  );
}
