export interface Post {
  id: string;
  category: "SO_HOA_GIA_PHA" | "SO_HOA_DI_SAN" | "HOAT_DONG" | "VE_NGUON" | "KHAM_PHA" | "KET_NOI";
  title: string;
  desc: string;
  content: string;
  img: string;
  date: string;
}

export const postsData: Post[] = [
  {
    id: "chua-phuc-lam-tu",
    category: "SO_HOA_DI_SAN",
    title: "PHÚC LÂM TỰ CỔ ÔM ẤP GIÁ TRỊ CỔ XƯA VÙNG VEN ĐÔ HÀ NỘI",
    desc: "Nằm tại làng Nhân Hòa, nơi lưu giữ 38 đạo sắc phong và hệ thống di sản kiến trúc thời Hậu Lê...",
    date: "16/04/2026",
    img: "/cong-tam-quan-phuc-lam-tu.jpg", 
    content: `<p>Nội dung chi tiết về Chùa Phúc Lâm...</p>`
  },
  {
    id: "du-an-la-chan-xanh",
    category: "HOAT_DONG",
    title: "Triển khai dự án Lá Chắn Xanh tại Thanh Oai",
    desc: "Hệ thống hàng rào sinh học bảo vệ môi trường học đường cho các em học sinh.",
    date: "10/04/2026",
    img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800",
    content: "<p>Dự án Lá Chắn Xanh tập trung xây dựng môi trường xanh, sạch...</p>"
  }
];
