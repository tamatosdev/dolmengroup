"use client";

import { Lenis } from "lenis/react";
import type { ReactNode } from "react";

type SmoothScrollProps = {
  children: ReactNode;
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <Lenis root options={{ anchors: true }}>
      {children}
    </Lenis>
  );
}
