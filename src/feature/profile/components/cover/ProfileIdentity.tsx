"use client";

import { Typography } from "antd";
import { PROFILE } from "../../data/mock";

const { Text } = Typography;

export function ProfileIdentity() {
  return (
    <>
      <Text
        className="!text-[32px] !font-extrabold !leading-tight !text-white"
        style={{ textShadow: "0 2px 12px #00000060" }}
      >
        {PROFILE.name}
      </Text>
      <Text className="!text-[15px]" style={{ color: "#c4b5fd" }}>
        {PROFILE.bio}  ·  {PROFILE.location}
      </Text>
    </>
  );
}
