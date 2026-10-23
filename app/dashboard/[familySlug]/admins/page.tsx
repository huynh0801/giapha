import FamilyAdminRosterPanel, {
  FamilyAdminRosterRow,
} from "@/components/FamilyAdminRosterPanel";
import {
  getFamilyContextBySlug,
  getProfile,
  getSupabase,
} from "@/utils/supabase/queries";
import { ShieldCheck } from "lucide-react";
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
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      {dataError ? (
        <section className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-red-900 shadow-sm">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0" />
            <div>
              <h1 className="text-xl font-black">
                Chưa tải được danh sách quản trị viên
              </h1>
              <p className="mt-2 text-sm font-semibold leading-6 text-red-700">
                {dataError}. Hãy chạy migration phân quyền quản trị chính/phụ,
                sau đó refresh lại trang.
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
  );
}
