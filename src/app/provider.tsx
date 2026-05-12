"use client";

import { SocketProvider } from "@/socket/client/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp, ConfigProvider, theme } from "antd";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";

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

function AntdThemeBridge({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1877f2",
          colorBgContainer: isDark ? "#1f1f1f" : "#ffffff",
          colorBgElevated: isDark ? "#141414" : "#ffffff",
          colorBorder: isDark ? "#2e2e2e" : "#e5e7eb",
          colorText: isDark ? "#ffffff" : "#1a1a2e",
          colorTextPlaceholder: isDark ? "#a1a1aa" : "#9ca3af",
          borderRadius: 10,
        },
      }}
    >
      <AntdApp message={{ maxCount: 3 }} notification={{ placement: "topRight" }}>
        {children}
      </AntdApp>
    </ConfigProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AntdThemeBridge>
          <SocketProvider>{children}</SocketProvider>
        </AntdThemeBridge>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
