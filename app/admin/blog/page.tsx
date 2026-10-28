import BlogAdminPanel from "@/components/BlogAdminPanel";
import AdminShell from "@/components/AdminShell";
import LogoutButton from "@/components/LogoutButton";
import AdminCrawlButton from "@/components/admin/AdminCrawlButton";
import { BlogPost } from "@/types";
import { getProfile, getSupabase, getUser } from "@/utils/supabase/queries";
import { Eye, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Quản trị bài viết hệ thống",
};

interface PageProps {
  searchParams?: Promise<{ edit?: string }>;
}

export default async function AdminBlogPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const user = await getUser();
  if (!user) redirect("/admin/login");

  const profile = await getProfile(user.id);
  if (
    profile?.is_active &&
    profile.role === "system_admin" &&
    profile.must_change_password
  ) {
    redirect("/admin/change-password");
  }

  if (!profile?.is_active || profile.role !== "system_admin") {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-3xl bg-white p-8 text-center shadow-[0_18px_50px_rgba(41,37,36,0.08)]">
          <div className="mx-auto mb-5 size-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <ShieldAlert className="size-8" />
          </div>
          <h1 className="text-2xl font-black text-stone-900">
            Không có quyền truy cập
          </h1>
          <p className="mt-3 text-sm text-stone-500">
            Chỉ Super Admin đang hoạt động mới có thể quản trị bài viết hệ thống.
          </p>
          <div className="mt-6 flex justify-center">
            <LogoutButton redirectTo="/admin/login" />
          </div>
        </div>
      </main>
    );
  }

  const supabase = await getSupabase();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("scope", "system")
    .order("created_at", { ascending: false });

  return (
    <AdminShell
      title="Bài viết hệ thống"
      description="Chỉ Super Admin được đăng bài lên trang chủ và trang tin tức công khai. Bài viết riêng của từng dòng họ nằm trong workspace dòng họ."
      action={
        <div className="flex flex-wrap items-center gap-3">
          <AdminCrawlButton />
          <Link
            href="/news"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#800000] shadow-sm transition-colors hover:bg-amber-50"
          >
            <Eye className="size-4" />
            Xem trang tin tức
          </Link>
        </div>
      }
    >
      <BlogAdminPanel
        key={resolvedSearchParams?.edit || "new"}
        posts={(posts || []) as BlogPost[]}
        initialEditId={resolvedSearchParams?.edit}
      />
    </AdminShell>
  );
}
