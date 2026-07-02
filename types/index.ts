import { ReactNode } from "react";

export interface DockItemsType {
  title: string;
  icon: ReactNode;
  href: string;
  socialLink: boolean;
}

export interface AnimatedIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export interface AnimatedIconHandle {
  start: () => void;
  stop: () => void;
}
