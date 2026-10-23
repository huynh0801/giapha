import VisitTracker from "@/components/VisitTracker";
import localFont from "next/font/local";
import "./globals.css";

const studioBrush = localFont({
  src: "../public/fonts/SVN-Studio-Brush.otf",
  variable: "--font-studio-brush",
  display: "swap",
  preload: true,
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
    <html lang="vi" className={studioBrush.variable}>
      <body className="antialiased font-sans">
        <div className="flex min-h-screen flex-col">
          <VisitTracker />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
