"use client";

import { SocketProvider } from "@/socket/client/provider";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";

// Silence React 19's "script inside component" warning that next-themes
// triggers when it renders its FOUC-prevention <script>. The script still
// runs correctly during SSR — this warning is cosmetic and dev-only.
if (
  process.env.NODE_ENV !== "production" &&
  typeof window !== "undefined" &&
  !(window as unknown as { __nextThemesWarningPatched?: boolean })
    .__nextThemesWarningPatched
) {
  (
    window as unknown as { __nextThemesWarningPatched?: boolean }
  ).__nextThemesWarningPatched = true;
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    const first = args[0];
    if (
      typeof first === "string" &&
      first.includes("Encountered a script tag while rendering")
    ) {
      return;
    }
    origError(...args);
  };
}

export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider locale={locale}>
        <SocketProvider>{children}</SocketProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
