import { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { buildMetadata } from "@/seo/metadata";

export const metadata: Metadata = buildMetadata({ path: "/" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="rb-app">
          <SiteHeader />
          <div className="rb-page">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
