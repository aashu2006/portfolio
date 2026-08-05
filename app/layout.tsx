import type { Metadata } from "next";
import { Quicksand, Archivo } from "next/font/google";
import "./globals.css";

/** Body copy: rounded geometric sans. */
const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

/** Display face for h1/h2/h3 and buttons: tight retro grotesque. */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://akshatpatil.vercel.app"),
  title: "akshat patil",
  description:
    "19, CS undergrad in Bengaluru, currently learning LLMs to become an AI engineer. Processing Foundation Micrograntee '26, building things, contributing to open source.",
  openGraph: {
    title: "akshat patil",
    description:
      "19, CS undergrad in Bengaluru, currently learning LLMs to become an AI engineer. Processing Foundation Micrograntee '26.",
    url: "https://akshatpatil.vercel.app",
    siteName: "akshat patil",
    images: [
      {
        url: "/akshat.jpg",
        width: 800,
        height: 800,
        alt: "Akshat Patil",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "akshat patil",
    description:
      "19, CS undergrad in Bengaluru, currently learning LLMs to become an AI engineer. Processing Foundation Micrograntee '26.",
    images: ["/akshat.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${archivo.variable}`}>
        {children}
      </body>
    </html>
  );
}
