import AdminShell from "@/components/AdminShell";
import MediaLibrary from "@/components/MediaLibrary";
import { getProfile } from "@/utils/supabase/queries";
import { listMediaAction } from "@/app/actions/storage";
import { redirect } from "next/navigation";
import { Image as ImageIcon } from "lucide-react";

export const metadata = {
  title: "Quản lý Kho ảnh & Media",
};

export default async function AdminMediaPage() {
  const profile = await getProfile();
  if (!profile || !profile.is_active || profile.role !== "system_admin") {
    redirect("/admin/login");
  }

  const mediaRes = await listMediaAction();
  const initialFiles = mediaRes.success ? mediaRes.files : [];

  return (
    <AdminShell
      title="Kho Lưu Trữ Ảnh & Media (Cloudflare R2)"
      description="Quản lý toàn bộ tệp tin đa phương tiện của tất cả các dòng họ trên hệ thống."

    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-[#deb887]/80 bg-[#fffdf7] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#deb887]/40">
            <div className="p-2.5 rounded-xl bg-[#8c1d1d]/10 text-[#8c1d1d]">
              <ImageIcon className="size-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#183b28] uppercase tracking-wide">
                Thư Viện Ảnh Toàn Hệ Thống
              </h2>
              <p className="text-xs text-[#5c4a3e]">
                Xem, tra cứu, sao chép URL và xóa các tệp tin lưu trữ trên Cloudflare R2 / Supabase Storage.
              </p>
            </div>
          </div>

          <MediaLibrary canManage={true} initialFiles={initialFiles} />
        </div>
      </div>
    </AdminShell>
  );
}
