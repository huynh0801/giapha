"use client";

import {
  createFamilyAction,
  type CreateFamilyActionState,
} from "@/app/actions/family";
import { AdminUserData } from "@/types";
import { slugify } from "@/utils/slug";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  FolderPlus,
  Loader2,
  Search,
  UserRoundCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

interface AdminFamilyCreateFormProps {
  memberRows: AdminUserData[];
}

function userLabel(user: AdminUserData) {
  return user.full_name?.trim() || user.email;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const initialCreateFamilyState: CreateFamilyActionState = {};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#800000] px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-950/10 transition hover:bg-[#650000] disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <FolderPlus className="size-4" />
      )}
      {pending ? "Đang tạo dòng họ..." : "Tạo dòng họ và bàn giao"}
    </button>
  );
}

export default function AdminFamilyCreateForm({
  memberRows,
}: AdminFamilyCreateFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(
    createFamilyAction,
    initialCreateFamilyState,
  );
  const [adminQuery, setAdminQuery] = useState("");
  const [selectedAdminId, setSelectedAdminId] = useState("");

  const [nameValue, setNameValue] = useState("");
  const [slugValue, setSlugValue] = useState("");
  const [isCustomSlug, setIsCustomSlug] = useState(false);

  useEffect(() => {
    if (!state.success) return;
    formRef.current?.reset();
    setNameValue("");
    setSlugValue("");
    setIsCustomSlug(false);
    const timer = window.setTimeout(() => {
      setAdminQuery("");
      setSelectedAdminId("");
    }, 0);
    router.refresh();
    return () => window.clearTimeout(timer);
  }, [router, state.success]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextName = e.target.value;
    setNameValue(nextName);
    if (!isCustomSlug) {
      setSlugValue(slugify(nextName));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextSlug = e.target.value;
    setSlugValue(nextSlug);
    if (!nextSlug.trim()) {
      setIsCustomSlug(false);
      setSlugValue(slugify(nameValue));
    } else {
      setIsCustomSlug(true);
    }
  };

  const filteredAdmins = useMemo(() => {
    const query = normalize(adminQuery.trim());
    const source = query
      ? memberRows.filter((user) =>
          normalize(`${userLabel(user)} ${user.email}`).includes(query),
        )
      : memberRows;

    return source.slice(0, 8);
  }, [adminQuery, memberRows]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_20px_70px_rgba(60,42,25,0.08)]"
    >
      <div className="border-b border-stone-100 bg-stone-950 px-5 py-5 text-white sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-stone-950">
            <FolderPlus className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">
              Tạo workspace mới
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">
              Tạo dòng họ
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
              Chọn một tài khoản member active làm Admin Dòng Họ đầu tiên để bàn
              giao vận hành nội bộ ngay sau khi tạo.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        {(state.success || state.error) && (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold lg:col-span-2 ${
              state.success
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {state.success ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 size-5 shrink-0" />
            )}
            <span>
              {state.success
                ? state.message || "Đã tạo dòng họ thành công."
                : state.error}
            </span>
          </div>
        )}

        <div className="grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-black text-stone-800">
              Tên dòng họ
            </span>
            <input
              name="name"
              required
              value={nameValue}
              onChange={handleNameChange}
              placeholder="Ví dụ: Dòng họ Nguyễn Văn"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-950 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-black text-stone-800">
              Slug
            </span>
            <input
              name="slug"
              value={slugValue}
              onChange={handleSlugChange}
              placeholder="dong-ho-nguyen-van"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-950 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-black text-stone-800">
              Mô tả ngắn
            </span>
            <textarea
              name="description"
              rows={4}
              placeholder="Ghi chú địa phương, phạm vi phả hệ hoặc thông tin bàn giao."
              className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold leading-6 text-stone-950 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
            />
          </label>
        </div>

        <section className="rounded-3xl border border-stone-200 bg-stone-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <UserRoundCheck className="size-5 text-[#800000]" />
            <h3 className="text-sm font-black text-stone-950">
              Admin Dòng Họ đầu tiên
            </h3>
          </div>

          <input
            type="hidden"
            name="admin_profile_id"
            value={selectedAdminId}
          />

          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <input
              value={adminQuery}
              onChange={(event) => {
                setAdminQuery(event.target.value);
                setSelectedAdminId("");
              }}
              disabled={memberRows.length === 0}
              placeholder="Tìm theo tên hoặc email"
              className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-stone-950 outline-none transition focus:border-[#800000] focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          {memberRows.length === 0 ? (
            <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-900">
              Chưa có tài khoản member active để gán Admin Dòng Họ.
            </p>
          ) : (
            <div className="mt-3 max-h-72 overflow-y-auto rounded-2xl border border-stone-200 bg-white p-2">
              {filteredAdmins.length === 0 ? (
                <p className="px-3 py-4 text-sm font-semibold text-stone-500">
                  Không tìm thấy tài khoản phù hợp.
                </p>
              ) : (
                filteredAdmins.map((user) => {
                  const selected = selectedAdminId === user.id;
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setSelectedAdminId(user.id);
                        setAdminQuery(`${userLabel(user)} ${user.email}`);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                        selected
                          ? "bg-[#800000] text-white"
                          : "text-stone-700 hover:bg-amber-50 hover:text-stone-950"
                      }`}
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-[#800000] shadow-sm">
                        {userLabel(user).slice(0, 1).toUpperCase()}
                      </span>
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
          )}

          <SubmitButton disabled={memberRows.length === 0 || !selectedAdminId} />
        </section>
      </div>
    </form>
  );
}
