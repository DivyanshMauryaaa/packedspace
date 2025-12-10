import type { Metadata } from "next";
import { Roboto_Slab, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Packedspace cloud",
  description: "Accelarate your team's productivity with packedspace cloud.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${robotoSlab.variable} ${robotoMono.variable} antialiased font-sans`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex justify-between items-center mb-8 border-b pb-4 p-4 dark:border-zinc-800">
              <div className="flex items-center gap-4">
                <p className="text-2xl font-bold">Packedspace</p>
                <OrganizationSwitcher />
              </div>
              <div className="flex items-center gap-2">
                <ModeToggle />
                <UserButton />
              </div>
            </div>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
