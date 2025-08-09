import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Layout from "@/components/layout";
import { ClerkProvider } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"), // TODO: replace with real production origin
  applicationName: "Smart File Manager",
  title: {
    default: "SGBAU Engineering Study Material & Solved Question Papers PDF",
    template: "%s | SGBAU Study Material",
  },
  description:
    "SGBAU engineering study material: semester-wise notes, previous year solved question papers, PDFs & exam prep resources for Sant Gadge Baba Amravati University.",
  keywords: [
    // Core domain
    "SGBAU",
    "Sant Gadge Baba Amravati University",
    "SGBAU engineering",
    "engineering study material",
    "engineering notes",
    "BTech notes",
    "B.E. notes",
    "previous year question papers",
    "SGBAU question papers",
    "SGBAU solved papers",
    "solved question papers",
    "semester wise solutions",
    "exam preparation",
    "study material PDF",
    "download notes",
    "Deva Dwivedi",
    // Platform capabilities
    "file manager",
    "cloud storage",
    "secure file sharing",
    "online file organizer",
    "document management",
    // Tech (long‑tail support, optional)
    "Supabase",
    "Next.js",
  ],
  authors: [{ name: "Smart File Manager Team" }],
  creator: "Smart File Manager Team",
  publisher: "Smart File Manager",
  generator: "Next.js + Clerk + Supabase",
  category: "productivity",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://example.com/",
    siteName: "Smart File Manager",
    title: "SGBAU Engineering Study Material & Solved Question Papers PDF",
    description:
      "SGBAU notes, previous year solved papers & exam prep PDFs for Sant Gadge Baba Amravati University engineering students.",
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Smart File Manager interface preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@YourHandle", // TODO: replace
    creator: "@YourHandle", // TODO: replace
    title: "SGBAU Engineering Study Material & Solved Question Papers PDF",
    description:
      "SGBAU notes, solved question papers & exam prep PDFs (engineering semesters).",
    images: [
      {
        url: "/placeholder.jpg",
        alt: "Smart File Manager interface preview",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  referrer: "strict-origin-when-cross-origin",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: [
      { url: "/placeholder-logo.png", type: "image/png" },
      { url: "/placeholder-logo.svg", type: "image/svg+xml" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark, // or neobrutalism
        variables: {
          colorPrimary: "#7c3aed",
          colorText: "#fff",
          colorInputBackground: "rgba(30,41,59,0.6)",
          colorInputText: "#f1f5f9",
          colorDanger: "#ef4444",
        },
      }}
    >
      <html lang="en">
        <head>
          <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        </head>
        <body>
          {/* Global navigation/layout wrapper */}
          <Layout>{children}</Layout>
        </body>
      </html>
    </ClerkProvider>
  );
}
