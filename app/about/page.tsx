"use client";
/* eslint-disable react/no-unescaped-entities */
import { motion } from "framer-motion";
import { ArrowLeft, Search, ShieldCheck, Globe, Phone, Award } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-stone-600 hover:text-amber-700 no-underline font-medium">
        <ArrowLeft className="size-4" /> Quay lại
      </Link>
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-20 relative z-10 w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl w-full">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-stone-200 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-5 mb-12 border-b border-stone-100 pb-10">
              <div className="p-4 bg-amber-100/50 text-amber-700 rounded-2xl"><Globe className="size-10" /></div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-900 leading-tight">
                GIA PHẢ DÒNG HỌ
                <span className="block text-xl sm:text-2xl mt-2 text-[#7D0000] font-extrabold uppercase">VẤN TỔ TÌM TÔNG – KẾT NỐI TRUYỀN ĐỜI</span>
              </h1>
            </div>
            <div className="space-y-6 text-stone-700 leading-relaxed text-[17px] font-serif">
              <p>Viện Khoa học Phát huy Truyền thống Di sản Văn hóa các Dòng Họ Việt Nam triển khai dự án <strong className="text-amber-900">"VẤN TỔ TÌM TÔNG – KẾT NỐI TRUYỀN ĐỜI"</strong> nhằm giúp mỗi người con Việt tìm về cội nguồn.</p>
              <div className="bg-amber-50/70 p-7 rounded-2xl border-l-4 border-amber-700 relative">
                <Award className="absolute right-4 top-4 size-16 text-amber-200/40" />
                Dự án nhận được sự hỗ trợ chuyên môn từ các chuyên gia hàng đầu như <strong className="text-[#7D0000]">Giáo sư sử học Lê Văn Lan, Giáo sư Đặng Cát Hưởng...</strong>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 hover:border-amber-200 transition-all">
                <div className="flex items-center gap-3 mb-3 text-amber-700 font-bold"><Search className="size-5" /> Tra cứu nguồn gốc</div>
                <p className="text-sm text-stone-600">Giải mã hành trình di cư của tổ tiên qua nhiều thế kỷ và kết nối các chi họ thất lạc.</p>
              </div>
              <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 hover:border-amber-200 transition-all">
                <div className="flex items-center gap-3 mb-3 text-amber-700 font-bold"><ShieldCheck className="size-5" /> Số hóa & Bảo tồn</div>
                <p className="text-sm text-stone-600">"Vĩnh cửu hóa" di sản dòng tộc trên nền tảng số bảo mật, không lo thất lạc tư liệu.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between px-8 py-8 bg-amber-900 rounded-3xl text-amber-50">
            <div>
              <h3 className="text-xl font-bold">Cần hỗ trợ về di sản?</h3>
              <p className="text-amber-200/80 text-sm">Chúng tôi đồng hành cùng quý dòng tộc.</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/10"><Phone className="size-4" /> 0123.456.789</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
