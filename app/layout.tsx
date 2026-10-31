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
    process.env.NEXT_PUBLIC_SITE_URL || "https://giaphaquangbinh.io.vn"
  ),
  title: {
    default: "GIA PHẢ DÒNG HỌ",
    template: "%s | Gia Phả Dòng Họ",
  },
  description:
    "Gìn giữ và lưu truyền giá trị cội nguồn, gắn kết các thế hệ dòng họ Việt Nam.",
  keywords: [
    "gia phả",
    "gia phả dòng họ",
    "phả hệ",
    "cây gia phả",
    "gia phả trực tuyến",
    "tra cứu gia phả",
    "lịch sử dòng họ",
    "nhà thờ tổ",
    "giỗ tổ",
    "tộc ước",
    "văn khấn",
    "kết nối dòng họ",
    "gia phả việt nam",
  ],
  authors: [
    {
      name: "Ban Biên Tập Gia Phả Dòng Họ",
      url: "https://giaphaquangbinh.io.vn",
    },
  ],
  creator: "Gia Phả Dòng Họ",
  publisher: "Gia Phả Dòng Họ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    title: "GIA PHẢ DÒNG HỌ - Gìn giữ & Lưu truyền Cội Nguồn",
    description:
      "Gìn giữ và lưu truyền giá trị cội nguồn, gắn kết các thế hệ dòng họ Việt Nam.",
    url: "/",
    siteName: "Gia Phả Dòng Họ",
    images: [
      {
        url: "/images/landing/hero-banner.webp",
        width: 2048,
        height: 768,
        alt: "Nền tảng Gia Phả Dòng Họ",
      },
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
    card: "summary_large_image",
    title: "GIA PHẢ DÒNG HỌ - Gìn giữ & Lưu truyền Cội Nguồn",
    description:
      "Gìn giữ và lưu truyền giá trị cội nguồn, gắn kết các thế hệ dòng họ Việt Nam.",
    images: ["/images/landing/hero-banner.webp", "/images/landing/logo.png"],
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
