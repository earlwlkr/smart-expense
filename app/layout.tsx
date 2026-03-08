import "./globals.css";
import type { Metadata } from "next";

import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Smart Expense",
  description: "Split expenses with friends, track spending, settle up easily.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
