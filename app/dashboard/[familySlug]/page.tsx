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
  ArrowUpRight,
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
  tag?: string;
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
      title: "Cây Gia Phả",
      tag: "Phả đồ & Cội nguồn",
      description:
        "Xem danh sách, phả đồ cây, mindmap và biểu đồ bong bóng trong dòng họ.",
      href: treeHref("members"),
      icon: <Network className="size-6" />,
      iconBg: "bg-[#f5e7c7]",
      iconColor: "text-[#8c1d1d]",
    },
    {
      title: "Tra Danh Xưng",
      tag: "Gia lễ & Xưng hô",
      description: "Tính cách gọi chuẩn xác giữa hai thành viên theo tôn ti trật tự.",
      href: treeHref("kinship"),
      icon: <GitMerge className="size-6" />,
      iconBg: "bg-[#eaf3ed]",
      iconColor: "text-[#183b28]",
    },
    {
      title: "Bảng Vàng Thống Kê",
      tag: "Số liệu nhân đinh",
      description: "Tổng quan thành viên, phân bố thế hệ, tỷ lệ nam nữ và địa chi.",
      href: treeHref("stats"),
      icon: <BarChart2 className="size-6" />,
      iconBg: "bg-[#fef8ea]",
      iconColor: "text-[#92540b]",
    },
    {
      title: "Sự Kiện & Kỵ Nhật",
      tag: "Tế tự & Giỗ chạp",
      description: "Theo dõi ngày giỗ âm lịch, mừng thọ, sinh nhật và việc họ trọng đại.",
      href: treeHref("events"),
      icon: <CalendarDays className="size-6" />,
      iconBg: "bg-[#f5e7c7]",
      iconColor: "text-[#8c1d1d]",
    },
    {
      title: "Hồ Sơ & Gia Sử",
      tag: "Chứng thư dòng tộc",
      description:
        "Xem nguồn gốc phát tích, nhà thờ tổ, câu đối gia huấn và lời tựa.",
      href: `${base}/about`,
      icon: <FileText className="size-6" />,
      iconBg: "bg-[#eaf3ed]",
      iconColor: "text-[#183b28]",
    },
    {
      title: "Thông Tin & Chiếu Thư",
      tag: "Bảng tin nội bộ",
      description:
        "Đọc tin nội bộ, thông báo và ghi chép tế lễ chỉ dành cho thành viên.",
      href: `${base}/blog`,
      icon: <BookOpen className="size-6" />,
      iconBg: "bg-[#fef8ea]",
      iconColor: "text-[#92540b]",
    },
    {
      title: "Ban Trị Sự Dòng Họ",
      tag: "Hội đồng tộc biểu",
      description:
        "Danh sách Tộc trưởng và các vị phụ trách hỗ trợ vận hành gia phả.",
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
            title: "Quản Lý Cây Phả",
            tag: "Không gian phả hệ",
            description:
              "Tạo cây gia phả mới, đặt cây chính và chuẩn bị phạm vi nhập liệu.",
            href: `${base}/trees`,
            icon: <FolderTree className="size-6" />,
            iconBg: "bg-[#f5e7c7]",
            iconColor: "text-[#8c1d1d]",
          },
          {
            title: "Xét Duyệt Thành Viên",
            tag: "Ghi danh nhập tộc",
            description: "Duyệt hoặc từ chối người dùng xin tham gia vào dòng họ.",
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
            title: "Thứ Tự Phả Hệ",
            tag: "Định vị thứ bậc",
            description:
              "Tính thế hệ, thứ tự sinh và dâu/rể theo cây gia phả hiện tại.",
            href: treeHref("lineage"),
            icon: <Users className="size-6" />,
            iconBg: "bg-[#fef8ea]",
            iconColor: "text-[#92540b]",
          },
          {
            title: "Sao Lưu & Xuất Dữ Liệu",
            tag: "Bảo tồn an toàn",
            description:
              "Import/export dữ liệu Excel an toàn trong không gian riêng tư.",
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
      <BackgroundDecor subtle />
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Banner: Identity & Court Calendar */}
        <section className="mb-6">
          <div className="relative p-2 sm:p-2.5 border-2 border-[#caa455] bg-[#8c1d1d] shadow-[0_4px_20px_rgba(44,26,17,0.08)] rounded-none">
            <div className="relative border border-[#deb887] bg-[#fffdf7] p-6 sm:p-8 rounded-none">
              {/* 4 Traditional Corner Brackets */}
              <span className="pointer-events-none absolute top-2 left-2 size-3.5 border-t-2 border-l-2 border-[#8c1d1d]" />
              <span className="pointer-events-none absolute top-2 right-2 size-3.5 border-t-2 border-r-2 border-[#8c1d1d]" />
              <span className="pointer-events-none absolute bottom-2 left-2 size-3.5 border-b-2 border-l-2 border-[#8c1d1d]" />
              <span className="pointer-events-none absolute bottom-2 right-2 size-3.5 border-b-2 border-r-2 border-[#8c1d1d]" />

              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between relative z-10">
                <div className="flex-1 min-w-0">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-none border border-[#deb887] bg-[#f5e7c7]/60 px-3.5 py-1 text-xs font-black uppercase tracking-wide text-[#8c1d1d]">
                    <ShieldCheck className="size-3.5" />
                    Không gian riêng tư dòng họ
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#183b28] leading-tight">
                    {context.family.name}
                  </h1>
                  {context.family.description && (
                    <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-[#5c4a3e]">
                      {context.family.description}
                    </p>
                  )}
                </div>

                {/* Imperial Court Calendar Tablet */}
                <div className="rounded-none border-2 border-[#deb887] bg-gradient-to-br from-[#fffdf7] via-[#fbf7ed] to-[#f6eedf] p-4.5 sm:p-5 shadow-xs shrink-0 lg:w-76">
                  <div className="flex items-center justify-between border-b border-[#deb887]/50 pb-2 mb-2.5">
                    <p className="text-xs font-black uppercase tracking-wider text-[#8c1d1d]">
                      Thời khắc gia tộc
                    </p>
                    <HeritageBadge variant="amber" className="text-[10px] px-2 py-0.5 rounded-none">
                      Hôm nay
                    </HeritageBadge>
                  </div>
                  <p className="text-base sm:text-lg font-bold text-[#183b28] capitalize">
                    {formatDate(today)}
                  </p>
                  <div className="mt-2.5 pt-2.5 border-t border-[#deb887]/40 space-y-1">
                    <p className="text-xs font-semibold text-[#7a6455] flex items-center justify-between">
                      <span>Âm lịch:</span>
                      <span className="font-bold text-[#8c1d1d]">
                        {lunar.lunarDayStr}
                      </span>
                    </p>
                    <p className="text-xs font-semibold text-[#7a6455] flex items-center justify-between">
                      <span>Năm:</span>
                      <span className="font-bold text-[#183b28]">
                        {lunar.lunarYear}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Heritage Stat Cards */}
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
                <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[#183b28]">
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
                    className="rounded-xl border-2 border-[#deb887]/70 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] p-4 shadow-xs"
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
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#deb887]/50 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-[#8c1d1d]" />
              <h2 className="text-2xl font-bold tracking-tight text-[#183b28]">
                Chức Năng Gia Phả
              </h2>
            </div>
            <HeritageBadge variant="amber">
              {features.length} chức năng phả hệ
            </HeritageBadge>
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
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#deb887]/50 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-[#183b28]" />
                <h2 className="text-2xl font-bold tracking-tight text-[#183b28]">
                  Nghiệp Vụ Quản Trị
                </h2>
              </div>
              <HeritageBadge variant="crimson">Công cụ phụ trách</HeritageBadge>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {adminFeatures.map((feature) => (
                <FeatureCard key={feature.href} feature={feature} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Events Section (Framed with Heritage Frame) */}
        {upcomingEvents.length > 0 && (
          <section className="mb-8">
            <HeritageFrame cornerColor="#8c1d1d">
              <div className="mb-4 flex items-center justify-between border-b border-[#deb887]/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="size-5 text-[#8c1d1d]" />
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#183b28]">
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
                    className="group relative rounded-2xl border-2 border-[#deb887]/80 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] p-4.5 shadow-xs transition-all hover:border-[#caa455] hover:shadow-sm"
                  >
                    <span className="pointer-events-none absolute top-1.5 right-1.5 size-2 border-t-2 border-r-2 border-[#deb887] opacity-60 group-hover:border-[#8c1d1d] group-hover:opacity-100 transition-colors" />
                    <p className="font-bold text-base text-[#183b28] group-hover:text-[#8c1d1d] transition-colors">
                      {event.personName}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#7a6455]">
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
            </HeritageFrame>
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
      className="group relative flex flex-col justify-between rounded-2xl border-2 border-[#deb887]/80 bg-gradient-to-br from-[#fffdf7] via-[#fdfbf6] to-[#f6eedf] p-5 shadow-[0_4px_16px_rgba(44,26,17,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#8c1d1d] hover:shadow-[0_14px_30px_rgba(140,29,29,0.12)] overflow-hidden"
    >
      {/* 4 Traditional Corner Brackets with hover animation */}
      <span className="pointer-events-none absolute top-2 left-2 size-2.5 border-t-2 border-l-2 border-[#caa455] opacity-60 transition-all duration-300 group-hover:border-[#8c1d1d] group-hover:opacity-100 group-hover:size-3" />
      <span className="pointer-events-none absolute top-2 right-2 size-2.5 border-t-2 border-r-2 border-[#caa455] opacity-60 transition-all duration-300 group-hover:border-[#8c1d1d] group-hover:opacity-100 group-hover:size-3" />
      <span className="pointer-events-none absolute bottom-2 left-2 size-2.5 border-b-2 border-l-2 border-[#caa455] opacity-60 transition-all duration-300 group-hover:border-[#8c1d1d] group-hover:opacity-100 group-hover:size-3" />
      <span className="pointer-events-none absolute bottom-2 right-2 size-2.5 border-b-2 border-r-2 border-[#caa455] opacity-60 transition-all duration-300 group-hover:border-[#8c1d1d] group-hover:opacity-100 group-hover:size-3" />

      {/* Decorative subtle background aura on hover */}
      <div className="pointer-events-none absolute -top-12 -right-12 size-32 rounded-full bg-[#caa455]/10 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Top Header Row with Icon & Tag */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex size-12 items-center justify-center rounded-2xl border-2 border-[#deb887]/70 ${feature.iconBg} ${feature.iconColor} shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:border-[#caa455] group-hover:shadow-sm`}
          >
            {feature.icon}
          </div>
          {feature.tag && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#92540b] bg-[#fef8ea] border border-[#e8ce8a] px-2.5 py-0.5 rounded-full shadow-2xs">
              {feature.tag}
            </span>
          )}
        </div>

        {/* Title: Using a crisp, dignified, easily readable typography */}
        <h3 className="text-lg font-bold tracking-tight text-[#183b28] transition-colors duration-200 group-hover:text-[#8c1d1d]">
          {feature.title}
        </h3>

        {/* Description: High readability, warm tone */}
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#5c4a3e]">
          {feature.description}
        </p>
      </div>

      {/* Interactive Bottom Action Bar */}
      <div className="relative z-10 mt-5 pt-3 border-t border-[#deb887]/40 flex items-center justify-between text-xs font-bold text-[#7a6455] group-hover:text-[#8c1d1d] transition-colors duration-200">
        <span className="inline-flex items-center gap-1 font-semibold">
          Khám phá
        </span>
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
