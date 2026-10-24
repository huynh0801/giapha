import { updateFamilyAction } from "@/app/actions/family";
import HeritagePageHeader from "@/components/dashboard/HeritagePageHeader";
import { HeritageBadge, HeritageFrame } from "@/components/dashboard/HeritageUI";
import { getFamilyContextBySlug } from "@/utils/supabase/queries";
import { FileText, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string }>;
}

function visibilityLabel(value: string) {
  if (value === "family_only") return "Chỉ trong dòng họ";
  if (value === "public") return "Công khai giới thiệu";
  return "Nội bộ riêng tư";
}

export default async function FamilyAboutPage({ params }: PageProps) {
  const { familySlug } = await params;
  const context = await getFamilyContextBySlug(familySlug);
  if (!context) notFound();

  const family = context.family;

  const inputClasses =
    "w-full rounded-xl border-2 border-[#deb887]/80 bg-[#fffdf7] px-4 py-3 text-sm font-semibold text-[#183b28] outline-none focus:border-[#caa455] focus:ring-2 focus:ring-[#caa455]/20 transition-all";

  return (
    <div className="flex w-full flex-1 flex-col pb-16">
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <HeritagePageHeader
          familySlug={familySlug}
          familyName={family.name}
          title="Hồ Sơ & Chứng Thư Dòng Họ"
          description="Lưu trữ nguồn gốc xuất xứ, nhà thờ tổ, câu đối gia huấn và các thông tin căn bản giới thiệu dòng họ."
          badge={
            <HeritageBadge variant="jade" className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" />
              <span>{visibilityLabel(family.visibility)}</span>
            </HeritageBadge>
          }
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {context.canManage ? (
            <HeritageFrame cornerColor="#8c1d1d">
              <form action={updateFamilyAction} className="space-y-5">
                <input type="hidden" name="family_id" value={family.id} />
                <div className="border-b border-[#deb887]/50 pb-3">
                  <h2
                    className="text-xl sm:text-2xl font-bold text-[#183b28]"
                    style={{
                      fontFamily:
                        '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                    }}
                  >
                    Cập nhật thông tin dòng họ
                  </h2>
                  <p className="mt-1 text-xs text-[#5c4a3e]">
                    Quản trị viên có thể cập nhật thông tin giới thiệu, nơi phát tích và huy hiệu dòng họ.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="block md:col-span-1">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#7a6455]">
                      Tên dòng họ <span className="text-[#8c1d1d]">*</span>
                    </span>
                    <input
                      name="name"
                      required
                      defaultValue={family.name}
                      className={inputClasses}
                    />
                  </label>

                  <label className="block md:col-span-1">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#7a6455]">
                      Đường dẫn (Slug)
                    </span>
                    <input
                      name="slug"
                      defaultValue={family.slug}
                      className={inputClasses}
                    />
                  </label>

                  <label className="block md:col-span-1">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#7a6455]">
                      Nơi phát tích / Khởi nguyên
                    </span>
                    <input
                      name="origin_location"
                      defaultValue={family.origin_location || ""}
                      placeholder="Ví dụ: Làng Cổ, Huyện..., Tỉnh..."
                      className={inputClasses}
                    />
                  </label>

                  <label className="block md:col-span-1">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#7a6455]">
                      Chế độ hiển thị hồ sơ
                    </span>
                    <select
                      name="visibility"
                      defaultValue={family.visibility}
                      className={inputClasses}
                    >
                      <option value="private">Riêng tư</option>
                      <option value="family_only">Chỉ trong dòng họ</option>
                      <option value="public">
                        Công khai phần giới thiệu (không công khai gia phả)
                      </option>
                    </select>
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#7a6455]">
                      Huy hiệu / Logo URL
                    </span>
                    <input
                      name="logo_url"
                      defaultValue={family.logo_url || ""}
                      placeholder="https://..."
                      className={inputClasses}
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#7a6455]">
                      Gia sử, Nguồn gốc & Giới thiệu dòng tộc
                    </span>
                    <textarea
                      name="description"
                      rows={6}
                      defaultValue={family.description || ""}
                      placeholder="Ghi chép về thủy tổ, nguồn gốc phát tích, nhà thờ họ, chi phái hoặc tôn chỉ gia tộc..."
                      className={`${inputClasses} resize-none leading-relaxed`}
                    />
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#8c1d1d] to-[#6e1616] text-white font-bold text-sm shadow-sm hover:from-[#6e1616] hover:to-[#500e0e] active:scale-95 transition-all"
                  >
                    Lưu thông tin dòng họ
                  </button>
                </div>
              </form>
            </HeritageFrame>
          ) : (
            <HeritageFrame cornerColor="#183b28">
              <div className="border-b border-[#deb887]/50 pb-3 mb-5">
                <h2
                  className="text-xl sm:text-2xl font-bold text-[#183b28]"
                  style={{
                    fontFamily:
                      '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                  }}
                >
                  Chứng thư thông tin dòng tộc
                </h2>
              </div>
              <div className="grid gap-4">
                <div className="rounded-xl border border-[#deb887]/60 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] p-4.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7a6455]">
                    Tên dòng họ
                  </p>
                  <p
                    className="mt-1 text-2xl font-bold text-[#8c1d1d]"
                    style={{
                      fontFamily:
                        '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                    }}
                  >
                    {family.name}
                  </p>
                </div>

                <div className="rounded-xl border border-[#deb887]/60 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] p-4.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7a6455]">
                    Nơi phát tích / Khởi nguyên
                  </p>
                  <p className="mt-1 text-base font-bold text-[#183b28]">
                    {family.origin_location || "Chưa cập nhật"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#deb887]/60 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] p-4.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7a6455]">
                    Gia sử & Lời tựa
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#5c4a3e] whitespace-pre-wrap">
                    {family.description || "Chưa có lời tựa gia sử."}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[#caa455] bg-[#fef8ea] p-4 text-xs font-semibold text-[#92540b]">
                * Quyền chỉnh sửa hồ sơ được cấp riêng cho Người phụ trách / Tộc trưởng dòng họ.
              </div>
            </HeritageFrame>
          )}

          <aside className="space-y-5">
            <Link
              href={`/dashboard/${familySlug}/trees`}
              className="group block rounded-2xl border-2 border-[#deb887]/80 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#caa455] hover:shadow-md"
            >
              <div className="size-11 rounded-xl bg-[#f5e7c7] text-[#8c1d1d] flex items-center justify-center mb-3.5 border border-[#deb887]/60">
                <FileText className="size-5" />
              </div>
              <h3
                className="text-lg font-bold text-[#183b28] group-hover:text-[#8c1d1d] transition-colors"
                style={{
                  fontFamily:
                    '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                }}
              >
                Hệ Thống Cây Gia Phả
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#5c4a3e]">
                Khởi tạo cây mới, thiết lập cây chính và tổ chức không gian các chi phái gia tộc.
              </p>
            </Link>

            <div className="rounded-2xl border-2 border-[#deb887]/80 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] p-5 shadow-xs">
              <div className="size-11 rounded-xl bg-[#eaf3ed] text-[#183b28] flex items-center justify-center mb-3.5 border border-[#a3c9b2]">
                <MapPin className="size-5" />
              </div>
              <h3
                className="text-lg font-bold text-[#183b28]"
                style={{
                  fontFamily:
                    '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                }}
              >
                Quy Định Bảo Mật Dòng Tộc
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#5c4a3e]">
                Người ngoài dòng họ không thể truy cập phả đồ, hồ sơ tiền nhân, tế tự và các tin tức nội bộ.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
