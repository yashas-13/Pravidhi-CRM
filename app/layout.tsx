import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Pravidh CRM",
  description: "Sales and outreach operations for Pravidh Solutions"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}