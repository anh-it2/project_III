"use client";

import { ABOUT_ITEMS } from "../../data/mock";
import { AboutBio } from "./AboutBio";
import { AboutDivider } from "./AboutDivider";
import { AboutHeader } from "./AboutHeader";
import { AboutItem } from "./AboutItem";
import { CardWrapper } from "./CardWrapper";

export function AboutCard() {
  return (
    <CardWrapper>
      <AboutHeader />
      <AboutBio />
      <AboutDivider />
      {ABOUT_ITEMS.map((item) => (
        <AboutItem key={item.id} item={item} />
      ))}
    </CardWrapper>
  );
}
