"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  HeartHandshake,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

/**
 * Traditional decorative frame with sharp corners, gold double-line border,
 * and crimson/gold traditional corner brackets.
 */
function TraditionalFrame({
  children,
  className = "",
  innerClassName = "",
  cornerColor = "border-[#8c1d1d]",
  borderColor = "border-[#caa455]",
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  cornerColor?: string;
  borderColor?: string;
}) {
  return (
    <div
      className={`relative p-1.5 border-2 ${borderColor} bg-[#f5e7c7]/30 shadow-[0_4px_24px_rgba(44,26,17,0.06)] ${className}`}
    >
      <div
        className={`relative border border-[#deb887]/80 bg-[#fffdf7] p-5 sm:p-8 md:p-10 ${innerClassName}`}
      >
        {/* 4 Traditional Corner Brackets */}
        <span
          className={`pointer-events-none absolute top-1.5 left-1.5 size-3.5 border-t-2 border-l-2 ${cornerColor}`}
        />
        <span
          className={`pointer-events-none absolute top-1.5 right-1.5 size-3.5 border-t-2 border-r-2 ${cornerColor}`}
        />
        <span
          className={`pointer-events-none absolute bottom-1.5 left-1.5 size-3.5 border-b-2 border-l-2 ${cornerColor}`}
        />
        <span
          className={`pointer-events-none absolute bottom-1.5 right-1.5 size-3.5 border-b-2 border-r-2 ${cornerColor}`}
        />

        {children}
      </div>
    </div>
  );
}

/**
 * Traditional section title with symmetrical gold clouds and horizontal rule
 */
function TraditionalTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center my-6 sm:my-8">
      <div className="flex items-center justify-center gap-2.5 sm:gap-4 w-full max-w-xl">
        <div className="relative w-8 h-4 sm:w-12 sm:h-6 shrink-0 opacity-85">
          <Image
            src="/images/landing/footer-clouds.png"
            alt="Họa tiết mây"
            fill
            sizes="48px"
            className="object-contain"
          />
        </div>
        <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#caa455] to-[#caa455]" />
        <h2
          className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#183b28] uppercase shrink-0 px-2"
          style={{
            fontFamily:
              '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
          }}
        >
          {title}
        </h2>
        <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#caa455] to-[#caa455]" />
        <div className="relative w-8 h-4 sm:w-12 sm:h-6 shrink-0 opacity-85 scale-x-[-1]">
          <Image
            src="/images/landing/footer-clouds.png"
            alt="Họa tiết mây"
            fill
            sizes="48px"
            className="object-contain"
          />
        </div>
      </div>
      {subtitle && (
        <p className="mt-2 text-xs sm:text-sm font-semibold tracking-wide text-[#8c1d1d] uppercase font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function AboutPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    branch: "",
    content: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5e7c7] text-[#2c1a11]">
      <LandingHeader />

      <main className="flex-1 w-full py-8 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
          {/* Top Banner: Đại Tự Sắc Phong */}
          <div className="relative text-center pt-2 pb-4">
            <div className="inline-flex items-center justify-center gap-3 sm:gap-5 mb-2">
              <div className="relative w-9 h-5 sm:w-14 sm:h-7 opacity-85">
                <Image
                  src="/images/landing/footer-clouds.png"
                  alt="Họa tiết mây trái"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#8c1d1d] font-sans">
                Vấn Tổ Tìm Tông – Kết Nối Truyền Đời
              </span>
              <div className="relative w-9 h-5 sm:w-14 sm:h-7 opacity-85 scale-x-[-1]">
                <Image
                  src="/images/landing/footer-clouds.png"
                  alt="Họa tiết mây phải"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
            </div>

            <h1
              className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#183b28] uppercase leading-tight"
              style={{
                fontFamily:
                  '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
              }}
            >
              Nguồn Cội & Truyền Thống Dòng Họ
            </h1>

            <p className="mt-3 max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-[#5c4a3e] font-sans font-medium italic">
              &ldquo;Cây có cội mới nở cành xanh ngọn, nước có nguồn mới biển
              rộng sông sâu. Người có tổ tiên mới có bản thân ta.&rdquo;
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="h-[1px] w-16 sm:w-28 bg-[#caa455]" />
              <span className="size-2 rotate-45 bg-[#8c1d1d]" />
              <span className="h-[1px] w-16 sm:w-28 bg-[#caa455]" />
            </div>
          </div>

          {/* Section 1: Main Story Showcase with Double Border Frame */}
          <TraditionalFrame>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Framed Ancestral Temple Art */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7] w-full max-w-md shadow-sm">
                  <div className="relative aspect-[382/254] w-full border border-[#deb887] overflow-hidden">
                    <Image
                      src="/images/landing/about-painting.png"
                      alt="Từ đường dòng họ sơn thủy hữu tình"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                <p className="mt-2 text-center text-[11px] sm:text-xs text-[#6e5849] font-sans italic">
                  Từ đường dòng họ – Chốn hội tụ hồn thiêng và phúc đức ngàn đời
                </p>
              </div>

              {/* Right Column: Historical Narrative */}
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="inline-block border-b-2 border-[#8c1d1d] pb-1">
                  <span
                    className="text-lg sm:text-xl font-bold text-[#183b28]"
                    style={{
                      fontFamily:
                        '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                    }}
                  >
                    Khởi Nguồn Tiền Nhân Khai Sáng
                  </span>
                </div>

                <p className="text-xs sm:text-sm md:text-[15px] text-[#3c3026] leading-relaxed font-sans text-justify">
                  Dòng họ chúng tôi trải qua nhiều thế hệ đồng hành cùng những
                  bước thăng trầm của lịch sử dân tộc. Bắt đầu từ những bậc tiền
                  nhân giàu lòng nhân nghĩa, khai hoang mở đất, lập làng dựng ấp,
                  các thế hệ con cháu luôn kế thừa trọn vẹn đức tính cần cù, hiếu
                  học, cương trực và hết lòng phụng sự quê hương.
                </p>

                <div className="p-4 border-l-4 border-[#8c1d1d] bg-[#fcf6e8] border-t border-r border-b border-[#deb887]/60">
                  <p className="text-xs sm:text-sm text-[#2c1a11] leading-relaxed font-sans font-semibold">
                    &ldquo;Dù đi bốn phương trời, hướng về trăm ngả gió, mỗi
                    người con dòng tộc luôn khắc cốt ghi tâm nguồn cội, cùng nhau
                    gìn giữ gia phong, đùm bọc chi họ và làm rạng danh tiên
                    tổ.&rdquo;
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#3c3026] leading-relaxed font-sans text-justify">
                  Nhằm bảo tồn gia phả và kết nối muôn phương, Hội đồng Dòng họ
                  đã cùng các chi cành chung tay số hóa tư liệu gia phả, tạo nên
                  không gian kết nối vững chắc giữa quá khứ, hiện tại và tương
                  lai.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 border border-[#8c1d1d] bg-[#8c1d1d] hover:bg-[#a62424] text-[#fffcf5] px-5 py-2 text-xs sm:text-sm font-sans font-bold shadow-xs transition-colors"
                  >
                    <span>Khám phá gia phả</span>
                    <ArrowRight className="size-4" />
                  </Link>
                  <a
                    href="#lien-he"
                    className="inline-flex items-center gap-2 border border-[#caa455] bg-[#fffcf5] hover:bg-[#fbf4e2] text-[#183b28] px-5 py-2 text-xs sm:text-sm font-sans font-bold shadow-xs transition-colors"
                  >
                    <span>Ban liên lạc</span>
                  </a>
                </div>
              </div>
            </div>
          </TraditionalFrame>

          {/* Section 2: Ba Trụ Cột Di Sản (3 Pillars of Lineage Heritage) */}
          <div>
            <TraditionalTitle
              title="Ba Trụ Cột Di Sản Dòng Tộc"
              subtitle="Gìn giữ cốt cách – Phát huy truyền thống gia phong"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {/* Pillar 1: Phả Hệ & Tông Tộc */}
              <div className="relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 shadow-xs">
                <div className="relative border border-[#deb887] bg-[#fffdf7] p-5 sm:p-6 flex flex-col justify-between h-full">
                  <span className="absolute top-1 left-1 size-3 border-t-2 border-l-2 border-[#8c1d1d]" />
                  <span className="absolute top-1 right-1 size-3 border-t-2 border-r-2 border-[#8c1d1d]" />
                  <span className="absolute bottom-1 left-1 size-3 border-b-2 border-l-2 border-[#8c1d1d]" />
                  <span className="absolute bottom-1 right-1 size-3 border-b-2 border-r-2 border-[#8c1d1d]" />

                  <div>
                    <div className="flex items-center gap-3 mb-3 border-b border-[#deb887]/70 pb-3">
                      <div className="flex size-10 items-center justify-center border border-[#caa455] bg-[#fcf5e5] text-[#8c1d1d] shadow-2xs">
                        <BookOpen className="size-5" />
                      </div>
                      <h3
                        className="text-base sm:text-lg font-bold text-[#183b28] leading-tight"
                        style={{
                          fontFamily:
                            '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                        }}
                      >
                        Phả Hệ & Tông Tộc
                      </h3>
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#4a3b2f] leading-relaxed font-sans">
                      Hệ thống ghi chép thế thứ rõ ràng, truy nguyên cội nguồn từ
                      thủy tổ đến các chi cành, giúp con cháu nhận biết gốc gác
                      và xưng hô chuẩn mực theo tôn ti trật tự.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#deb887]/50 flex items-center gap-1.5 text-xs text-[#8c1d1d] font-bold">
                    <Compass className="size-3.5" />
                    <span>Tra cứu gốc tích chuẩn xác</span>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Từ Đường & Thờ Tự */}
              <div className="relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 shadow-xs">
                <div className="relative border border-[#deb887] bg-[#fffdf7] p-5 sm:p-6 flex flex-col justify-between h-full">
                  <span className="absolute top-1 left-1 size-3 border-t-2 border-l-2 border-[#8c1d1d]" />
                  <span className="absolute top-1 right-1 size-3 border-t-2 border-r-2 border-[#8c1d1d]" />
                  <span className="absolute bottom-1 left-1 size-3 border-b-2 border-l-2 border-[#8c1d1d]" />
                  <span className="absolute bottom-1 right-1 size-3 border-b-2 border-r-2 border-[#8c1d1d]" />

                  <div>
                    <div className="flex items-center gap-3 mb-3 border-b border-[#deb887]/70 pb-3">
                      <div className="flex size-10 items-center justify-center border border-[#caa455] bg-[#fcf5e5] text-[#8c1d1d] shadow-2xs">
                        <Landmark className="size-5" />
                      </div>
                      <h3
                        className="text-base sm:text-lg font-bold text-[#183b28] leading-tight"
                        style={{
                          fontFamily:
                            '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                        }}
                      >
                        Từ Đường & Phụng Sự
                      </h3>
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#4a3b2f] leading-relaxed font-sans">
                      Không gian linh thiêng phụng thờ tổ tiên, nơi con cháu sum
                      vầy xuân thu nhị kỳ, tổ chức lễ tế trang nghiêm, gìn giữ
                      hồn thiêng dòng tộc trường tồn cùng non nước.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#deb887]/50 flex items-center gap-1.5 text-xs text-[#8c1d1d] font-bold">
                    <Calendar className="size-3.5" />
                    <span>Xuân thu nhị kỳ tế tự</span>
                  </div>
                </div>
              </div>

              {/* Pillar 3: Khuyến Học & Khuyến Tài */}
              <div className="relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 shadow-xs">
                <div className="relative border border-[#deb887] bg-[#fffdf7] p-5 sm:p-6 flex flex-col justify-between h-full">
                  <span className="absolute top-1 left-1 size-3 border-t-2 border-l-2 border-[#8c1d1d]" />
                  <span className="absolute top-1 right-1 size-3 border-t-2 border-r-2 border-[#8c1d1d]" />
                  <span className="absolute bottom-1 left-1 size-3 border-b-2 border-l-2 border-[#8c1d1d]" />
                  <span className="absolute bottom-1 right-1 size-3 border-b-2 border-r-2 border-[#8c1d1d]" />

                  <div>
                    <div className="flex items-center gap-3 mb-3 border-b border-[#deb887]/70 pb-3">
                      <div className="flex size-10 items-center justify-center border border-[#caa455] bg-[#fcf5e5] text-[#8c1d1d] shadow-2xs">
                        <Users className="size-5" />
                      </div>
                      <h3
                        className="text-base sm:text-lg font-bold text-[#183b28] leading-tight"
                        style={{
                          fontFamily:
                            '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                        }}
                      >
                        Khuyến Học & Khuyến Tài
                      </h3>
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#4a3b2f] leading-relaxed font-sans">
                      Tiếp nối truyền thống tôn sư trọng đạo, dòng họ xây dựng
                      quỹ khuyến học vinh danh các bậc tân khoa, nâng bước thế hệ
                      hậu duệ thành tài, làm vẻ vang tông thất.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#deb887]/50 flex items-center gap-1.5 text-xs text-[#8c1d1d] font-bold">
                    <Sparkles className="size-3.5" />
                    <span>Nâng bước hiền tài tương lai</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Dự Án Số Hóa Di Sản Dòng Họ */}
          <TraditionalFrame innerClassName="bg-[#fcf8ee]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#deb887]/70 pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center border-2 border-[#caa455] bg-[#8c1d1d] text-white shadow-xs">
                  <ShieldCheck className="size-7" />
                </div>
                <div>
                  <h3
                    className="text-lg sm:text-xl md:text-2xl font-bold text-[#183b28]"
                    style={{
                      fontFamily:
                        '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                    }}
                  >
                    Dự Án Số Hóa Di Sản &amp; Phả Đồ Vĩnh Cửu
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8c1d1d] font-semibold">
                    Đồng hành cùng Viện Khoa học Di sản Văn hóa các Dòng Họ Việt
                    Nam
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 border border-[#caa455] bg-[#fffdf7] text-xs font-bold text-[#183b28]">
                <Clock className="size-4 text-[#8c1d1d]" />
                <span>Bảo tồn xuyên thế kỷ</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-[#3c3026] leading-relaxed font-sans text-justify">
              <p>
                Thời gian và thiên tai có thể làm phai mờ giấy mực, nhưng công
                nghệ số hóa hiện đại giúp lưu giữ vẹn nguyên văn bia, sắc phong,
                hình ảnh và phả đồ gốc của tổ tiên. Mỗi gia đình, chi họ đều có
                thể truy cập an toàn, cập nhật thông tin con cháu và đính kèm kỷ
                vật vô giá.
              </p>
              <p>
                Dự án nhận được sự cố vấn chuyên sâu từ các nhà sử học, bảo đảm
                tính xác thực, chuẩn tắc nghi lễ và chuẩn phong thủy văn hóa dân
                tộc. Đây là nhịp cầu thiêng liêng kết nối người Việt muôn phương
                hướng về bàn thờ tổ tiên.
              </p>
            </div>
          </TraditionalFrame>

          {/* Section 4: Ban Trị Sự & Liên Hệ (Contact & Secretariat) */}
          <div id="lien-he" className="scroll-mt-24">
            <TraditionalTitle
              title="Ban Trị Sự & Thông Tin Liên Hệ"
              subtitle="Tiếp nhận tâm thư – Góp ý tư liệu – Kết nối chi họ"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Left Column: Official Secretariat Card in Deep Jade Green */}
              <div className="lg:col-span-5 relative p-1.5 border-2 border-[#caa455] bg-[#183b28] text-[#fffdf7] shadow-md">
                <div className="relative border border-[#caa455]/60 bg-[#1b3a29] p-6 sm:p-8 flex flex-col justify-between h-full">
                  <span className="absolute top-1 left-1 size-3 border-t-2 border-l-2 border-[#caa455]" />
                  <span className="absolute top-1 right-1 size-3 border-t-2 border-r-2 border-[#caa455]" />
                  <span className="absolute bottom-1 left-1 size-3 border-b-2 border-l-2 border-[#caa455]" />
                  <span className="absolute bottom-1 right-1 size-3 border-b-2 border-r-2 border-[#caa455]" />

                  <div>
                    <h3
                      className="text-lg sm:text-xl font-bold text-[#f5ebd2] border-b border-[#caa455]/40 pb-3"
                      style={{
                        fontFamily:
                          '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                      }}
                    >
                      Văn Phòng Ban Trị Sự Dòng Họ
                    </h3>

                    <p className="mt-3 text-xs text-[#e8ecd8]/85 leading-relaxed font-sans">
                      Quý con cháu, thân tộc và bà con đồng hương cần liên hệ
                      viếng từ đường, tra cứu hồ sơ thế thứ hoặc đóng góp tư liệu
                      cổ xin vui lòng liên hệ trực tiếp:
                    </p>

                    <div className="mt-6 space-y-4 text-xs sm:text-sm font-sans">
                      <div className="flex items-start gap-3">
                        <MapPin className="size-4.5 text-[#caa455] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#f5ebd2] block font-semibold">
                            Địa chỉ Từ Đường:
                          </strong>
                          <span className="text-[#e8ecd8]/90">
                            Nhà Thờ Tổ Dòng Họ, Thôn Thượng, Xã Di Sản, Huyện
                            Văn Hiến, Việt Nam
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="size-4.5 text-[#caa455] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#f5ebd2] block font-semibold">
                            Đường dây nóng Ban Liên Lạc:
                          </strong>
                          <a
                            href="tel:0123456789"
                            className="text-[#caa455] hover:underline font-bold text-sm tracking-wide"
                          >
                            0123.456.789
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="size-4.5 text-[#caa455] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#f5ebd2] block font-semibold">
                            Hòm thư điện tử:
                          </strong>
                          <a
                            href="mailto:lienhe@giaphadongho.vn"
                            className="text-[#caa455] hover:underline font-medium"
                          >
                            lienhe@giaphadongho.vn
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="size-4.5 text-[#caa455] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#f5ebd2] block font-semibold">
                            Thời gian tiếp tế tự &amp; viếng:
                          </strong>
                          <span className="text-[#e8ecd8]/90">
                            Thứ Bảy, Chủ Nhật &amp; Các ngày rằm, mùng một âm
                            lịch
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#caa455]/30">
                    <p className="text-[11px] text-[#caa455]/90 italic font-sans text-center">
                      &ldquo;Con cháu thảo hiền muôn phương về bái tổ&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Traditional Feedback & Contact Form */}
              <div className="lg:col-span-7 relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/30 shadow-md">
                <div className="relative border border-[#deb887] bg-[#fffdf7] p-6 sm:p-8">
                  <span className="absolute top-1 left-1 size-3 border-t-2 border-l-2 border-[#8c1d1d]" />
                  <span className="absolute top-1 right-1 size-3 border-t-2 border-r-2 border-[#8c1d1d]" />
                  <span className="absolute bottom-1 left-1 size-3 border-b-2 border-l-2 border-[#8c1d1d]" />
                  <span className="absolute bottom-1 right-1 size-3 border-b-2 border-r-2 border-[#8c1d1d]" />

                  <div className="border-b border-[#deb887] pb-3 mb-5">
                    <h3
                      className="text-lg sm:text-xl font-bold text-[#183b28]"
                      style={{
                        fontFamily:
                          '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                      }}
                    >
                      Gửi Lời Nhắn Đến Ban Trị Sự
                    </h3>
                    <p className="text-xs text-[#6e5849] font-sans mt-0.5">
                      Đóng góp tư liệu cổ, thông báo thông tin chi cành hoặc gửi
                      gắm tâm thư
                    </p>
                  </div>

                  {submitted ? (
                    <div className="p-6 border border-[#caa455] bg-[#fcf6e8] text-center space-y-3 my-4">
                      <div className="inline-flex items-center justify-center size-12 bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="size-6" />
                      </div>
                      <h4
                        className="text-lg font-bold text-[#183b28]"
                        style={{
                          fontFamily:
                            '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                        }}
                      >
                        Gửi Tâm Thư Thành Công
                      </h4>
                      <p className="text-xs sm:text-sm text-[#4a3b2f] max-w-md mx-auto leading-relaxed font-sans">
                        Lời nhắn của Quý thân tộc đã được gửi đến Ban Thư ký Hội
                        đồng Dòng họ. Chúng tôi sẽ liên hệ lại trong thời gian
                        sớm nhất. Xin trân trọng cảm ơn!
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            fullName: "",
                            phone: "",
                            email: "",
                            branch: "",
                            content: "",
                          });
                        }}
                        className="mt-2 text-xs font-bold text-[#8c1d1d] hover:underline uppercase tracking-wide"
                      >
                        Gửi thêm lời nhắn khác
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#2c1a11] mb-1 font-sans">
                            Họ và tên người gửi <span className="text-red-700">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Nguyễn Văn A"
                            value={formData.fullName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                fullName: e.target.value,
                              })
                            }
                            className="w-full border border-[#deb887] bg-[#fdfaf3] px-3 py-2 text-xs sm:text-sm text-[#2c1a11] placeholder:text-[#a89687] focus:border-[#8c1d1d] focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#2c1a11] mb-1 font-sans">
                            Số điện thoại liên lạc <span className="text-red-700">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="0912 345 678"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full border border-[#deb887] bg-[#fdfaf3] px-3 py-2 text-xs sm:text-sm text-[#2c1a11] placeholder:text-[#a89687] focus:border-[#8c1d1d] focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#2c1a11] mb-1 font-sans">
                            Địa chỉ thư điện tử (Email)
                          </label>
                          <input
                            type="email"
                            placeholder="nguyenvana@gmail.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            className="w-full border border-[#deb887] bg-[#fdfaf3] px-3 py-2 text-xs sm:text-sm text-[#2c1a11] placeholder:text-[#a89687] focus:border-[#8c1d1d] focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#2c1a11] mb-1 font-sans">
                            Chi họ / Ngành / Đời (nếu rõ)
                          </label>
                          <input
                            type="text"
                            placeholder="Chi 2 - Đời thứ 14..."
                            value={formData.branch}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                branch: e.target.value,
                              })
                            }
                            className="w-full border border-[#deb887] bg-[#fdfaf3] px-3 py-2 text-xs sm:text-sm text-[#2c1a11] placeholder:text-[#a89687] focus:border-[#8c1d1d] focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#2c1a11] mb-1 font-sans">
                          Nội dung tâm thư / Đóng góp tư liệu <span className="text-red-700">*</span>
                        </label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Kính gửi Ban Trị Sự, tôi muốn bổ sung thông tin gia phả chi..."
                          value={formData.content}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              content: e.target.value,
                            })
                          }
                          className="w-full border border-[#deb887] bg-[#fdfaf3] px-3 py-2 text-xs sm:text-sm text-[#2c1a11] placeholder:text-[#a89687] focus:border-[#8c1d1d] focus:bg-white focus:outline-none transition-colors resize-none"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-4">
                        <span className="text-[11px] text-[#7a6455] italic font-sans">
                          * Thông tin được bảo mật nội bộ trong dòng họ
                        </span>

                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 border border-[#8c1d1d] bg-[#8c1d1d] hover:bg-[#a62424] text-[#fffcf5] px-6 py-2.5 text-xs sm:text-sm font-sans font-bold shadow-xs active:scale-[0.99] transition-all cursor-pointer"
                        >
                          <Send className="size-4" />
                          <span>Gửi tâm thư</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
