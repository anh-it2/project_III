"use client";

import { Flex } from "antd";
import { useProfileView } from "../../../context/ProfileViewContext";
import { EditButton } from "./EditButton";
import { FriendActionButton } from "./FriendActionButton";
import { ShareButton } from "./ShareButton";
import { MoreButton } from "./MoreButton";

export function ProfileActions() {
  const view = useProfileView();

  return (
    <Flex align="center" justify="center" wrap gap={8} className="md:!gap-3">
      {view.isSelf ? (
        <EditButton />
      ) : (
        <FriendActionButton userId={view.personId!} />
      )}
      <ShareButton />
      <MoreButton />
    </Flex>
  );
}
