"use client";

import aboutCard from "../../assets/mega menu images/About.jpg";
import CardsMegaMenu from "./cards-mega-menu";

export default function OurGroupMegaMenu() {
  return (
    <CardsMegaMenu
      menuKey="group"
      label="OUR GROUP"
      title="Our Group"
      panelId="our-group-mega-panel"
      cards={[
        {
          image: aboutCard,
          title: "About",
          caption: "DISCOVER OUR STORY AND VALUES",
          href: "#about",
        },
      ]}
    />
  );
}
