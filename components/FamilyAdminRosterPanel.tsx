"use client";

import { replaceFamilyAdminAction } from "@/app/actions/family";
import {
  setUserFamilyMembership,
  updateOwnProfileContact,
} from "@/app/actions/user";
import { FamilyRole, MembershipStatus, PlatformRole } from "@/types";
import {
  AlertTriangle,
  Check,
  Crown,
  Loader2,
  Mail,
  Phone,
  Save,
  Search,
  ShieldCheck,
  ShieldMinus,
  UserCheck,
  UserCog,
  UserMinus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

export type FamilyAdminRosterRow = {
  membership_id: string | null;
  profile_id: string;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  role: FamilyRole;
  status: MembershipStatus;
  is_primary_admin: boolean;
  platform_role: PlatformRole | null;
  is_active: boolean;
  joined_at: string | null;
};

type FamilyAdminRosterPanelProps = {
  familyId: string;
  familySlug: string;
  familyName: string;
  rows: FamilyAdminRosterRow[];
  canManageAdmins: boolean;
  canReplacePrimary: boolean;
  currentProfileId: string;
  currentFullName: string | null;
  currentPhoneNumber: string | null;
};

type Notice = {
  type: "success" | "error";
  text: string;
} | null;

function displayName(row: FamilyAdminRosterRow) {
  return row.full_name?.trim() || row.email || "Tài khoản chưa đặt tên";
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function adminRoleLabel(row: FamilyAdminRosterRow) {
  if (row.is_primary_admin) return "Quản trị chính";
  return "Quản trị phụ";
}

function statusLabel(status: MembershipStatus) {
  if (status === "active") return "Đang hoạt động";
  if (status === "blocked") return "Đã chặn";
  if (status === "pending") return "Chờ duyệt";
  return "Đã mời";
}

function SearchSelect({
  rows,
  name,
  placeholder,
  emptyMessage = "Chưa có tài khoản phù hợp.",
  noResultsMessage = "Không tìm thấy tài khoản.",
  disabled,
}: {
  rows: FamilyAdminRosterRow[];
  name: string;
  placeholder: string;
  emptyMessage?: string;
  noResultsMessage?: string;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const normalizedQuery = normalize(query.trim());
  const filteredRows = useMemo(() => {
    const source = normalizedQuery
      ? rows.filter((row) =>
          normalize(`${displayName(row)} ${row.email || ""}`).includes(
            normalizedQuery,
          ),
        )
      : rows;

    return source.slice(0, 8);
  }, [normalizedQuery, rows]);

  return (
    <div>
      <input type="hidden" name={name} value={selectedId} />
      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedId("");
          }}
          disabled={disabled || rows.length === 0}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-stone-950 outline-none transition focus:border-[#800000] focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <div className="mt-2 max-h-60 overflow-y-auto rounded-2xl border border-stone-200 bg-white p-1 shadow-inner">
        {rows.length === 0 ? (
          <p className="px-3 py-3 text-sm font-semibold text-stone-500">
            {emptyMessage}
          </p>
        ) : filteredRows.length === 0 ? (
          <p className="px-3 py-3 text-sm font-semibold text-stone-500">
            {noResultsMessage}
          </p>
        ) : (
          filteredRows.map((row) => {
            const selected = selectedId === row.profile_id;
            return (
              <button
                type="button"
                key={row.profile_id}
                onClick={() => {
                  setSelectedId(row.profile_id);
                  setQuery(`${displayName(row)} ${row.email || ""}`.trim());
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  selected
                    ? "bg-[#800000] text-white"
                    : "text-stone-700 hover:bg-amber-50 hover:text-stone-950"
                }`}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/80 text-sm font-black text-[#800000] ring-1 ring-stone-200">
                  {displayName(row).slice(0, 1).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black">
                    {displayName(row)}
                  </span>
                  <span
                    className={`block truncate text-xs font-semibold ${
                      selected ? "text-white/75" : "text-stone-500"
                    }`}
                  >
                    {row.email || "Chưa có email"}
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

export default function FamilyAdminRosterPanel({
  familyId,
  familySlug,
  familyName,
  rows,
  canManageAdmins,
  canReplacePrimary,
  currentProfileId,
  currentFullName,
  currentPhoneNumber,
}: FamilyAdminRosterPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const activeRows = useMemo(
    () => rows.filter((row) => row.status === "active" && row.is_active),
    [rows],
  );
  const activeAdmins = useMemo(
    () =>
      activeRows
        .filter((row) => row.role === "family_admin")
        .sort((a, b) => Number(b.is_primary_admin) - Number(a.is_primary_admin)),
    [activeRows],
  );
  const activeMembers = useMemo(
    () =>
      activeRows.filter(
        (row) =>
          row.role === "member" &&
          row.platform_role === "member" &&
          row.profile_id,
      ),
    [activeRows],
  );
  const primaryAdmin = activeAdmins.find((row) => row.is_primary_admin);
  const replaceCandidates = useMemo(
    () =>
      activeRows.filter(
        (row) =>
          row.platform_role === "member" &&
          row.profile_id !== primaryAdmin?.profile_id,
      ),
    [activeRows, primaryAdmin?.profile_id],
  );
  const subAdminCount = activeAdmins.filter((row) => !row.is_primary_admin).length;
  const canAddMoreSubAdmins = subAdminCount < 10;

  const runAction = (
    actionName: string,
    handler: () => Promise<{ success?: boolean; error?: string } | void>,
    successText: string,
  ) => {
    setNotice(null);
    setPendingAction(actionName);
    startTransition(async () => {
      const result = await handler();
      if (result?.error) {
        setNotice({ type: "error", text: result.error });
      } else {
        setNotice({ type: "success", text: successText });
        router.refresh();
      }
      setPendingAction(null);
    });
  };

  const submitMembership = (formData: FormData) => {
    formData.set("family_id", familyId);
    runAction(
      "membership",
      () => setUserFamilyMembership(formData),
      "Đã cập nhật quyền quản trị viên.",
    );
  };

  const submitReplacePrimary = (formData: FormData) => {
    formData.set("family_id", familyId);
    runAction(
      "replace-primary",
      () => replaceFamilyAdminAction(formData),
      "Đã đổi Quản trị chính. Quản trị chính cũ vẫn được giữ là Quản trị phụ.",
    );
  };

  const submitOwnProfile = (formData: FormData) => {
    formData.set("family_slug", familySlug);
    runAction(
      "profile-contact",
      () => updateOwnProfileContact(formData),
      "Đã cập nhật thông tin liên hệ của bạn.",
    );
  };

  const isBusy = isPending || pendingAction !== null;

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
      <section className="overflow-hidden rounded-3xl border-2 border-[#deb887]/80 bg-gradient-to-br from-[#fffdf7] to-[#fbf7ed] shadow-xs">
        <div className="border-b border-[#deb887]/50 bg-gradient-to-r from-[#fef8ea] via-[#fffdf7] to-[#eaf3ed] px-5 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b56a10]">
                Phân quyền dòng họ
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-stone-950">
                Quản trị viên của {familyName}
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-stone-600">
                Quản trị chính được thêm/bỏ Quản trị phụ. Quản trị phụ vẫn có
                thể nhập Excel, chỉnh sửa cây, duyệt thành viên và vận hành dữ
                liệu dòng họ.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#800000] shadow-sm ring-1 ring-amber-200">
                <Crown className="size-4" />
                {primaryAdmin ? "Đã có quản trị chính" : "Chưa có quản trị chính"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-sm ring-1 ring-emerald-200">
                <UserCog className="size-4" />
                {subAdminCount}/10 quản trị phụ
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5">
          {activeAdmins.length === 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" />
                <div>
                  <h3 className="font-black text-amber-950">
                    Dòng họ chưa có quản trị viên active
                  </h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-amber-800">
                    Super Admin cần vào dashboard tổng để gán Quản trị chính.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            activeAdmins.map((admin) => (
              <article
                key={admin.profile_id}
                className={`rounded-2xl border p-4 shadow-xs transition-all sm:p-5 ${
                  admin.is_primary_admin
                    ? "border-2 border-[#caa455] bg-gradient-to-r from-[#fef8ea] via-[#fffdf7] to-[#fef8ea]"
                    : "border-2 border-[#deb887]/80 bg-[#fffdf7] hover:border-[#caa455]"
                }`}
              >
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(330px,400px)] lg:items-center">
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`flex size-16 shrink-0 items-center justify-center rounded-[22px] text-xl font-black shadow-sm ring-1 ring-black/5 ${
                        admin.is_primary_admin
                          ? "bg-[#800000] text-white"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {admin.is_primary_admin ? (
                        <Crown className="size-6" />
                      ) : (
                        displayName(admin).slice(0, 1).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h3 className="min-w-0 max-w-full truncate text-lg font-black leading-tight text-stone-950 sm:text-xl">
                          {displayName(admin)}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
                            admin.is_primary_admin
                              ? "bg-[#800000] text-white"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {adminRoleLabel(admin)}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-stone-500">
                        {admin.email && (
                          <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
                            <Mail className="size-4 shrink-0" />
                            <span className="truncate break-all">{admin.email}</span>
                          </span>
                        )}
                        {admin.phone_number && (
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="size-4" />
                            {admin.phone_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {canManageAdmins && !admin.is_primary_admin && (
                    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                      <form action={submitMembership} className="min-w-0">
                        <input
                          type="hidden"
                          name="profile_id"
                          value={admin.profile_id}
                        />
                        <input type="hidden" name="role" value="member" />
                        <input type="hidden" name="status" value="active" />
                        <button
                          type="submit"
                          disabled={isBusy}
                          className="inline-flex min-h-[74px] w-full flex-col items-center justify-center gap-1.5 rounded-[22px] border border-stone-200 bg-white px-3 py-3 text-center text-sm font-black leading-tight text-stone-800 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:text-[#800000] hover:shadow-md disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:shadow-sm"
                        >
                          <ShieldMinus className="size-4 shrink-0" />
                          Bỏ quyền quản trị
                        </button>
                      </form>
                      <form action={submitMembership} className="min-w-0">
                        <input
                          type="hidden"
                          name="profile_id"
                          value={admin.profile_id}
                        />
                        <input type="hidden" name="role" value="member" />
                        <input type="hidden" name="status" value="blocked" />
                        <button
                          type="submit"
                          disabled={isBusy}
                          className="inline-flex min-h-[74px] w-full flex-col items-center justify-center gap-1.5 rounded-[22px] border border-red-100 bg-red-50 px-3 py-3 text-center text-sm font-black leading-tight text-red-700 transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
                        >
                          <UserMinus className="size-4 shrink-0" />
                          Chặn khỏi dòng họ
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </article>
            ))
          )}

          <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
            <div className="border-b border-stone-100 bg-stone-50 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                Bảng liên hệ quản trị viên
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-white text-xs font-black uppercase tracking-[0.14em] text-stone-400">
                  <tr>
                    <th className="px-4 py-3">Vai trò</th>
                    <th className="px-4 py-3">Tên admin</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Số điện thoại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {activeAdmins.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-5 text-center font-semibold text-stone-500"
                      >
                        Chưa có quản trị viên active.
                      </td>
                    </tr>
                  ) : (
                    activeAdmins.map((admin) => (
                      <tr key={`contact-${admin.profile_id}`}>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
                              admin.is_primary_admin
                                ? "bg-[#800000] text-white"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {adminRoleLabel(admin)}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-black text-stone-950">
                          {displayName(admin)}
                        </td>
                        <td className="px-4 py-3 font-semibold text-stone-600">
                          {admin.email || "Chưa có email"}
                        </td>
                        <td className="px-4 py-3 font-semibold text-stone-600">
                          {admin.phone_number || "Chưa cập nhật"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-stone-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                  Tài khoản có thể thêm
                </p>
                <h3 className="mt-1 text-lg font-black text-stone-950">
                  Member active chưa là quản trị viên
                </h3>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-stone-700 shadow-sm">
                {activeMembers.length} người
              </span>
            </div>
            <div className="grid max-h-80 gap-2 overflow-y-auto pr-1 md:grid-cols-2">
              {activeMembers.length === 0 ? (
                <p className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-stone-500 md:col-span-2">
                  Chưa có tài khoản member active nào để thêm làm Quản trị phụ.
                </p>
              ) : (
                activeMembers.map((member) => (
                  <div
                    key={member.profile_id}
                    className="rounded-2xl bg-white px-4 py-3 shadow-sm"
                  >
                    <p className="truncate text-sm font-black text-stone-950">
                      {displayName(member)}
                    </p>
                    <p className="mt-1 truncate text-xs font-semibold text-stone-500">
                      {member.email || "Chưa có email"} ·{" "}
                      {member.membership_id
                        ? statusLabel(member.status)
                        : "Chưa nằm trong dòng họ"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_18px_60px_rgba(60,42,25,0.07)]">
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b56a10]">
              Thông tin của tôi
            </p>
            <h3 className="mt-1 text-lg font-black text-stone-950">
              Cập nhật tên và số điện thoại
            </h3>
            <p className="mt-1 text-sm font-semibold leading-6 text-stone-500">
              Thông tin này sẽ hiển thị cho thành viên dòng họ khi họ cần liên
              hệ quản trị viên.
            </p>
          </div>
          <form action={submitOwnProfile} className="grid gap-3">
            <input type="hidden" name="profile_id" value={currentProfileId} />
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase tracking-[0.16em] text-stone-400">
                Họ tên
              </span>
              <input
                name="full_name"
                defaultValue={currentFullName || ""}
                required
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 outline-none transition focus:border-[#800000] focus:bg-white focus:ring-4 focus:ring-red-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase tracking-[0.16em] text-stone-400">
                Số điện thoại
              </span>
              <input
                name="phone_number"
                defaultValue={currentPhoneNumber || ""}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 outline-none transition focus:border-[#800000] focus:bg-white focus:ring-4 focus:ring-red-100"
                placeholder="Ví dụ: 0911.012.110"
              />
            </label>
            <button
              type="submit"
              disabled={isBusy}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#800000] px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#650000] disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              {pendingAction === "profile-contact" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Lưu thông tin
            </button>
          </form>
        </section>

        <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_18px_60px_rgba(60,42,25,0.07)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <UserCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                Thêm quản trị phụ
              </p>
              <h3 className="text-lg font-black text-stone-950">
                Chọn tài khoản member active
              </h3>
            </div>
          </div>

          {canManageAdmins ? (
            <form action={submitMembership} className="grid gap-3">
              <input type="hidden" name="role" value="family_admin" />
              <input type="hidden" name="status" value="active" />
              <SearchSelect
                rows={activeMembers}
                name="profile_id"
                placeholder="Tìm tên hoặc email tài khoản"
                emptyMessage="Chưa có tài khoản member active nào để thêm."
                noResultsMessage="Không tìm thấy tài khoản member active phù hợp."
                disabled={isBusy || !canAddMoreSubAdmins}
              />
              <button
                type="submit"
                disabled={isBusy || activeMembers.length === 0 || !canAddMoreSubAdmins}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#800000] px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#650000] disabled:cursor-not-allowed disabled:bg-stone-300"
              >
                {pendingAction === "membership" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ShieldCheck className="size-4" />
                )}
                Thêm Quản trị phụ
              </button>
              {!canAddMoreSubAdmins && (
                <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                  Dòng họ đã có đủ 10 Quản trị phụ.
                </p>
              )}
            </form>
          ) : (
            <p className="rounded-2xl bg-stone-50 px-4 py-3 text-sm font-semibold leading-6 text-stone-600">
              Bạn có thể xem danh sách quản trị viên. Chỉ Super Admin hoặc
              Quản trị chính mới được thêm/bỏ quản trị viên.
            </p>
          )}
        </section>

        {canReplacePrimary && (
          <section className="rounded-[28px] border border-amber-200 bg-amber-50/80 p-5 shadow-[0_18px_60px_rgba(60,42,25,0.07)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-white text-[#800000] shadow-sm">
                <Crown className="size-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b56a10]">
                  Super Admin
                </p>
                <h3 className="text-lg font-black text-stone-950">
                  Đổi Quản trị chính
                </h3>
              </div>
            </div>

            <form action={submitReplacePrimary} className="grid gap-3">
              <SearchSelect
                rows={replaceCandidates}
                name="profile_id"
                placeholder="Tìm thành viên hoặc quản trị phụ"
                disabled={isBusy}
              />
              <button
                type="submit"
                disabled={isBusy || replaceCandidates.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-950 px-4 py-3 text-sm font-black text-white transition hover:bg-[#800000] disabled:cursor-not-allowed disabled:bg-stone-300"
              >
                {pendingAction === "replace-primary" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Crown className="size-4" />
                )}
                Đặt làm Quản trị chính
              </button>
            </form>

            <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold leading-6 text-stone-600">
              Quản trị chính cũ không bị hạ xuống thành viên. Hệ thống giữ họ
              là Quản trị phụ để vẫn nhập liệu và chỉnh sửa cây.
            </p>
          </section>
        )}

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

        <Link
          href={`/dashboard/${familySlug}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-black text-stone-800 shadow-sm transition hover:border-amber-300 hover:text-[#800000]"
        >
          <Users className="size-4" />
          Quay lại bảng chức năng
        </Link>
      </aside>
    </div>
  );
}
