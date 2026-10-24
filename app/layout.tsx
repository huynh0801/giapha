import VisitTracker from "@/components/VisitTracker";
import localFont from "next/font/local";
import { Be_Vietnam_Pro } from "next/font/google";
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

export const metadata = {
  title: "GIA PHẢ DÒNG HỌ",
  description: "Gìn giữ và lưu truyền giá trị cội nguồn",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo-gia-pha.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${studioBrush.variable}`}>
      <body className="antialiased font-sans">
        <div className="flex min-h-screen flex-col">
          <VisitTracker />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
