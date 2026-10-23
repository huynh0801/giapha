import FamilyQrCard from "@/components/FamilyQrCard";
import { getTodayLunar } from "@/utils/dateHelpers";
import { computeEvents } from "@/utils/eventHelpers";
import { getFamilyContextBySlug, getSupabase } from "@/utils/supabase/queries";
import {
  BarChart2,
  BookOpen,
  CalendarDays,
  Database,
  FileText,
  FolderTree,
  GitMerge,
  Mail,
  Network,
  Phone,
  ShieldCheck,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

interface PageProps {
  params: Promise<{ familySlug: string }>;
  searchParams?: Promise<{ treeId?: string }>;
}

type Feature = {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
};

type FamilyAdminContact = {
  profile_id: string;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  is_primary_admin: boolean | null;
};

function getVietnamDate() {
  const now = new Date();
  const vnTimeStr = now.toLocaleString("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
  return new Date(vnTimeStr);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getSiteOrigin(requestHeaders: Headers) {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configuredOrigin) return configuredOrigin;

  const host =
    requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
  if (!host) return "http://localhost:3000";

  const protocol =
    requestHeaders.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}

export default async function FamilyDashboardPage({
  params,
  searchParams,
}: PageProps) {
  const [{ familySlug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const context = await getFamilyContextBySlug(
    familySlug,
    resolvedSearchParams?.treeId,
  );
  if (!context) notFound();

  const supabase = await getSupabase();
  const [personsRes, relationshipsRes, eventsRes, adminContactsRes] = await Promise.all([
    supabase
      .from("persons")
      .select(
        "id, full_name, birth_year, birth_month, birth_day, death_year, death_month, death_day, death_lunar_year, death_lunar_month, death_lunar_day, is_deceased",
      )
      .eq("family_id", context.family.id)
      .eq("tree_id", context.tree.id),
    supabase
      .from("relationships")
      .select("id")
      .eq("family_id", context.family.id)
      .eq("tree_id", context.tree.id),
    supabase
      .from("custom_events")
      .select("id, name, content, event_date, location, created_by")
      .eq("family_id", context.family.id)
      .eq("tree_id", context.tree.id),
    supabase.rpc("get_family_admin_contacts", {
      target_family_id: context.family.id,
    }),
  ]);

  const persons = personsRes.data || [];
  const relationships = relationshipsRes.data || [];
  const customEvents = eventsRes.data || [];
  const adminContacts = (adminContactsRes.data || []) as FamilyAdminContact[];
  const upcomingEvents = computeEvents(persons, customEvents)
    .filter((event) => event.daysUntil >= 0 && event.daysUntil <= 30)
    .slice(0, 3);
  const lunar = getTodayLunar();
  const today = getVietnamDate();
  const requestHeaders = await headers();

  const base = `/dashboard/${familySlug}`;
  const treeQuery = `?treeId=${context.tree.id}`;
  const treeHref = (path: string) => `${base}/${path}${treeQuery}`;
  const qrPath = `/dashboard/families/${familySlug}`;
  const qrUrl = new URL(qrPath, getSiteOrigin(requestHeaders)).toString();
  const features: Feature[] = [
    {
      title: "Cây gia phả",
      description: "Xem danh sách, cây, mindmap và bubble map trong đúng dòng họ.",
      href: treeHref("members"),
      icon: <Network className="size-7 text-amber-600" />,
    },
    {
      title: "Tra danh xưng",
      description: "Tính cách gọi giữa hai thành viên trong cây hiện tại.",
      href: treeHref("kinship"),
      icon: <GitMerge className="size-7 text-blue-600" />,
    },
    {
      title: "Thống kê",
      description: "Tổng quan thành viên, thế hệ và quan hệ trong dòng họ.",
      href: treeHref("stats"),
      icon: <BarChart2 className="size-7 text-purple-600" />,
    },
    {
      title: "Sự kiện",
      description: "Sinh nhật, ngày giỗ và sự kiện nội bộ của dòng họ.",
      href: treeHref("events"),
      icon: <CalendarDays className="size-7 text-emerald-600" />,
    },
    {
      title: "Hồ sơ dòng họ",
      description: "Xem nguồn gốc, mô tả và thông tin giới thiệu riêng của dòng họ.",
      href: `${base}/about`,
      icon: <FileText className="size-7 text-rose-600" />,
    },
    {
      title: "Thông tin dòng họ",
      description: "Đọc tin nội bộ, thông báo và ghi chép chỉ dành cho thành viên.",
      href: `${base}/blog`,
      icon: <BookOpen className="size-7 text-orange-600" />,
    },
    {
      title: "Quản trị viên",
      description:
        "Xem người phụ trách dòng họ; Quản trị chính có thể thêm hoặc bỏ Quản trị phụ.",
      href: `${base}/admins`,
      icon: <UserCog className="size-7 text-emerald-700" />,
    },
  ];

  const adminFeatures: Feature[] = [
    ...(context.canManage
      ? [
          {
            title: "Quản lý cây",
            description: "Tạo cây gia phả, đặt cây chính và chuẩn bị phạm vi nhập liệu.",
            href: `${base}/trees`,
            icon: <FolderTree className="size-7 text-amber-700" />,
          },
          {
            title: "Yêu cầu tham gia",
            description: "Duyệt hoặc từ chối người dùng xin tham gia dòng họ.",
            href: `${base}/requests`,
            icon: <UserPlus className="size-7 text-emerald-600" />,
          },
        ]
      : []),
    ...(context.canEdit
      ? [
        {
          title: "Thứ tự gia phả",
          description: "Tính thế hệ, thứ tự sinh và dâu/rể theo cây hiện tại.",
          href: treeHref("lineage"),
          icon: <Users className="size-7 text-indigo-600" />,
        },
        {
          title: "Sao lưu riêng tư",
          description: "Import/export chỉ trong family_id và tree_id hiện tại.",
          href: treeHref("data"),
          icon: <Database className="size-7 text-teal-600" />,
        },
      ]
      : []),
  ];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-700">
              <ShieldCheck className="size-4" />
              Không gian riêng tư
            </div>
            <h1 className="text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
              {context.family.name}
            </h1>
            {context.family.description && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
                {context.family.description}
              </p>
            )}
          </div>

          <div className="rounded-xl bg-stone-50 px-4 py-3">
            <p className="text-sm font-black text-stone-800">
              {formatDate(today)}
            </p>
            <p className="mt-1 text-xs font-semibold text-stone-500">
              Âm lịch: {lunar.lunarDayStr} - Năm {lunar.lunarYear}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-stone-50 p-4">
            <p className="text-xs font-black uppercase text-stone-400">
              Thành viên
            </p>
            <p className="mt-1 text-3xl font-black text-stone-950">
              {persons.length}
            </p>
          </div>
          <div className="rounded-xl bg-stone-50 p-4">
            <p className="text-xs font-black uppercase text-stone-400">
              Quan hệ
            </p>
            <p className="mt-1 text-3xl font-black text-stone-950">
              {relationships.length}
            </p>
          </div>
          <div className="rounded-xl bg-stone-50 p-4">
            <p className="text-xs font-black uppercase text-stone-400">
              Sự kiện 30 ngày
            </p>
            <p className="mt-1 text-3xl font-black text-stone-950">
              {upcomingEvents.length}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                Danh sách quản trị viên
              </p>
              <h2 className="mt-1 text-lg font-black text-stone-950">
                Người phụ trách dòng họ
              </h2>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#800000] shadow-sm">
              {adminContacts.length} admin
            </span>
          </div>
          <div className="mt-3">
            <Link
              href={`${base}/admins`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-black text-stone-800 shadow-sm transition hover:border-amber-300 hover:text-[#800000]"
            >
              <UserCog className="size-4" />
              Mở quản trị viên
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {adminContacts.length === 0 ? (
              <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-stone-500">
                Chưa có quản trị viên active.
              </div>
            ) : (
              adminContacts.map((admin) => (
                <div
                  key={admin.profile_id}
                  className="rounded-xl bg-white px-4 py-3 shadow-sm"
                >
                  <p className="font-black text-stone-950">
                    {admin.full_name || "Admin dòng họ"}
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black ${
                      admin.is_primary_admin
                        ? "bg-[#800000] text-white"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {admin.is_primary_admin
                      ? "Quản trị chính"
                      : "Quản trị phụ"}
                  </span>
                  {admin.email && (
                    <a
                      href={`mailto:${admin.email}`}
                      className="mt-2 inline-flex max-w-full items-center gap-2 text-sm font-semibold text-stone-600 hover:text-[#800000]"
                    >
                      <Mail className="size-4 shrink-0" />
                      <span className="truncate">{admin.email}</span>
                    </a>
                  )}
                  {admin.phone_number && (
                    <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-stone-500">
                      <Phone className="size-4 shrink-0" />
                      {admin.phone_number}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {context.canEdit && (
          <div className="mt-6">
            <FamilyQrCard
              familyName={context.family.name}
              treeName={context.tree.name}
              url={qrUrl}
            />
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <FeatureCard key={feature.href} feature={feature} />
        ))}
      </div>

      {adminFeatures.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-black text-stone-900">
            Quản trị dòng họ
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {adminFeatures.map((feature) => (
              <FeatureCard key={feature.href} feature={feature} />
            ))}
          </div>
        </section>
      )}

      {upcomingEvents.length > 0 && (
        <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-stone-900">
            Sự kiện sắp tới
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {upcomingEvents.map((event, index) => (
              <div
                key={`${event.personId || "event"}-${index}`}
                className="rounded-xl bg-amber-50 p-4"
              >
                <p className="font-black text-amber-900">{event.personName}</p>
                <p className="mt-1 text-xs font-semibold text-amber-700">
                  {event.daysUntil === 0 ? "Hôm nay" : `${event.daysUntil} ngày nữa`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <Link
      href={feature.href}
      className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md"
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-stone-50">
        {feature.icon}
      </div>
      <h2 className="text-lg font-black text-stone-900 group-hover:text-amber-800">
        {feature.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-stone-500">
        {feature.description}
      </p>
    </Link>
  );
}
