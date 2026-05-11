"use client";

import { Button, Flex } from "antd";

interface AboutEditFooterProps {
  onCancel: () => void;
}

export function AboutEditFooter({ onCancel }: AboutEditFooterProps) {
  return (
    <Flex justify="end" gap={8} className="!mt-5">
      <Button
        onClick={onCancel}
        style={{
          background: "var(--color-bg-tertiary)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text)",
        }}
      >
        Cancel
      </Button>
      <Button type="primary" htmlType="submit" style={{ fontWeight: 600 }}>
        Save
      </Button>
    </Flex>
  );
}
