import FamilyQrCard from "@/components/FamilyQrCard";
import BackgroundDecor from "@/components/landing/BackgroundDecor";
import {
  HeritageBadge,
  HeritageFrame,
  HeritageStatCard,
} from "@/components/dashboard/HeritageUI";
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
  iconBg: string;
  iconColor: string;
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
  const [personsRes, relationshipsRes, eventsRes, adminContactsRes] =
    await Promise.all([
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
      description:
        "Xem danh sách, cây, mindmap và bubble map trong đúng dòng họ.",
      href: treeHref("members"),
      icon: <Network className="size-6" />,
      iconBg: "bg-[#f5e7c7]",
      iconColor: "text-[#8c1d1d]",
    },
    {
      title: "Tra danh xưng",
      description: "Tính cách gọi giữa hai thành viên trong cây hiện tại.",
      href: treeHref("kinship"),
      icon: <GitMerge className="size-6" />,
      iconBg: "bg-[#eaf3ed]",
      iconColor: "text-[#183b28]",
    },
    {
      title: "Thống kê",
      description: "Tổng quan thành viên, thế hệ và quan hệ trong dòng họ.",
      href: treeHref("stats"),
      icon: <BarChart2 className="size-6" />,
      iconBg: "bg-[#fef8ea]",
      iconColor: "text-[#92540b]",
    },
    {
      title: "Sự kiện",
      description: "Sinh nhật, ngày giỗ và sự kiện nội bộ của dòng họ.",
      href: treeHref("events"),
      icon: <CalendarDays className="size-6" />,
      iconBg: "bg-[#f5e7c7]",
      iconColor: "text-[#8c1d1d]",
    },
    {
      title: "Hồ sơ dòng họ",
      description:
        "Xem nguồn gốc, mô tả và thông tin giới thiệu riêng của dòng họ.",
      href: `${base}/about`,
      icon: <FileText className="size-6" />,
      iconBg: "bg-[#eaf3ed]",
      iconColor: "text-[#183b28]",
    },
    {
      title: "Thông tin dòng họ",
      description:
        "Đọc tin nội bộ, thông báo và ghi chép chỉ dành cho thành viên.",
      href: `${base}/blog`,
      icon: <BookOpen className="size-6" />,
      iconBg: "bg-[#fef8ea]",
      iconColor: "text-[#92540b]",
    },
    {
      title: "Người phụ trách",
      description:
        "Xem danh sách người phụ trách dòng họ; Phụ trách chính có thể thêm hoặc bớt người hỗ trợ.",
      href: `${base}/admins`,
      icon: <UserCog className="size-6" />,
      iconBg: "bg-[#f5e7c7]",
      iconColor: "text-[#8c1d1d]",
    },
  ];

  const adminFeatures: Feature[] = [
    ...(context.canManage
      ? [
          {
            title: "Quản lý cây",
            description:
              "Tạo cây gia phả, đặt cây chính và chuẩn bị phạm vi nhập liệu.",
            href: `${base}/trees`,
            icon: <FolderTree className="size-6" />,
            iconBg: "bg-[#f5e7c7]",
            iconColor: "text-[#8c1d1d]",
          },
          {
            title: "Yêu cầu tham gia",
            description: "Duyệt hoặc từ chối người dùng xin tham gia dòng họ.",
            href: `${base}/requests`,
            icon: <UserPlus className="size-6" />,
            iconBg: "bg-[#eaf3ed]",
            iconColor: "text-[#183b28]",
          },
        ]
      : []),
    ...(context.canEdit
      ? [
          {
            title: "Thứ tự gia phả",
            description:
              "Tính thế hệ, thứ tự sinh và dâu/rể theo cây hiện tại.",
            href: treeHref("lineage"),
            icon: <Users className="size-6" />,
            iconBg: "bg-[#fef8ea]",
            iconColor: "text-[#92540b]",
          },
          {
            title: "Sao lưu riêng tư",
            description:
              "Import/export chỉ trong family_id và tree_id hiện tại.",
            href: treeHref("data"),
            icon: <Database className="size-6" />,
            iconBg: "bg-[#f5e7c7]",
            iconColor: "text-[#8c1d1d]",
          },
        ]
      : []),
  ];

  return (
    <div className="relative flex-1 w-full overflow-hidden">
      <BackgroundDecor withMid />
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Banner: Identity & Court Calendar framed cleanly */}
      <section className="mb-6">
        <HeritageFrame innerClassName="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#deb887] bg-[#f5e7c7]/60 px-3.5 py-1 text-xs font-black uppercase tracking-wide text-[#8c1d1d]">
                <ShieldCheck className="size-3.5" />
                Không gian riêng tư
              </div>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#183b28] leading-tight"
                style={{
                  fontFamily:
                    '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                }}
              >
                {context.family.name}
              </h1>
              {context.family.description && (
                <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-[#5c4a3e]">
                  {context.family.description}
                </p>
              )}
            </div>

            {/* Imperial Court Calendar Tablet */}
            <div className="rounded-2xl border border-[#deb887] bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] p-4 sm:p-5 shadow-xs shrink-0 lg:w-72">
              <p className="text-xs font-black uppercase tracking-wider text-[#8c1d1d]">
                Thời khắc gia tộc
              </p>
              <p className="mt-1.5 text-base sm:text-lg font-bold text-[#183b28] capitalize">
                {formatDate(today)}
              </p>
              <div className="mt-2.5 pt-2.5 border-t border-[#deb887]/50">
                <p className="text-xs font-semibold text-[#7a6455]">
                  Âm lịch:{" "}
                  <span className="font-bold text-[#8c1d1d]">
                    {lunar.lunarDayStr}
                  </span>
                </p>
                <p className="text-xs font-semibold text-[#7a6455] mt-0.5">
                  Năm:{" "}
                  <span className="font-bold text-[#183b28]">
                    {lunar.lunarYear}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </HeritageFrame>
      </section>

      {/* 3 Heritage Stat Cards (Framed inside each card) */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <HeritageStatCard
          title="Thành viên"
          value={persons.length.toLocaleString("vi-VN")}
          icon={<Users className="size-5" />}
          subtext="Đã ghi chép trong cây"
        />
        <HeritageStatCard
          title="Mối quan hệ"
          value={relationships.length.toLocaleString("vi-VN")}
          icon={<GitMerge className="size-5" />}
          subtext="Huyết thống & hôn phối"
        />
        <HeritageStatCard
          title="Sự kiện 30 ngày"
          value={upcomingEvents.length.toLocaleString("vi-VN")}
          icon={<CalendarDays className="size-5" />}
          subtext="Giỗ chạp & ngày kỷ niệm"
        />
      </section>

      {/* Admin Contacts Section */}
      <section className="mb-8">
        <HeritageFrame innerClassName="p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#deb887]/50 pb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8c1d1d]">
                Danh bạ phụ trách
              </p>
              <h2
                className="mt-1 text-xl sm:text-2xl font-bold text-[#183b28]"
                style={{
                  fontFamily:
                    '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                }}
              >
                Người phụ trách dòng họ
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <HeritageBadge variant="amber">
                {adminContacts.length} người phụ trách
              </HeritageBadge>
              <Link
                href={`${base}/admins`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#deb887] bg-[#fffdf7] px-4 py-2 text-xs sm:text-sm font-black text-[#5c4a3e] shadow-xs transition hover:bg-[#f5e7c7]/60 hover:text-[#8c1d1d]"
              >
                <UserCog className="size-4 text-[#8c1d1d]" />
                Xem ban phụ trách
              </Link>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {adminContacts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#deb887] bg-[#fffdf7] px-4 py-3 text-sm font-semibold text-[#7a6455]">
                Chưa có người phụ trách.
              </div>
            ) : (
              adminContacts.map((admin) => (
                <div
                  key={admin.profile_id}
                  className="rounded-xl border border-[#deb887]/50 bg-[#fffdf7] p-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-bold text-base text-[#183b28]">
                      {admin.full_name || "Người phụ trách"}
                    </p>
                    <HeritageBadge
                      variant={admin.is_primary_admin ? "crimson" : "jade"}
                    >
                      {admin.is_primary_admin
                        ? "Phụ trách chính"
                        : "Phụ trách phụ"}
                    </HeritageBadge>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs sm:text-sm">
                    {admin.email && (
                      <a
                        href={`mailto:${admin.email}`}
                        className="flex max-w-full items-center gap-2 font-medium text-[#5c4a3e] hover:text-[#8c1d1d]"
                      >
                        <Mail className="size-3.5 shrink-0 text-[#deb887]" />
                        <span className="truncate">{admin.email}</span>
                      </a>
                    )}
                    {admin.phone_number && (
                      <p className="flex items-center gap-2 font-medium text-[#7a6455]">
                        <Phone className="size-3.5 shrink-0 text-[#deb887]" />
                        {admin.phone_number}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </HeritageFrame>
      </section>

      {/* QR Card if Editor/Admin */}
      {context.canEdit && (
        <section className="mb-8">
          <FamilyQrCard
            familyName={context.family.name}
            treeName={context.tree.name}
            url={qrUrl}
          />
        </section>
      )}

      {/* Main Features Grid */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="text-2xl font-bold text-[#183b28]"
            style={{
              fontFamily:
                '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
            }}
          >
            Chức năng gia phả
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.href} feature={feature} />
          ))}
        </div>
      </section>

      {/* Admin Features Section */}
      {adminFeatures.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="text-2xl font-bold text-[#183b28]"
              style={{
                fontFamily:
                  '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
              }}
            >
              Nghiệp vụ dòng họ
            </h2>
            <HeritageBadge variant="crimson">Công cụ phụ trách</HeritageBadge>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {adminFeatures.map((feature) => (
              <FeatureCard key={feature.href} feature={feature} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Events Section (Framed INSIDE each event item) */}
      {upcomingEvents.length > 0 && (
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between border-b border-[#deb887]/50 pb-3">
            <div className="flex items-center gap-2.5">
              <CalendarDays className="size-5 text-[#8c1d1d]" />
              <h2
                className="text-xl sm:text-2xl font-bold text-[#183b28]"
                style={{
                  fontFamily:
                    '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
                }}
              >
                Sự kiện & Giỗ chạp sắp tới (30 ngày)
              </h2>
            </div>
            <HeritageBadge variant="amber">
              {upcomingEvents.length} sự kiện
            </HeritageBadge>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {upcomingEvents.map((event, index) => (
              <div
                key={`${event.personId || "event"}-${index}`}
                className="rounded-xl border border-[#deb887]/70 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] p-4 shadow-xs"
              >
                <p className="font-bold text-base text-[#183b28]">
                  {event.personName}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#7a6455]">
                    {event.content || "Ngày kỵ nhật"}
                  </span>
                  <HeritageBadge
                    variant={event.daysUntil === 0 ? "crimson" : "amber"}
                  >
                    {event.daysUntil === 0
                      ? "Hôm nay"
                      : `${event.daysUntil} ngày nữa`}
                  </HeritageBadge>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
    </div>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <Link
      href={feature.href}
      className="group relative block rounded-2xl border-2 border-[#deb887]/80 bg-[#fffdf7] p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#caa455] hover:shadow-md"
    >
      {/* Subtle corner marker */}
      <span className="pointer-events-none absolute top-2 right-2 size-2 border-t-2 border-r-2 border-[#deb887] opacity-60 transition-colors group-hover:border-[#8c1d1d] group-hover:opacity-100" />

      <div
        className={`mb-4 flex size-12 items-center justify-center rounded-xl border border-[#deb887]/50 ${feature.iconBg} ${feature.iconColor} shadow-xs transition-transform duration-200 group-hover:scale-105`}
      >
        {feature.icon}
      </div>
      <h3
        className="text-lg font-bold text-[#183b28] transition-colors group-hover:text-[#8c1d1d]"
        style={{
          fontFamily:
            '"SVN-Studio Brush", "Playfair Display", Georgia, serif',
        }}
      >
        {feature.title}
      </h3>
      <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#5c4a3e]">
        {feature.description}
      </p>
    </Link>
  );
}
