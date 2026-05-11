"use client";

import { Flex } from "antd";
import Image from "next/image";
import { CoverBlobs } from "./CoverBlobs";
import { ProfileCenter } from "./identity/ProfileCenter";
import { useProfileMeta } from "../edit/data/useProfileMeta";
import styles from "./CoverSection.module.scss";

const COVER_GRADIENT =
  "linear-gradient(160deg, #0d0d2b 0%, #1a1045 25%, #1e3a6e 55%, #0f4a8a 80%, #1a6fd1 100%)";

export function CoverSection() {
  const { meta, hydrated } = useProfileMeta();
  const coverUrl = hydrated ? meta.coverUrl : "";
  const hasCover = !!coverUrl;

  return (
    <Flex
      vertical
      justify="end"
      className="!relative !h-[300px] !w-full !shrink-0 !overflow-hidden sm:!h-[360px] md:!h-[400px] lg:!h-[440px]"
      style={{
        background: hasCover ? "#000" : COVER_GRADIENT,
      }}
    >
      {hasCover && (
        <Image
          src={coverUrl}
          alt="cover"
          fill
          unoptimized
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      )}
      {!hasCover && <CoverBlobs />}
      <div
        aria-hidden
        className={`${styles.scrim} !pointer-events-none !absolute !inset-x-0 !bottom-0 !h-[60%]`}
      />
      <ProfileCenter />
    </Flex>
  );
}
