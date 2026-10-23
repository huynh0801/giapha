"use client";

import {
  deleteFamilyAction,
  replaceFamilyAdminAction,
} from "@/app/actions/family";
import { setUserFamilyMembership } from "@/app/actions/user";
import {
  AdminUserData,
  FamilyRole,
  FamilyStatus,
  MembershipStatus,
  PlatformRole,
  Visibility,
} from "@/types";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Crown,
  Loader2,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

export type AdminFamilyMembershipData = {
  id: string;
  profile_id: string;
  role: FamilyRole;
  status: MembershipStatus;
  is_primary_admin: boolean;
  joined_at: string | null;
  profile_name: string | null;
  profile_email?: string | null;
  profile_phone_number?: string | null;
  profile_role: PlatformRole | null;
};

export type AdminFamilyRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  visibility: Visibility;
  status: FamilyStatus;
  settings: Record<string, unknown>;
  created_at: string;
  person_count: number;
  memberships: AdminFamilyMembershipData[];
};

interface AdminFamilyDashboardProps {
  families: AdminFamilyRow[];
  users: AdminUserData[];
  dataError?: string | null;
}

type Notice = {
  type: "success" | "error";
  text: string;
} | null;

type ActionResult =
  | {
      success?: boolean;
      error?: string;
      settings?: Record<string, unknown>;
    }
  | void;

const PAGE_SIZE = 10;

const statusLabels: Record<FamilyStatus, string> = {
  active: "Active",
  archived: "Archived",
  suspended: "Suspended",
};



function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function userLabel(user: AdminUserData) {
  return user.full_name?.trim() || user.email;
}

function membershipLabel(membership: AdminFamilyMembershipData) {
  return (
    membership.profile_name?.trim() ||
    membership.profile_email ||
    "Tài khoản chưa đặt tên"
  );
}

function getActiveAdmins(family: AdminFamilyRow) {
  return family.memberships
    .filter(
      (item) => item.role === "family_admin" && item.status === "active",
    )
    .sort((a, b) => Number(b.is_primary_admin) - Number(a.is_primary_admin));
}

function getActiveMemberCount(family: AdminFamilyRow) {
  return family.memberships.filter((item) => item.status === "active").length;
}

function getPersonCount(family: AdminFamilyRow) {
  return Number.isFinite(family.person_count) ? family.person_count : 0;
}

