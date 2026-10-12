"use client";

import balabala from "../../assets/balabala-new.jpg";
import griordano from "../../assets/giordano-new.png";
import CardsMegaMenu from "./cards-mega-menu";

export default function RetailMegaMenu() {
  return (
    <CardsMegaMenu
      menuKey="retail"
      label="RETAIL"
      title="Retail"
      panelId="retail-mega-panel"
      cards={[
        {
          image: griordano,
          title: "Giordano",
          caption: "BRINGING PREMIUM FASHION",
        },
        {
          image: balabala,
          title: "Bala Bala",
          caption: "GROWING IN STYLE",
        },
      ]}
    />
  );
}
