import { updateFamilyAction } from "@/app/actions/family";
import { getFamilyContextBySlug } from "@/utils/supabase/queries";
import { ArrowLeft, FileText, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string }>;
}

function visibilityLabel(value: string) {
  if (value === "family_only") return "Chỉ trong dòng họ";
  if (value === "public") return "Công khai phần giới thiệu";
  return "Riêng tư";
}

export default async function FamilyAboutPage({ params }: PageProps) {
  const { familySlug } = await params;
  const context = await getFamilyContextBySlug(familySlug);
  if (!context) notFound();

  const family = context.family;

  return (
    <main className="flex w-full flex-1 flex-col bg-stone-50/50">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href={`/dashboard/${familySlug}`}
              className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-stone-500 transition-colors hover:text-[#800000]"
            >
              <ArrowLeft className="size-4" />
              Quay về dashboard dòng họ
            </Link>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-600">
              Hồ sơ dòng họ
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
              {family.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Thông tin giới thiệu này thuộc không gian riêng của dòng họ. Dữ
              liệu cây gia phả, hồ sơ tổ tiên và sự kiện vẫn chỉ mở cho thành
              viên active trong đúng dòng họ.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
            <ShieldCheck className="size-4" />
            {visibilityLabel(family.visibility)}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {context.canManage ? (
            <form
              action={updateFamilyAction}
              className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7"
            >
              <input type="hidden" name="family_id" value={family.id} />
              <div className="mb-6">
                <h2 className="text-xl font-black text-stone-900">
                  Cập nhật thông tin dòng họ
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Admin dòng họ có thể cập nhật phần giới thiệu, nơi khởi
                  nguyên và hình ảnh nhận diện. Thao tác này không công khai dữ
                  liệu gia phả.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block md:col-span-1">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Tên dòng họ
                  </span>
                  <input
                    name="name"
                    required
                    defaultValue={family.name}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>

                <label className="block md:col-span-1">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Slug
                  </span>
                  <input
                    name="slug"
                    defaultValue={family.slug}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>

                <label className="block md:col-span-1">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Nơi khởi nguyên
                  </span>
                  <input
                    name="origin_location"
                    defaultValue={family.origin_location || ""}
                    placeholder="Ví dụ: Hà Nội, Nam Định..."
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>

                <label className="block md:col-span-1">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Chế độ hiển thị hồ sơ
                  </span>
                  <select
                    name="visibility"
                    defaultValue={family.visibility}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  >
                    <option value="private">Riêng tư</option>
                    <option value="family_only">Chỉ trong dòng họ</option>
                    <option value="public">
                      Công khai phần giới thiệu, không công khai gia phả
                    </option>
                  </select>
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Logo hoặc ảnh đại diện
                  </span>
                  <input
                    name="logo_url"
                    defaultValue={family.logo_url || ""}
                    placeholder="Dán URL ảnh nếu đã có"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Mô tả
                  </span>
                  <textarea
                    name="description"
                    rows={5}
                    defaultValue={family.description || ""}
                    placeholder="Ghi chú về nguồn gốc, nhà thờ họ, chi phái hoặc định hướng số hóa gia phả."
                    className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>
              </div>

              <button type="submit" className="btn-primary mt-6">
                Lưu thông tin dòng họ
              </button>
            </form>
          ) : (
            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-stone-900">
                Thông tin dòng họ
              </h2>
              <div className="mt-5 grid gap-4">
                <div className="rounded-2xl bg-stone-50 p-4">
                  <p className="text-xs font-black uppercase text-stone-400">
                    Tên dòng họ
                  </p>
                  <p className="mt-1 text-lg font-black text-stone-900">
                    {family.name}
                  </p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4">
                  <p className="text-xs font-black uppercase text-stone-400">
                    Nơi khởi nguyên
                  </p>
                  <p className="mt-1 text-sm font-bold text-stone-700">
                    {family.origin_location || "Chưa cập nhật"}
                  </p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-4">
                  <p className="text-xs font-black uppercase text-stone-400">
                    Mô tả
                  </p>
                  <p className="mt-1 text-sm leading-6 text-stone-600">
                    {family.description || "Chưa có mô tả."}
                  </p>
                </div>
              </div>
              <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800">
                Chỉ Admin dòng họ active của đúng dòng họ mới được chỉnh sửa hồ
                sơ này.
              </p>
            </section>
          )}

          <aside className="space-y-4">
            <Link
              href={`/dashboard/${familySlug}/trees`}
              className="block rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition-colors hover:border-amber-200 hover:bg-amber-50/40"
            >
              <FileText className="mb-4 size-7 text-amber-600" />
              <h2 className="text-lg font-black text-stone-900">
                Cây gia phả
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Tạo cây mới, đặt cây chính và kiểm soát không gian nhập liệu
                gia phả.
              </p>
            </Link>

            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
              <MapPin className="mb-4 size-7 text-emerald-600" />
              <h2 className="text-lg font-black text-stone-900">
                Phạm vi truy cập
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Thành viên ngoài dòng họ không thể xem cây, hồ sơ tổ tiên, sự
                kiện hoặc blog nội bộ của dòng họ này.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
