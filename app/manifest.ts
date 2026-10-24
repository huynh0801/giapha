import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gia Phả Dòng Họ - Nền Tảng Phả Hệ Gia Tộc",
    short_name: "Gia Phả",
    description: "Gìn giữ và lưu truyền giá trị cội nguồn, gắn kết các thế hệ dòng họ",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f5e7c7",
    theme_color: "#8c1d1d",
    categories: ["lifestyle", "social", "utilities"],
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/images/landing/logo.png",
        sizes: "305x393",
        type: "image/png",
      },
    ],
  };
}
