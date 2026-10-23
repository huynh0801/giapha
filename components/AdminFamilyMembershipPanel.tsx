"use client";

import {
  deleteFamilyAction,
  replaceFamilyAdminAction,
} from "@/app/actions/family";
import { setUserFamilyMembership } from "@/app/actions/user";
import { FamilyRole, MembershipStatus, PlatformRole } from "@/types";
import {
  AlertTriangle,
  Crown,
  Loader2,
  ShieldCheck,
  Trash2,
  UserCog,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

type AdminFamilyUserOption = {
  id: string;
  full_name: string | null;
  email: string;
  role: PlatformRole;
  is_active: boolean;
};

type AdminFamilyMembershipRow = {
  id: string;
  profile_id: string;
  role: FamilyRole;
  status: MembershipStatus;
  joined_at: string | null;
  profile_name: string | null;
  profile_email?: string | null;
  profile_role: PlatformRole | null;
};

interface AdminFamilyMembershipPanelProps {
  familyId: string;
  familyName: string;
  users: AdminFamilyUserOption[];
  memberships: AdminFamilyMembershipRow[];
}

const roleLabels: Record<FamilyRole, string> = {
  family_admin: "Admin Dòng Họ",
  member: "Thành viên",
};

const statusLabels: Record<MembershipStatus, string> = {
  active: "Đang hoạt động",
  blocked: "Đã chặn",
  invited: "Đã mời",
  pending: "Chờ duyệt",
};

export default function AdminFamilyMembershipPanel({
  familyId,
  familyName,
  users,
  memberships,
}: AdminFamilyMembershipPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const memberCandidates = useMemo(
    () => users.filter((user) => user.is_active && user.role === "member"),
    [users],
  );
  const activeAdmins = memberships.filter(
    (item) => item.role === "family_admin" && item.status === "active",
  );

  const runAction = (
    actionName: string,
    handler: () => Promise<{ success?: boolean; error?: string } | void>,
  ) => {
    setNotice(null);
    setPendingAction(actionName);
    startTransition(async () => {
      const result = await handler();
      if (result?.error) {
        setNotice({ type: "error", text: result.error });
      } else {
        setNotice({ type: "success", text: "Đã cập nhật dữ liệu dòng họ." });
        router.refresh();
      }
      setPendingAction(null);
    });
  };

  const submitReplaceAdmin = (formData: FormData) => {
    formData.set("family_id", familyId);
    runAction("replace-admin", () => replaceFamilyAdminAction(formData));
  };

  const submitMembership = (formData: FormData) => {
    formData.set("family_id", familyId);
    runAction("membership", () => setUserFamilyMembership(formData));
  };

  const submitDeleteFamily = (formData: FormData) => {
    formData.set("family_id", familyId);
    formData.set("family_name", familyName);
    runAction("delete-family", async () => {
      const result = await deleteFamilyAction(formData);
      if (!result?.error) setDeleteConfirm("");
      return result;
    });
  };

  const isBusy = isPending || pendingAction !== null;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        <section className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-stone-900">
            <Crown className="size-4 text-[#800000]" />
            Đổi Admin Dòng Họ chính
          </div>
          <form
            action={submitReplaceAdmin}
            className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]"
          >
            <select
              name="profile_id"
              required
              defaultValue=""
              disabled={memberCandidates.length === 0 || isBusy}
              className="min-w-0 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-semibold text-stone-800 outline-none focus:border-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="" disabled>
                Chọn tài khoản member active
              </option>
              {memberCandidates.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name || user.email} - {user.email}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={isBusy || memberCandidates.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#800000] px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-[#650000] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pendingAction === "replace-admin" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Crown className="size-4" />
              )}
              Cập nhật Admin
            </button>
          </form>
          <p className="mt-2 text-xs font-semibold leading-5 text-stone-500">
            Tài khoản được chọn sẽ thành Admin Dòng Họ active. Các Admin Dòng Họ
            active cũ sẽ được hạ về Thành viên active.
          </p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-stone-900">
            <UserCog className="size-4 text-[#800000]" />
            Gán quyền chi tiết
          </div>

          <form
            action={submitMembership}
            className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_160px_150px_auto]"
          >
            <select
              name="profile_id"
              required
              defaultValue=""
              disabled={users.length === 0 || isBusy}
              className="min-w-0 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-800 outline-none focus:border-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="" disabled>
                Chọn tài khoản
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {(user.full_name || user.email).trim()} - {user.email}
                  {user.role === "system_admin" ? " (Super Admin)" : ""}
                </option>
              ))}
            </select>

            <select
              name="role"
              defaultValue="member"
              disabled={isBusy}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-800 outline-none focus:border-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="member">Thành viên</option>
              <option value="family_admin">Admin Dòng Họ</option>
            </select>

            <select
              name="status"
              defaultValue="active"
              disabled={isBusy}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-800 outline-none focus:border-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="active">Active</option>
              <option value="blocked">Block</option>
              <option value="pending">Pending</option>
              <option value="invited">Invited</option>
            </select>

            <button
              type="submit"
              disabled={isBusy || users.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-950 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pendingAction === "membership" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
              Lưu quyền
            </button>
          </form>

          {notice && (
            <div
              className={`mt-3 rounded-xl border px-3 py-2 text-sm font-semibold ${
                notice.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
              aria-live="polite"
            >
              {notice.text}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-red-200 bg-red-50/70 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
              <AlertTriangle className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-black text-red-900">
                Xóa dòng họ
              </h4>
              <p className="mt-1 text-xs font-semibold leading-5 text-red-700">
                Thao tác này xóa workspace, memberships, cây gia phả và dữ liệu
                liên quan theo cascade. Nhập đúng tên dòng họ để xác nhận.
              </p>
              <form action={submitDeleteFamily} className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
                <input
                  name="confirmation"
                  value={deleteConfirm}
                  onChange={(event) => setDeleteConfirm(event.target.value)}
                  placeholder={familyName}
                  disabled={isBusy}
                  className="rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-950 outline-none focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isBusy || deleteConfirm !== familyName}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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

      <aside className="rounded-2xl border border-stone-200 bg-white p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">
          Thành viên hiện tại
        </p>
        <div className="mt-3 grid gap-2">
          {memberships.length === 0 ? (
            <p className="rounded-xl border border-dashed border-stone-200 bg-stone-50 px-3 py-3 text-sm font-semibold text-stone-500">
              Chưa có membership nào trong dòng họ này.
            </p>
          ) : (
            memberships.map((membership) => {
              const isActiveAdmin = activeAdmins.some(
                (admin) => admin.id === membership.id,
              );
              return (
                <div
                  key={membership.id}
                  className={`rounded-xl border px-3 py-3 ${
                    isActiveAdmin
                      ? "border-amber-200 bg-amber-50"
                      : "border-stone-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-stone-900">
                        {membership.profile_name ||
                          membership.profile_email ||
                          "Tài khoản chưa đặt tên"}
                      </p>
                      {membership.profile_email && (
                        <p className="truncate text-xs font-semibold text-stone-500">
                          {membership.profile_email}
                        </p>
                      )}
                    </div>
                    {isActiveAdmin && (
                      <Crown className="mt-0.5 size-4 shrink-0 text-amber-700" />
                    )}
                  </div>
                  <p className="mt-2 text-xs font-semibold text-stone-500">
                    {roleLabels[membership.role]} · {statusLabels[membership.status]}
                    {membership.profile_role === "system_admin"
                      ? " · Super Admin"
                      : ""}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </div>
  );
}
