import Footer from "@/components/Footer";
import VisitTracker from "@/components/VisitTracker";
import "./globals.css";

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
      <body className="antialiased font-sans">
        <div className="flex min-h-screen flex-col">
          <VisitTracker />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
