import type { Metadata } from "next";
import AboutView from "@/components/about/AboutView";

export const metadata: Metadata = {
  title: "Giới thiệu & Lịch sử dòng họ",
  description:
    "Tìm hiểu nguồn gốc cội nguồn, lịch sử hình thành, nhà thờ tổ và truyền thống vẻ vang của dòng tộc.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Giới thiệu & Lịch sử dòng họ | Gia Phả Dòng Họ",
    description:
      "Tìm hiểu nguồn gốc cội nguồn, lịch sử hình thành, nhà thờ tổ và truyền thống vẻ vang của dòng tộc.",
    url: "/about",
    images: [
      {
        url: "/images/landing/hero-banner.webp",
        width: 2048,
        height: 768,
        alt: "Giới thiệu Gia Phả Dòng Họ",
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
    title: "Giới thiệu & Lịch sử dòng họ | Gia Phả Dòng Họ",
    description:
      "Tìm hiểu nguồn gốc cội nguồn, lịch sử hình thành, nhà thờ tổ và truyền thống vẻ vang của dòng tộc.",
    images: ["/images/landing/hero-banner.webp"],
  },
};

export default function AboutPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: "https://giaphaquangbinh.io.vn",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Giới thiệu & Lịch sử dòng họ",
        item: "https://giaphaquangbinh.io.vn/about",
      },
    ],
  };

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Giới thiệu & Lịch sử dòng họ",
    description:
      "Tìm hiểu nguồn gốc cội nguồn, lịch sử hình thành, nhà thờ tổ và truyền thống vẻ vang của dòng tộc.",
    url: "https://giaphaquangbinh.io.vn/about",
    mainEntity: {
      "@type": "Organization",
      name: "Gia Phả Dòng Họ",
      url: "https://giaphaquangbinh.io.vn",
      logo: "https://giaphaquangbinh.io.vn/images/landing/logo.png",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <AboutView />
    </>
  );
}
