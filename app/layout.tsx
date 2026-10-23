import Footer from "@/components/Footer";
import VisitTracker from "@/components/VisitTracker";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-playfair",
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
    <html lang="vi">
      <body className={`${playfair.variable} antialiased font-sans`}>
        <div className="flex min-h-screen flex-col">
          <VisitTracker />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
