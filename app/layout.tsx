import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "発掘Mate | 遺跡発掘の求人・学習プラットフォーム",
  description: "世界中の遺跡発掘求人を探せる、学べるプラットフォーム。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get user's font size preference
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let fontSizeClass = 'font-medium'; // Default

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('font_size')
      .eq('id', user.id)
      .single();

    if (profile?.font_size) {
      fontSizeClass = `font-${profile.font_size}`;
    }
  }

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fontSizeClass} antialiased min-h-screen bg-[#fdfaf4] text-[#333]`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
