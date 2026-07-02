import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  Home,
  Layers,
  Code2,
  BookOpen,
  Twitter,
  Github,
  Linkedin,
} from "lucide-react";
import { DockItemsType } from "@/types";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const items: DockItemsType[] = [
  {
    title: "Home",
    icon: <Home />,
    socialLink: false,
    href: "/",
  },
  {
    title: "Projects",
    icon: <Layers />,
    socialLink: false,
    href: "/projects",
  },
  {
    title: "Work",
    icon: <Code2 />,
    socialLink: false,
    href: "/work",
  },
  {
    title: "Blog",
    icon: <BookOpen />,
    socialLink: false,
    href: "/blog",
  },
  {
    title: "Twitter",
    icon: <Twitter />,
    socialLink: true,
    href: "https://x.com/softaspause",
  },
  {
    title: "Github",
    icon: <Github />,
    socialLink: true,
    href: "https://github.com/aashu2006",
  },
  {
    title: "LinkedIn",
    icon: <Linkedin />,
    socialLink: true,
    href: "https://linkedin.com/in/akshatpatil107",
  },
];

export const metadata: Metadata = {
  title: "akshat",
  description:
    "a 19 year old CS undergrad, currently learning LLMs to become an AI engineer. Processing Foundation Micrograntee '26.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lora.variable} font-sans antialiased bg-background text-foreground`}
      >
        <main className="max-w-3xl mx-auto min-h-screen px-3 md:px-4 py-8 md:py-10 flex flex-col gap-3">
          {children}
        </main>
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden md:block">
          <FloatingDock items={items} />
        </div>
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
          <FloatingDock items={items} />
        </div>
      </body>
    </html>
  );
}
