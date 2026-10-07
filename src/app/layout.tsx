import { Archivo_Black, Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { DemoStoreProvider } from "@/lib/store";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

// CUSTOMIZE: branding — document title and description
export const metadata = {
  title: "Venture Capital Internal Pipeline",
  description: "Open-source venture capital pipeline — discover, diligence, decide, support (demo)",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full bg-paper font-sans text-ink">
        <DemoStoreProvider>
          <AppShell>{children}</AppShell>
        </DemoStoreProvider>
      </body>
    </html>
  );
}
