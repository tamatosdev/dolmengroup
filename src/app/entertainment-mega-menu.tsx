"use client";

import sindbadWonderland from "../../assets/sindbad-logo-image.jpg";
import CardsMegaMenu from "./cards-mega-menu";

export default function EntertainmentMegaMenu() {
  return (
    <CardsMegaMenu
      menuKey="entertainment"
      label="ENTERTAINMENT"
      title="Entertainment"
      panelId="entertainment-mega-panel"
      cards={[
        {
          image: sindbadWonderland,
          title: "Sindbad's Wonderland",
          caption: "BRINGING FAMILIES TOGETHER",
        },
      ]}
    />
  );
}
