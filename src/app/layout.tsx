import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons'

library.add(fas, faTwitter, faFontAwesome,)

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agni.",
  description: "App to manage money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
