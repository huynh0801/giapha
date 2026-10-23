"use client";

import {
  adminCreateUser,
  changeUserRole,
  deleteUser,
  toggleUserStatus,
  updateOwnProfileContact,
} from "@/app/actions/user";
import config from "@/app/config";
import { AdminUserData, UserRole } from "@/types";
import { KeyRound, Loader2, Plus, Save, ShieldCheck, Trash2, X } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface AdminUserListProps {
  initialUsers: AdminUserData[];
  currentUserId: string;
}

type Notice = {
  type: "success" | "error" | "info";
  message: string;
};

const platformRoleLabels: Record<UserRole, string> = {
  system_admin: "Super Admin",
  member: "Thành viên",
};

export default function AdminUserList({
  initialUsers,
  currentUserId,
}: AdminUserListProps) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isPending, startTransition] = useTransition();
  const currentUser = users.find((user) => user.id === currentUserId);

  const isDemo = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.location.hostname === config.demoDomain,
    [],
  );

  const showNotice = (message: string, type: Notice["type"] = "info") => {
    setNotice({ message, type });
    window.setTimeout(() => setNotice(null), 4500);
  };

  const guardDemo = () => {
    if (!isDemo) return false;
    showNotice("Đây là môi trường demo, thao tác quản trị đã bị khóa.", "info");
    return true;
  };

  const refresh = () => {
    router.refresh();
  };

  const handlePlatformRoleChange = (userId: string, role: UserRole) => {
    if (guardDemo()) return;
    setBusyUserId(userId);
    startTransition(async () => {
      const result = await changeUserRole(userId, role);
      if (result?.error) {
        showNotice(result.error, "error");
      } else {
        setUsers((items) =>
          items.map((item) => (item.id === userId ? { ...item, role } : item)),
        );
        showNotice("Đã cập nhật vai trò hệ thống.", "success");
        refresh();
      }
      setBusyUserId(null);
    });
  };

  const handleStatusChange = (userId: string, isActive: boolean) => {
    if (guardDemo()) return;
    setBusyUserId(userId);
    startTransition(async () => {
      const result = await toggleUserStatus(userId, isActive);
      if (result?.error) {
        showNotice(result.error, "error");
      } else {
        setUsers((items) =>
          items.map((item) =>
            item.id === userId ? { ...item, is_active: isActive } : item,
          ),
        );
        showNotice("Đã cập nhật trạng thái tài khoản.", "success");
        refresh();
      }
      setBusyUserId(null);
    });
  };

  const handleDelete = (userId: string) => {
    if (guardDemo()) return;
    if (!window.confirm("Xóa người dùng này khỏi hệ thống?")) return;

    setBusyUserId(userId);
    startTransition(async () => {
      const result = await deleteUser(userId);
      if (result?.error) {
        showNotice(result.error, "error");
      } else {
        setUsers((items) => items.filter((item) => item.id !== userId));
        showNotice("Đã xóa người dùng.", "success");
        refresh();
      }
      setBusyUserId(null);
    });
  };

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (guardDemo()) {
      setIsCreateOpen(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await adminCreateUser(formData);
      if (result?.error) {
        showNotice(result.error, "error");
        return;
      }

      showNotice("Đã tạo tài khoản mới.", "success");
      setIsCreateOpen(false);
      refresh();
    });
  };

  const handleUpdateOwnProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await updateOwnProfileContact(formData);
      if (result?.error) {
        showNotice(result.error, "error");
        return;
      }

      const fullName = formData.get("full_name")?.toString().trim() || "";
      const phoneNumber = formData.get("phone_number")?.toString().trim() || "";
      setUsers((items) =>
        items.map((item) =>
          item.id === currentUserId
            ? {
                ...item,
                full_name: fullName,
                phone_number: phoneNumber || null,
              }
            : item,
        ),
      );
      showNotice("Đã cập nhật thông tin liên hệ của bạn.", "success");
      refresh();
    });
  };

  return (
    <div className="relative space-y-6">
      {notice && (
        <div
          className={`fixed left-1/2 top-6 z-[100] w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border px-4 py-3 text-sm font-bold shadow-xl ${
            notice.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : notice.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {notice.message}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 p-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0" />
          <p className="font-semibold leading-6">
            Super Admin chỉ quản lý tài khoản nền tảng. Quyền trong từng
            dòng họ được bàn giao khi tạo dòng họ hoặc do Admin dòng họ duyệt
            yêu cầu tham gia.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="btn-primary shrink-0"
        >
          <Plus className="size-4" />
          Thêm người dùng
        </button>
      </div>

      {currentUser && (
        <form
          onSubmit={handleUpdateOwnProfile}
          className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_240px_180px]"
        >
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b56a10]">
              Thông tin Super Admin
            </p>
            <h2 className="mt-1 text-lg font-black text-stone-950">
              Cập nhật tên và số điện thoại hiển thị
            </h2>
            <p className="mt-1 text-sm font-semibold text-stone-500">
              Dùng để hiển thị trong danh sách quản trị và thông tin liên hệ.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <input
              name="full_name"
              defaultValue={currentUser.full_name || ""}
              required
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
              placeholder="Họ tên"
            />
            <input
              name="phone_number"
              defaultValue={currentUser.phone_number || ""}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
              placeholder="Số điện thoại"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-12 items-center justify-center gap-2 self-end rounded-xl bg-[#800000] px-4 text-sm font-black text-white transition hover:bg-[#650000] disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Lưu thông tin
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-stone-200/70 bg-white/80 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-5 py-3">Người dùng</th>
                <th className="px-5 py-3">Số điện thoại</th>
                <th className="px-5 py-3">Platform role</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3">Ngày tạo</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((user) => {
                const isSelf = user.id === currentUserId;
                const isLoading = busyUserId === user.id || isPending;
                const platformRole = user.role ?? "member";

                return (
                  <tr key={user.id} className="align-top hover:bg-amber-50/35">
                    <td className="px-5 py-4">
                      <p className="font-black text-stone-900">
                        {user.full_name || "Chưa có tên"}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-stone-500">
                        {user.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-stone-600">
                      {user.phone_number || "Chưa cập nhật"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {isSelf ? (
                          <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-800">
                            {platformRoleLabels[platformRole]}
                          </span>
                        ) : (
                          <select
                            value={platformRole}
                            disabled={isLoading}
                            onChange={(event) =>
                              handlePlatformRoleChange(
                                user.id,
                                event.target.value as UserRole,
                              )
                            }
                            className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-bold text-stone-700 outline-none transition-colors focus:border-amber-500"
                          >
                            <option value="member">Thành viên</option>
                            <option value="system_admin">Super Admin</option>
                          </select>
                        )}
                        {user.must_change_password && (
                          <span className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-black text-amber-800">
                            <KeyRound className="size-3" />
                            Cần đổi mật khẩu
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        disabled={isSelf || isLoading}
                        onClick={() =>
                          handleStatusChange(user.id, !user.is_active)
                        }
                        className={`rounded-xl border px-3 py-2 text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                          user.is_active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-stone-200 bg-stone-100 text-stone-600"
                        }`}
                      >
                        {user.is_active ? "Đang hoạt động" : "Đã khóa"}
                      </button>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-stone-500">
                      {new Date(user.created_at).toLocaleDateString("vi-VN")}
                    </td>

                    <td className="px-5 py-4 text-right">
                      {!isSelf && (
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleDelete(user.id)}
                          className="inline-flex size-9 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          aria-label="Xóa người dùng"
                        >
                          {isLoading ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </button>
                      )}
                      {isSelf && (
                        <span className="text-xs font-bold italic text-stone-400">
                          Bạn
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm font-semibold text-stone-500"
                  >
                    Chưa có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-stone-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
              <h3 className="text-lg font-black text-stone-900">
                Tạo người dùng mới
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                aria-label="Đóng"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 p-5">
              <label className="block">
                <span className="mb-1 block text-sm font-bold text-stone-700">
                  Họ tên
                </span>
                <input
                  name="full_name"
                  required
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-bold text-stone-700">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-bold text-stone-700">
                  Mật khẩu
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-bold text-stone-700">
                  Platform role
                </span>
                <select
                  name="role"
                  defaultValue="member"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                >
                  <option value="member">Thành viên</option>
                  <option value="system_admin">Super Admin</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-bold text-stone-700">
                  Trạng thái
                </span>
                <select
                  name="is_active"
                  defaultValue="true"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                >
                  <option value="true">Đang hoạt động</option>
                  <option value="false">Khóa tài khoản</option>
                </select>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="btn"
                >
                  Hủy
                </button>
                <button type="submit" disabled={isPending} className="btn-primary">
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
