"use client";
/* eslint-disable react/no-unescaped-entities */

import { motion } from "framer-motion";
import { ArrowLeft, Search, BookOpen, ShieldCheck, Users, Globe, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { postsData } from "./data";
import { Suspense } from "react";

function AboutContent() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const post = postsData.find((p) => p.id === postId);

  if (post) {
    return (
      <div className="min-h-screen bg-[#FDF8F1] pb-20 p-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-stone-500 mb-6 font-bold uppercase hover:text-red-800 transition-colors text-sm">
          <ArrowLeft size={16} /> QUAY LẠI
        </Link>
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-xl rounded-2xl border border-stone-200 font-sans">
          <h1 className="text-3xl font-black text-stone-900 mb-4 uppercase leading-tight">{post.title}</h1>
          <div className="w-20 h-1.5 bg-[#800000] mb-8"></div>
          <img src={post.img} alt={post.title} className="w-full h-auto rounded-3xl mb-8 shadow-md border-4 border-white" />
          <div className="prose prose-stone max-w-none text-lg text-stone-700 leading-relaxed" 
               dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] selection:bg-amber-200 selection:text-amber-900 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <Link href="/dashboard" className="btn absolute top-6 left-6 z-20 flex items-center gap-2 text-stone-600 hover:text-amber-700 transition-colors font-semibold">
        <ArrowLeft className="size-4" />
        Quay lại
      </Link>

      <div className="flex-1 flex flex-col justify-center items-center px-4 py-20 relative z-10 w-full mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-stone-200 mb-8">
            <div className="flex items-center gap-3 mb-12 border-b border-stone-100 pb-10">
              <div className="p-3 bg-amber-100/50 text-amber-700 rounded-2xl flex-shrink-0">
                <Globe className="size-8 sm:size-10" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-800 leading-tight">
                GIA PHẢ DÒNG HỌ
                <span className="block text-xl sm:text-2xl mt-1.5 text-amber-700 font-extrabold uppercase tracking-tight">VẤN TỔ TÌM TÔNG – KẾT NỐI TRUYỀN ĐỜI</span>
              </h1>
            </div>

            <div className="max-w-none space-y-6 text-stone-700 leading-relaxed text-[16px]">
              <p>
                Viện Khoa học PHTT Di sản Văn hóa các Dòng Họ Việt Nam triển khai dự án GIA PHẢ DÒNG HỌ <strong>"VẤN TỔ TÌM TÔNG – KẾT NỐI TRUYỀN ĐỜI"</strong> dựa trên nền tảng công nghệ số hiện đại. Đây không chỉ là nơi lưu trữ dữ liệu quy mô lớn mà còn là hành trình thiêng liêng giúp mỗi người tìm về cội nguồn, trả lời câu hỏi cốt nhục: <em>"Ông tổ mình là ai? Dòng họ mình từ đâu đến?"</em>
              </p>
              <p>
                Bằng việc kết nối các chi nhánh, tổ tiên thông qua công nghệ số, chúng tôi xóa nhòa khoảng cách địa lý để bất cứ người Việt Nam nào, dù ở đâu trên thế giới, cũng có thể tự hào giới thiệu về truyền thống dòng tộc và giữ gìn nền nếp gia phong. </p>
              <p className="bg-amber-50 p-6 rounded-2xl border-l-4 border-amber-700 text-stone-800 shadow-sm">
                Sử dụng nền tảng <strong>GIA PHẢ DÒNG HỌ</strong>, quý dòng họ có cơ hội nhận được sự hỗ trợ chuyên môn cao nhất từ Viện Khoa học Phát huy Truyền thống Di sản Văn hóa các Dòng Họ Việt Nam với các nhà khoa học, học giả hàng đầu như: <strong>Giáo sư sử học Lê Văn Lan, Giáo sư Đặng Cát Hưởng, Tiến sĩ khoa học Vũ Thế Khanh...</strong> để mỗi bộ gia phả đạt tính chính xác và tin cậy lớn nhất.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="p-7 bg-stone-50/50 rounded-2xl border border-stone-100 hover:border-amber-200 hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4.5 text-amber-700 font-bold">
                  <Search className="size-5.5" /> Tra cứu nguồn gốc
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">Giải mã bí ẩn hành trình di cư, tìm lại liên kết giữa các chi ngành dựa trên sử liệu và gia phả cổ.</p>
              </div>

              <div className="p-7 bg-stone-50/50 rounded-2xl border border-stone-100 hover:border-amber-200 hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4.5 text-amber-700 font-bold">
                  <BookOpen className="size-5.5" /> Biên soạn chuẩn mực
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">Chuyển hóa mẩu chuyện rời rạc thành bộ gia phả hoàn chỉnh, trang trọng, mang đậm nét văn hóa truyền thống.</p>
              </div>

              <div className="p-7 bg-stone-50/50 rounded-2xl border border-stone-100 hover:border-amber-200 hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4.5 text-amber-700 font-bold">
                  <ShieldCheck className="size-5.5" /> Số hóa & Bảo tồn
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">"Vĩnh cửu hóa" di sản dòng họ trên nền tảng số bảo mật, thay thế hoàn toàn nỗi lo thất lạc tài liệu giấy.</p>
              </div>

              <div className="p-7 bg-stone-50/50 rounded-2xl border border-stone-100 hover:border-amber-200 hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4.5 text-amber-700 font-bold">
                  <Users className="size-5.5" /> Tư vấn chuyên sâu 1:1
                </div> 
                <p className="text-sm text-stone-600 leading-relaxed">Kết nối trực tiếp với chuyên gia lịch sử để hiểu đúng về gia huấn, tông pháp và giá trị văn hóa đặc thù.</p>
              </div>
            </div>

            <div className="mt-20 pt-12 border-t border-stone-100 text-center">
              <h2 className="text-2xl font-bold text-stone-900 mb-6 font-serif">Chúng tôi là ai?</h2>
              <p className="text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed text-[16px]">
                Viện Khoa học Phát huy Truyền thống Di sản Văn hóa các Dòng Họ Việt Nam là tổ chức khoa học uy tín, chuyên nghiên cứu và thực hành bảo tồn văn hóa dòng họ. Chúng tôi tin rằng: <strong className="text-amber-800">Làm gia phả là việc hiếu, giữ gia phả là việc nghĩa.</strong>
              </p>
              <p className="text-stone-800 font-semibold mb-12 text-[17px] leading-relaxed">
                Hãy nhắn tin cho chúng tôi. Chúng tôi sẽ kết nối thay bạn, giúp bạn thấu hiểu sâu sắc hơn về dòng họ và tổ tiên mình.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-5.5 mb-10">
                <a 
                  href="https://www.viendisanvanhoacdh.com/trang-ch%E1%BB%A7" 
                  target="_blank" 
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-amber-700 text-white font-bold rounded-full hover:bg-amber-800 transition-all shadow-md hover:shadow-lg text-[16px]"
                >
                  <Globe className="size-4.5" /> Ghé thăm Website chính thức
                </a>
                <a href="tel:0911012110" className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-amber-700 border border-amber-200 font-bold rounded-full hover:bg-amber-50 transition-all hover:border-amber-300 shadow-sm text-[16px]">
                  <Phone className="size-4.5" /> 0911.012.110
                </a>
              </div>

              <div className="flex items-center justify-center gap-3 text-stone-500 text-sm mt-12 bg-stone-50 p-4 rounded-xl border border-stone-100 inline-flex">
                <Mail className="size-4.5 text-amber-600" /> viendisanvanhoacdh@gmail.com
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold text-stone-400">ĐANG TẢI...</div>}>
      <AboutContent />
    </Suspense>
  );
}
