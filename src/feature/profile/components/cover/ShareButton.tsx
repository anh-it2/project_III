"use client";

import { Button, Flex, Typography } from "antd";
import { Icon } from "../Icon";

const { Text } = Typography;

export function ShareButton() {
  return (
    <Button
      type="text"
      className="!h-10 !rounded-3xl !px-6"
      style={{
        background: "#ffffff10",
        border: "1px solid #ffffff20",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <Flex align="center" gap={8}>
        <Icon name="share" size={18} color="#d4d4d8" />
        <Text className="!text-sm !font-medium" style={{ color: "#d4d4d8" }}>
          Share
        </Text>
      </Flex>
    </Button>
  );
}
