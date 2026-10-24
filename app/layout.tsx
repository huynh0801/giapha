import VisitTracker from "@/components/VisitTracker";
import PwaRegister from "@/components/PwaRegister";
import localFont from "next/font/local";
import { Be_Vietnam_Pro } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

const studioBrush = localFont({
  src: "../public/fonts/SVN-Studio-Brush.woff2",
  variable: "--font-studio-brush",
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  themeColor: "#8c1d1d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  title: {
    default: "GIA PHẢ DÒNG HỌ",
    template: "%s | Gia Phả Dòng Họ",
  },
  description: "Gìn giữ và lưu truyền giá trị cội nguồn, gắn kết các thế hệ dòng họ Việt Nam.",
  applicationName: "Gia Phả Dòng Họ",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gia Phả",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/landing/logo.png", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/images/landing/logo.png", type: "image/png" },
    ],
  },
  openGraph: {
    title: "GIA PHẢ DÒNG HỌ",
    description: "Gìn giữ và lưu truyền giá trị cội nguồn, gắn kết các thế hệ dòng họ.",
    url: "/",
    siteName: "Gia Phả Dòng Họ",
    images: [
      {
        url: "/images/landing/logo.png",
        width: 305,
        height: 393,
        alt: "Logo Gia Phả Dòng Họ",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "GIA PHẢ DÒNG HỌ",
    description: "Gìn giữ và lưu truyền giá trị cội nguồn",
    images: ["/images/landing/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${studioBrush.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
      </head>
      <body className="antialiased font-sans">
        <div className="flex min-h-screen flex-col">
          <VisitTracker />
          <PwaRegister />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
