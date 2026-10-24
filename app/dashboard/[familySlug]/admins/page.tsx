import FamilyAdminRosterPanel, {
  FamilyAdminRosterRow,
} from "@/components/FamilyAdminRosterPanel";
import HeritagePageHeader from "@/components/dashboard/HeritagePageHeader";
import { HeritageBadge } from "@/components/dashboard/HeritageUI";
import {
  getFamilyContextBySlug,
  getProfile,
  getSupabase,
} from "@/utils/supabase/queries";
import { ShieldCheck, UserCheck } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string }>;
}

type AdminContactRow = {
  profile_id: string;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  is_primary_admin: boolean | null;
};

export const metadata = {
  title: "Người phụ trách dòng họ",
};

export default async function FamilyAdminsPage({ params }: PageProps) {
  const { familySlug } = await params;
  const context = await getFamilyContextBySlug(familySlug);
  if (!context) notFound();
  const profile = await getProfile();

  const supabase = await getSupabase();
  let rows: FamilyAdminRosterRow[] = [];
  let dataError: string | null = null;

  if (context.canManage) {
    const { data, error } = await supabase.rpc("get_family_membership_roster", {
      target_family_id: context.family.id,
    });

    if (error) {
      console.error("Cannot load family membership roster:", error);
      dataError = error.message;
    } else {
      rows = (data || []) as FamilyAdminRosterRow[];
    }
  } else {
    const { data, error } = await supabase.rpc("get_family_admin_contacts", {
      target_family_id: context.family.id,
    });

    if (error) {
      console.error("Cannot load family admin contacts:", error);
      dataError = error.message;
    } else {
      rows = ((data || []) as AdminContactRow[]).map((admin) => ({
        membership_id: null,
        profile_id: admin.profile_id,
        full_name: admin.full_name,
        email: admin.email,
        phone_number: admin.phone_number,
        role: "family_admin",
        status: "active",
        is_primary_admin: admin.is_primary_admin === true,
        platform_role: "member",
        is_active: true,
        joined_at: null,
      }));
    }
  }

  return (
    <div className="flex w-full flex-1 flex-col pb-16">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <HeritagePageHeader
          familySlug={familySlug}
          familyName={context.family.name}
          title="Người Phụ Trách & Tộc Biểu"
          description="Danh sách người chịu trách nhiệm gìn giữ phả đồ, duyệt thành viên, cập nhật thế thứ và đại diện liên lạc cho dòng họ."
          badge={
            <HeritageBadge variant="crimson" className="inline-flex items-center gap-1.5">
              <UserCheck className="size-3.5" />
              <span>Ban trị sự dòng họ</span>
            </HeritageBadge>
          }
        />

        {dataError ? (
          <section className="rounded-2xl border-2 border-[#8c1d1d] bg-[#fbeaea] p-6 text-[#8c1d1d] shadow-sm">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 size-5 shrink-0" />
              <div>
                <h1 className="text-lg font-bold">
                  Chưa tải được danh sách ban trị sự dòng họ
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm font-medium leading-relaxed">
                  {dataError}. Hãy kiểm tra cấu hình phân quyền quản trị trong hệ thống.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <FamilyAdminRosterPanel
            familyId={context.family.id}
            familySlug={context.family.slug}
            familyName={context.family.name}
            rows={rows}
            canManageAdmins={context.canManageAdmins}
            canReplacePrimary={context.isSystemAdmin}
            currentProfileId={profile?.id || ""}
            currentFullName={profile?.full_name || ""}
            currentPhoneNumber={profile?.phone_number || ""}
          />
        )}
      </main>
    </div>
  );
}
