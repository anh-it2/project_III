"use client";

import { Flex, Typography } from "antd";
import { Icon } from "../Icon";
import type { Post } from "../../data/mock";
import { PostAvatar } from "./PostAvatar";

const { Text } = Typography;

interface PostHeaderProps {
  post: Post;
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <Flex
      align="center"
      justify="space-between"
      gap={12}
      className="!w-full"
      style={{ padding: "20px 24px" }}
    >
      <Flex align="center" gap={12}>
        <PostAvatar
          size={44}
          gradient={post.author.gradient}
          iconColor={post.author.gradient ? "#FFFFFF" : "#71717a"}
        />
        <Flex vertical gap={2}>
          {post.coAuthor ? (
            <Flex align="center" gap={6}>
              <Text className="!text-[15px] !font-semibold" style={{ color: "#f0f0f0" }}>
                {post.author.name}
              </Text>
              <Icon name="arrow_right" size={18} color="#71717a" />
              <Text className="!text-[15px] !font-semibold" style={{ color: "#f0f0f0" }}>
                {post.coAuthor.name}
              </Text>
            </Flex>
          ) : (
            <Text className="!text-[15px] !font-semibold" style={{ color: "#f0f0f0" }}>
              {post.author.name}
            </Text>
          )}
          <Text className="!text-xs" style={{ color: "#71717a" }}>
            {post.time}
          </Text>
        </Flex>
      </Flex>
      <Icon name="more_horiz" size={20} color="#71717a" />
    </Flex>
  );
}
