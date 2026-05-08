"use client";

import { Button, Flex, Typography } from "antd";
import { Icon } from "../Icon";
import { gradientBg } from "../../data/mock";

const { Text } = Typography;

export function EditButton() {
  return (
    <Button
      type="text"
      className="!h-10 !rounded-3xl !border-0 !px-6"
      style={{
        background: gradientBg(["#4096ff", "#a855f7"]),
        boxShadow: "0 2px 12px #4096ff40",
      }}
    >
      <Flex align="center" gap={8}>
        <Icon name="edit" size={18} color="#FFFFFF" />
        <Text className="!text-sm !font-semibold !text-white">Edit Profile</Text>
      </Flex>
    </Button>
  );
}
