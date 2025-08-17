import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Layout from "@/components/layout";
import { ClerkProvider } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { CreditsProvider } from "@/components/credits-context";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"), // TODO: replace with real production origin
  applicationName: "Smart File Manager",
  title: {
    default: "SGBAU Engineering Study Material & Solved Question Papers PDF",
    template: "%s | SGBAU Study Material",
  },
  
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
          <CreditsProvider>
            {/* Global navigation/layout wrapper */}
            <Layout>{children}</Layout>
          </CreditsProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
