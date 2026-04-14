import type { ReactNode } from "react";

// Since all routes are under [locale], the locale layout
// provides the html/body tags with the correct lang attribute.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