function UserSearchField({
  users,
  name,
  placeholder,
  disabled,
}: {
  users: AdminUserData[];
  name: string;
  placeholder: string;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    const source = normalizedQuery
      ? users.filter((user) =>
          normalize(`${userLabel(user)} ${user.email}`).includes(
            normalizedQuery,
          ),
        )
      : users;

    return source.slice(0, 7);
  }, [query, users]);

  return (
    <div>
      <input type="hidden" name={name} value={selectedId} />
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedId("");
          }}
          disabled={disabled || users.length === 0}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm font-semibold text-stone-950 outline-none transition focus:border-[#800000] focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <div className="mt-2 max-h-56 overflow-y-auto rounded-2xl border border-stone-200 bg-white p-1">
        {users.length === 0 ? (
          <p className="px-3 py-3 text-sm font-semibold text-stone-500">
            Không có tài khoản phù hợp.
          </p>
        ) : filteredUsers.length === 0 ? (
          <p className="px-3 py-3 text-sm font-semibold text-stone-500">
            Không tìm thấy tài khoản.
          </p>
        ) : (
          filteredUsers.map((user) => {
            const selected = selectedId === user.id;
            return (
              <button
                type="button"
                key={user.id}
                onClick={() => {
                  setSelectedId(user.id);
                  setQuery(`${userLabel(user)} ${user.email}`);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  selected
                    ? "bg-[#800000] text-white"
                    : "text-stone-700 hover:bg-amber-50 hover:text-stone-950"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black">
                    {userLabel(user)}
                  </span>
                  <span
                    className={`block truncate text-xs font-semibold ${
                      selected ? "text-white/70" : "text-stone-500"
                    }`}
                  >
                    {user.email}
                  </span>
                </span>
                {selected && <Check className="size-4 shrink-0" />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function AdminFamilyDashboard({
  families: initialFamilies,
  users,
  dataError,
}: AdminFamilyDashboardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FamilyStatus | "all">(
    "active",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFamilyId, setSelectedFamilyId] = useState(
    initialFamilies.find((family) => family.status === "active")?.id ||
      initialFamilies[0]?.id ||
      "",
  );
  const [notice, setNotice] = useState<Notice>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showAdminAccounts, setShowAdminAccounts] = useState(false);

  const families = initialFamilies;

  const activeUsers = useMemo(
    () => users.filter((user) => user.is_active && user.role === "member"),
    [users],
  );

  const phoneByProfileId = useMemo(() => {
    const map = new Map<string, string>();
    for (const user of users) {
      const phone = user.phone_number?.trim();
      if (phone) map.set(user.id, phone);
    }
    return map;
  }, [users]);

  const resolveAdminPhone = (admin: AdminFamilyMembershipData) => {
    const direct = admin.profile_phone_number?.trim();
    if (direct) return direct;
    return phoneByProfileId.get(admin.profile_id) || "";
  };

  const filteredFamilies = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return families.filter((family) => {
      if (statusFilter !== "all" && family.status !== statusFilter) {
        return false;
      }

      if (!normalizedQuery) return true;

      const admins = getActiveAdmins(family)
        .map((admin) => `${membershipLabel(admin)} ${admin.profile_email || ""}`)
        .join(" ");
      return normalize(`${family.name} ${family.slug} ${admins}`).includes(
        normalizedQuery,
      );
    });
  }, [families, query, statusFilter]);

  const selectedFamily =
    families.find((family) => family.id === selectedFamilyId) ||
    filteredFamilies[0] ||
    families[0];

  const totalPages = Math.max(1, Math.ceil(filteredFamilies.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paginatedFamilies = filteredFamilies.slice(
    pageStart,
    pageStart + PAGE_SIZE,
  );

  const runAction = (
    actionName: string,
    handler: () => Promise<ActionResult>,
    onSuccess?: (result: Exclude<ActionResult, void>) => void,
  ) => {
    setNotice(null);
    setPendingAction(actionName);
    startTransition(async () => {
      const result = await handler();
      if (result?.error) {
        setNotice({ type: "error", text: result.error });
      } else {
        onSuccess?.(result || {});
        setNotice({ type: "success", text: "Đã cập nhật dữ liệu dòng họ." });
        setDeleteConfirm("");
        router.refresh();
      }
      setPendingAction(null);
    });
  };

  const submitReplaceAdmin = (formData: FormData) => {
    if (!selectedFamily) return;
    formData.set("family_id", selectedFamily.id);
    runAction("replace-admin", () => replaceFamilyAdminAction(formData));
  };

  const submitMembership = (formData: FormData) => {
    if (!selectedFamily) return;
    formData.set("family_id", selectedFamily.id);
    runAction("membership", () => setUserFamilyMembership(formData));
  };

  const submitDeleteFamily = (formData: FormData) => {
    if (!selectedFamily) return;
    formData.set("family_id", selectedFamily.id);
    formData.set("family_name", selectedFamily.name);
    runAction("delete-family", () => deleteFamilyAction(formData));
  };

  const isBusy = isPending || pendingAction !== null;
  const selectedActiveAdmins = selectedFamily
    ? getActiveAdmins(selectedFamily)
    : [];
  if (dataError) {
    return (
      <div className="rounded-[28px] border border-red-200 bg-red-50 p-5 text-red-900 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <div>
            <h2 className="text-lg font-black">Không tải được dữ liệu quản trị</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-red-700">
              {dataError}. Hãy apply migration RPC quản trị dòng họ rồi refresh
              lại trang.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="min-w-0 overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_18px_60px_rgba(60,42,25,0.07)]">
        <div className="border-b border-stone-100 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b56a10]">
                Điều phối workspace
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-stone-950">
                Danh sách dòng họ
              </h2>
              <p className="mt-1 text-sm font-semibold text-stone-500">
                {filteredFamilies.length} / {families.length} dòng họ theo bộ lọc hiện tại
              </p>
            </div>
            <Link
              href="/admin/families"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-black text-stone-700 shadow-sm transition hover:border-amber-300 hover:text-[#800000]"
            >
              Tạo dòng họ mới
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm theo tên, slug, admin hoặc email"
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-sm font-semibold text-stone-950 outline-none transition focus:border-[#800000] focus:bg-white focus:ring-4 focus:ring-red-100"
              />
            </label>
            <label className="relative block">
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as FamilyStatus | "all");
                  setCurrentPage(1);
                }}
                className="w-full appearance-none rounded-2xl border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-sm font-black text-stone-800 outline-none transition focus:border-[#800000] focus:bg-white focus:ring-4 focus:ring-red-100"
              >
                <option value="active">Active</option>
                <option value="all">Tất cả</option>
                <option value="archived">Archived</option>
                <option value="suspended">Suspended</option>
              </select>
            </label>
          </div>
        </div>

        <div className="max-h-[68vh] overflow-auto">
          <table className="min-w-[980px] w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-stone-50 text-left text-xs font-black uppercase tracking-[0.16em] text-stone-500">
              <tr>
                <th className="border-b border-stone-200 px-5 py-3">
                  Dòng họ
                </th>
                <th className="border-b border-stone-200 px-5 py-3">
                  Admin dòng họ
                </th>
                <th className="border-b border-stone-200 px-5 py-3">
                  Người gia phả
                </th>
                <th className="border-b border-stone-200 px-5 py-3">
                  Trạng thái
                </th>
                <th className="border-b border-stone-200 px-5 py-3 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredFamilies.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm font-semibold text-stone-500"
                  >
                    Không có dòng họ nào khớp bộ lọc.
                  </td>
                </tr>
              ) : (
                paginatedFamilies.map((family) => {
                  const activeAdmins = getActiveAdmins(family);
                  const selected = family.id === selectedFamily?.id;

                  return (
                    <tr
                      key={family.id}
                      onClick={() => {
                        setSelectedFamilyId(family.id);
                        setNotice(null);
                        setDeleteConfirm("");
                        setShowAdminAccounts(false);
                      }}
                      className={`cursor-pointer transition ${
                        selected ? "bg-red-50/60" : "hover:bg-amber-50/60"
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="block max-w-[280px] text-left">
                          <span className="block truncate text-base font-black text-stone-950">
                            {family.name}
                          </span>
                          <span className="mt-1 block truncate text-xs font-semibold text-stone-500">
                            /{family.slug}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="max-w-[340px] space-y-2">
                          {activeAdmins.length === 0 ? (
                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">
                              Chưa có admin active
                            </span>
                          ) : (
                            activeAdmins.map((admin) => (
                              <div
                                key={admin.id}
                                className="rounded-xl bg-white/70 px-3 py-2 shadow-sm ring-1 ring-stone-100"
                              >
                                <span className="truncate text-sm font-bold text-stone-800">
                                  {membershipLabel(admin)}
                                </span>
                                <span
                                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${
                                    admin.is_primary_admin
                                      ? "bg-[#800000] text-white"
                                      : "bg-emerald-50 text-emerald-700"
                                  }`}
                                >
                                  {admin.is_primary_admin ? "Chính" : "Phụ"}
                                </span>
                                <p className="mt-1 truncate text-xs font-semibold text-stone-500">
                                  {admin.profile_email || "Chưa có email"}
                                  {" · "}
                                  {resolveAdminPhone(admin) || "Chưa có SĐT"}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-black text-stone-800">
                        <Link
                          href={`/dashboard/${family.slug}/members?view=tree`}
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex min-w-16 items-center justify-center rounded-full bg-white px-3 py-2 text-sm font-black text-[#800000] shadow-sm ring-1 ring-amber-200 transition hover:bg-amber-50 hover:ring-amber-300"
                          title="Mở sơ đồ cây gia phả"
                        >
                          {getPersonCount(family).toLocaleString("vi-VN")}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            family.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : family.status === "suspended"
                                ? "bg-red-50 text-red-700"
                                : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {statusLabels[family.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/${family.slug}`}
                            onClick={(event) => event.stopPropagation()}
                            className="inline-flex items-center justify-center rounded-full border border-stone-200 bg-white p-2 text-stone-700 shadow-sm transition hover:border-amber-300 hover:text-[#800000]"
                            title="Mở workspace"
                          >
                            <ArrowUpRight className="size-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedFamilyId(family.id);
                              setNotice(null);
                              setDeleteConfirm("");
                              setShowAdminAccounts(false);
                            }}
                            className="inline-flex items-center justify-center rounded-full bg-stone-950 p-2 text-white shadow-sm transition hover:bg-[#800000]"
                            title="Quản trị"
                          >
                            <UserCog className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-stone-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-sm font-semibold text-stone-500">
            Hiển thị{" "}
            <span className="font-black text-stone-900">
              {filteredFamilies.length === 0 ? 0 : pageStart + 1}
            </span>
            {" - "}
            <span className="font-black text-stone-900">
              {Math.min(pageStart + PAGE_SIZE, filteredFamilies.length)}
            </span>{" "}
            trên{" "}
            <span className="font-black text-stone-900">
              {filteredFamilies.length}
            </span>{" "}
            dòng họ
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safePage <= 1}
              className="inline-flex size-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:border-amber-300 hover:text-[#800000] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Trang trước"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="min-w-24 rounded-full bg-stone-50 px-4 py-2 text-center text-sm font-black text-stone-800">
              {safePage} / {totalPages}
            </div>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={safePage >= totalPages}
              className="inline-flex size-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:border-amber-300 hover:text-[#800000] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Trang sau"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      <aside className="min-w-0 rounded-[28px] border border-stone-200 bg-white shadow-[0_18px_60px_rgba(60,42,25,0.07)]">
        {!selectedFamily ? (
          <div className="p-6 text-sm font-semibold text-stone-500">
            Chọn một dòng họ để thao tác quản trị.
          </div>
        ) : (
          <div>
            <div className="border-b border-stone-100 px-5 py-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b56a10]">
                Đang quản trị
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-stone-950">
                {selectedFamily.name}
              </h2>
              <p className="mt-1 truncate text-sm font-semibold text-stone-500">
                /{selectedFamily.slug}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/dashboard/${selectedFamily.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#800000] px-4 py-2 text-sm font-black text-white transition hover:bg-[#650000]"
                >
                  Mở workspace
                  <ArrowUpRight className="size-4" />
                </Link>
                <Link
                  href={`/dashboard/${selectedFamily.slug}/admins`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-black text-stone-800 shadow-sm transition hover:border-amber-300 hover:text-[#800000]"
                >
                  Quản trị viên
                  <UserCog className="size-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-5 p-5">
              <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-black text-stone-950">
                      <Crown className="size-4 text-[#800000]" />
                      Tài khoản quản trị đang hoạt động
                    </div>
                    <p className="text-sm font-semibold leading-6 text-stone-600">
                      {selectedActiveAdmins.length} tài khoản có quyền quản lý dòng họ này.
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#800000] shadow-sm">
                    {selectedActiveAdmins.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAdminAccounts((value) => !value)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-stone-950 shadow-sm transition hover:text-[#800000]"
                >
                  Xem danh sách tài khoản quản trị
                  <ChevronRight
                    className={`size-4 transition ${showAdminAccounts ? "rotate-90" : ""}`}
                  />
                </button>

                {showAdminAccounts && (
                  <div className="mt-3 space-y-2">
                    {selectedActiveAdmins.length === 0 ? (
                      <p className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-stone-500">
                        Chưa có tài khoản quản trị active.
                      </p>
                    ) : (
                      selectedActiveAdmins.map((admin) => (
                        <div
                          key={admin.id}
                          className="rounded-2xl bg-white p-3 shadow-sm"
                        >
                          <p className="truncate text-sm font-black text-stone-950">
                            {membershipLabel(admin)}
                          </p>
                          <span
                            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ${
                              admin.is_primary_admin
                                ? "bg-[#800000] text-white"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {admin.is_primary_admin
                              ? "Quản trị chính"
                              : "Quản trị phụ"}
                          </span>
                          <p className="mt-1 truncate text-xs font-semibold text-stone-500">
                            {admin.profile_email || "Chưa có email"}
                          </p>
                          <p className="mt-1 truncate text-xs font-semibold text-stone-500">
                            {resolveAdminPhone(admin) || "Chưa cập nhật SĐT"}
                          </p>
                          <form action={submitMembership} className="mt-3">
                            <input type="hidden" name="profile_id" value={admin.profile_id} />
                            <input type="hidden" name="role" value="member" />
                            <input type="hidden" name="status" value="active" />
                            <button
                              type="submit"
                              disabled={isBusy || admin.is_primary_admin}
                              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-center text-xs font-black leading-tight text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {pendingAction === "membership" ? (
                                <Loader2 className="size-3.5 shrink-0 animate-spin" />
                              ) : (
                                <Trash2 className="size-3.5 shrink-0" />
                              )}
                              {admin.is_primary_admin
                                ? "Đổi admin chính trước"
                                : "Bỏ vai trò quản lý"}
                            </button>
                          </form>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </section>

              <section>
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-stone-950">
                  <Crown className="size-4 text-[#800000]" />
                  Đổi Admin Dòng Họ chính
                </div>
                <form
                  key={`replace-${selectedFamily.id}`}
                  action={submitReplaceAdmin}
                  className="grid gap-3"
                >
                  <UserSearchField
                    users={activeUsers}
                    name="profile_id"
                    placeholder="Tìm member active"
                    disabled={isBusy}
                  />
                  <button
                    type="submit"
                    disabled={isBusy || activeUsers.length === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-950 px-4 py-3 text-sm font-black text-white transition hover:bg-[#800000] disabled:cursor-not-allowed disabled:bg-stone-300"
                  >
                    {pendingAction === "replace-admin" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Crown className="size-4" />
                    )}
                    Cập nhật admin chính
                  </button>
                </form>
              </section>

              <section className="border-t border-stone-100 pt-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-stone-950">
                  <ShieldCheck className="size-4 text-[#800000]" />
                  Gán quyền truy cập dòng họ
                </div>
                <form
                  key={`membership-${selectedFamily.id}`}
                  action={submitMembership}
                  className="grid gap-3"
                >
                  <UserSearchField
                    users={activeUsers}
                    name="profile_id"
                    placeholder="Tìm member active"
                    disabled={isBusy}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      name="role"
                      defaultValue="member"
                      disabled={isBusy}
                      className="rounded-2xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm font-black text-stone-800 outline-none transition focus:border-[#800000] focus:bg-white"
                    >
                      <option value="member">Thành viên</option>
                      <option value="family_admin">Quản trị phụ</option>
                    </select>
                    <select
                      name="status"
                      defaultValue="active"
                      disabled={isBusy}
                      className="rounded-2xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm font-black text-stone-800 outline-none transition focus:border-[#800000] focus:bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="blocked">Block</option>
                      <option value="pending">Pending</option>
                      <option value="invited">Invited</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={isBusy || activeUsers.length === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-black text-stone-950 shadow-sm transition hover:border-amber-300 hover:text-[#800000] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pendingAction === "membership" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Users className="size-4" />
                    )}
                    Lưu phân quyền
                  </button>
                </form>
              </section>

              {notice && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    notice.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                  aria-live="polite"
                >
                  {notice.text}
                </div>
              )}

              <section className="border-t border-stone-100 pt-5">
                <p className="mb-3 text-sm font-black text-stone-950">
                  Tổng số thành viên trong gia phả
                </p>
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-semibold leading-6 text-stone-500">
                      <span className="block text-3xl font-black text-stone-950">
                        {getPersonCount(selectedFamily).toLocaleString("vi-VN")}
                      </span>
                      Người đã được nhập vào cây gia phả. Tài khoản truy cập active:
                      {" "}
                      {getActiveMemberCount(selectedFamily)}.
                    </p>
                    <Users className="size-5 shrink-0 text-[#800000]" />
                  </div>
                  <Link
                    href={`/dashboard/${selectedFamily.slug}/members`}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-black text-stone-900 shadow-sm transition hover:border-amber-300 hover:text-[#800000]"
                  >
                    Xem danh sách thành viên
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </section>

              <section className="border-t border-red-100 pt-5">
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-700" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-black text-red-950">
                      Xóa dòng họ
                    </h3>
                    <p className="mt-1 text-xs font-semibold leading-5 text-red-700">
                      Nhập đúng tên dòng họ để xác nhận. Dữ liệu liên quan sẽ bị
                      xóa theo cascade của database.
                    </p>
                    <form
                      action={submitDeleteFamily}
                      className="mt-3 grid gap-2"
                    >
                      <input
                        name="confirmation"
                        value={deleteConfirm}
                        onChange={(event) =>
                          setDeleteConfirm(event.target.value)
                        }
                        disabled={isBusy}
                        placeholder={selectedFamily.name}
                        className="w-full rounded-2xl border border-red-200 bg-white px-3 py-3 text-sm font-semibold text-red-950 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                      <button
                        type="submit"
                        disabled={isBusy || deleteConfirm !== selectedFamily.name}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-200"
                      >
                        {pendingAction === "delete-family" ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                        Xóa dòng họ
                      </button>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
