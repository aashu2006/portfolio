import type { Metadata } from "next";
import { Quicksand, Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";

/** Body copy: rounded geometric sans. */
const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

/** Display face for h2/h3 and buttons: tight retro grotesque. */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

/**
 * The masthead alone. This is the face samworks.vercel.app actually builds its
 * look on, applied to every heading there. Ships one weight because that is
 * all the family has.
 */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
  display: "swap",
});

/**
 * Resolves the theme before first paint. The stylesheet already honours
 * prefers-color-scheme on its own, so this only matters for a visitor who
 * picked a theme that disagrees with their OS: without it they get one frame
 * of the wrong palette. Kept inline and tiny for that reason.
 */
const themeScript = `try{var d=document.documentElement,t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.dataset.theme=t}catch(e){}`;

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
        // Must match the file on disk. These are the dimensions social
        // platforms crop and lay the preview out from, so a wrong ratio here
        // distorts the card even when the image itself is fine. Re-measure
        // whenever the file is replaced.
        width: 1024,
        height: 771,
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
    // The theme script writes data-theme onto this element before React
    // hydrates, which is a deliberate server/client difference.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${quicksand.variable} ${archivo.variable} ${instrumentSerif.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
