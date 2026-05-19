"use client";

import { App, Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import {
  useFriendActions,
  useFriendStatus,
} from "@/feature/friends/hooks/useFriends";
import { COVER_GLASS, COVER_GLASS_FG, COVER_GLASS_PRIMARY } from "./coverGlass";

const { Text } = Typography;

interface FriendActionButtonProps {
  /** The profile owner's user id. */
  userId: string;
}

// Same pill geometry as Message/Share so the cover action row reads as one
// group; the glass variant (secondary vs brand-tinted primary) is appended.
const pill = "!h-9 !rounded-3xl !px-4 md:!h-10 md:!px-6";
const glass = `${COVER_GLASS} ${pill}`;
const glassPrimary = `${COVER_GLASS_PRIMARY} ${pill}`;

/**
 * Friend relationship control for a profile header. Driven entirely by
 * FriendsService via hooks, so it works against the mock today and a real
 * backend later with zero changes here. Uses the shared cover frosted-glass
 * pills (clone-style §1) so it matches Message/Share/More exactly.
 */
export function FriendActionButton({ userId }: FriendActionButtonProps) {
  const t = useTranslations("Friends");
  const { message } = App.useApp();
  const status = useFriendStatus(userId);
  const {
    busy,
    sendRequest,
    cancelRequest,
    acceptRequest,
    rejectRequest,
    unfriend,
  } = useFriendActions();

  if (status === "incoming") {
    return (
      <Flex align="center" gap={8}>
        <Button
          type="text"
          disabled={busy}
          onClick={async () => {
            await acceptRequest(userId);
            message.success(t("section.requestAccepted"));
          }}
          className={glassPrimary}
        >
          <Flex align="center" gap={8}>
            <Icon name="how_to_reg" size={18} color={COVER_GLASS_FG} />
            <Text className="!text-sm !font-semibold !text-[var(--cover-glass-fg)]">
              {t("action.confirm")}
            </Text>
          </Flex>
        </Button>
        <Button
          type="text"
          disabled={busy}
          onClick={async () => {
            await rejectRequest(userId);
            message.info(t("section.requestDeleted"));
          }}
          className={glass}
        >
          <Text className="!text-sm !font-semibold !text-[var(--cover-glass-fg)]">
            {t("action.delete")}
          </Text>
        </Button>
      </Flex>
    );
  }

  if (status === "friends") {
    return (
      <Button
        type="text"
        disabled={busy}
        onClick={async () => {
          await unfriend(userId);
          message.info(t("section.removed"));
        }}
        className={glass}
      >
        <Flex align="center" gap={8}>
          <Icon name="group" size={18} color={COVER_GLASS_FG} />
          <Text className="!text-sm !font-semibold !text-[var(--cover-glass-fg)]">
            {t("action.friends")}
          </Text>
        </Flex>
      </Button>
    );
  }

  if (status === "requested") {
    return (
      <Button
        type="text"
        disabled={busy}
        onClick={async () => {
          await cancelRequest(userId);
          message.info(t("section.requestDeleted"));
        }}
        className={glass}
      >
        <Flex align="center" gap={8}>
          <Icon name="schedule" size={18} color={COVER_GLASS_FG} />
          <Text className="!text-sm !font-semibold !text-[var(--cover-glass-fg)]">
            {t("action.requested")}
          </Text>
        </Flex>
      </Button>
    );
  }

  return (
    <Button
      type="text"
      disabled={busy}
      onClick={async () => {
        await sendRequest(userId);
        message.success(t("section.added"));
      }}
      className={glassPrimary}
    >
      <Flex align="center" gap={8}>
        <Icon name="person_add" size={18} color={COVER_GLASS_FG} />
        <Text className="!text-sm !font-semibold !text-[var(--cover-glass-fg)]">
          {t("action.addFriend")}
        </Text>
      </Flex>
    </Button>
  );
}
