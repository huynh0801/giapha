"use client";
/* eslint-disable react/no-unescaped-entities */
import { motion } from "framer-motion";
import { Search, ShieldCheck, Globe, Phone, Award } from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5e7c7] text-[#2c1a11]">
      <LandingHeader />

      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:py-16 relative z-10 w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl w-full">
          <div className="bg-[#fcf5e5] rounded-3xl p-8 sm:p-12 shadow-sm border border-[#e2d0a8] mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-5 mb-12 border-b border-[#e2d0a8]/60 pb-10">
              <div className="p-4 bg-amber-100/50 text-[#8c1d1d] rounded-2xl"><Globe className="size-10" /></div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#183b28] leading-tight">
                GIA PHẢ DÒNG HỌ
                <span className="block text-xl sm:text-2xl mt-2 text-[#8c1d1d] font-extrabold uppercase">VẤN TỔ TÌM TÔNG – KẾT NỐI TRUYỀN ĐỜI</span>
              </h1>
            </div>
            <div className="space-y-6 text-[#3c3026] leading-relaxed text-[17px] font-sans">
              <p>Viện Khoa học Phát huy Truyền thống Di sản Văn hóa các Dòng Họ Việt Nam triển khai dự án <strong className="text-[#8c1d1d]">"VẤN TỔ TÌM TÔNG – KẾT NỐI TRUYỀN ĐỜI"</strong> nhằm giúp mỗi người con Việt tìm về cội nguồn.</p>
              <div className="bg-[#f7edd5] p-7 rounded-2xl border-l-4 border-[#8c1d1d] relative">
                <Award className="absolute right-4 top-4 size-16 text-amber-900/10" />
                Dự án nhận được sự hỗ trợ chuyên môn từ các chuyên gia hàng đầu như <strong className="text-[#8c1d1d]">Giáo sư sử học Lê Văn Lan, Giáo sư Đặng Cát Hưởng...</strong>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-[#f7eed9] rounded-2xl border border-[#e2d0a8]/80 hover:border-[#caa455] transition-all">
                <div className="flex items-center gap-3 mb-3 text-[#8c1d1d] font-bold"><Search className="size-5" /> Tra cứu nguồn gốc</div>
                <p className="text-sm text-[#5c4a3e]">Giải mã hành trình di cư của tổ tiên qua nhiều thế kỷ và kết nối các chi họ thất lạc.</p>
              </div>
              <div className="p-6 bg-[#f7eed9] rounded-2xl border border-[#e2d0a8]/80 hover:border-[#caa455] transition-all">
                <div className="flex items-center gap-3 mb-3 text-[#8c1d1d] font-bold"><ShieldCheck className="size-5" /> Số hóa & Bảo tồn</div>
                <p className="text-sm text-[#5c4a3e]">"Vĩnh cửu hóa" di sản dòng tộc trên nền tảng số bảo mật, không lo thất lạc tư liệu.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between px-8 py-8 bg-[#183b28] rounded-3xl text-amber-50 shadow-md">
            <div>
              <h3 className="text-xl font-bold">Cần hỗ trợ về di sản?</h3>
              <p className="text-amber-200/80 text-sm">Chúng tôi đồng hành cùng quý dòng tộc.</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/10"><Phone className="size-4" /> 0123.456.789</div>
            </div>
          </div>
        </motion.div>
      </main>

      <LandingFooter />
    </div>
  );
}
