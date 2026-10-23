"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  updateUserProfileFull,
  changeAnyUserPassword,
} from "@/app/actions/user";
import { uploadAvatarAction } from "@/app/actions/storage";

interface ProfileFormProps {
  initialProfile: {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    role: "system_admin" | "member";
    avatarUrl: string | null;
    createdAt: string;
  };
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile fields state
  const [fullName, setFullName] = useState(initialProfile.fullName);
  const [phoneNumber, setPhoneNumber] = useState(initialProfile.phoneNumber);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    initialProfile.avatarUrl,
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Format creation date
  const createdFormatted = (() => {
    try {
      return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(initialProfile.createdAt));
    } catch {
      return "";
    }
  })();

  const userInitial = (
    fullName?.[0] ||
    initialProfile.email?.[0] ||
    "U"
  ).toUpperCase();

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setProfileMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("familyId", "profiles");

      const res = await uploadAvatarAction(formData);
      if (!res.success || !res.publicUrl) {
        setProfileMsg({
          type: "error",
          text: res.error || "Không thể tải ảnh lên.",
        });
        return;
      }

      setAvatarUrl(res.publicUrl);

      // Auto save avatar to profile
      const saveFormData = new FormData();
      saveFormData.append("full_name", fullName);
      saveFormData.append("phone_number", phoneNumber);
      saveFormData.append("avatar_url", res.publicUrl);

      const saveRes = await updateUserProfileFull(saveFormData);
      if (saveRes.error) {
        setProfileMsg({ type: "error", text: saveRes.error });
      } else {
        setProfileMsg({
          type: "success",
          text: "Đã cập nhật ảnh đại diện mới thành công!",
        });
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setProfileMsg({ type: "error", text: "Đã xảy ra lỗi khi tải ảnh lên." });
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handle saving general profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setProfileMsg({ type: "error", text: "Vui lòng nhập họ và tên." });
      return;
    }

    setIsSavingProfile(true);
    setProfileMsg(null);

    try {
      const formData = new FormData();
      formData.append("full_name", fullName.trim());
      formData.append("phone_number", phoneNumber.trim());
      if (avatarUrl) {
        formData.append("avatar_url", avatarUrl);
      }

      const res = await updateUserProfileFull(formData);
      if (res.error) {
        setProfileMsg({ type: "error", text: res.error });
      } else {
        setProfileMsg({
          type: "success",
          text: "Đã lưu thông tin hồ sơ thành công!",
        });
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setProfileMsg({ type: "error", text: "Đã xảy ra lỗi khi lưu thông tin." });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!currentPassword) {
      setPasswordMsg({
        type: "error",
        text: "Vui lòng nhập mật khẩu hiện tại.",
      });
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setPasswordMsg({
        type: "error",
        text: "Mật khẩu mới phải có ít nhất 8 ký tự.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({
        type: "error",
        text: "Mật khẩu xác nhận không trùng khớp.",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const formData = new FormData();
      formData.append("current_password", currentPassword);
      formData.append("new_password", newPassword);
      formData.append("confirm_password", confirmPassword);

      const res = await changeAnyUserPassword(formData);
      if (res.error) {
        setPasswordMsg({ type: "error", text: res.error });
      } else {
        setPasswordMsg({
          type: "success",
          text: "Đổi mật khẩu thành công!",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);
      setPasswordMsg({
        type: "error",
        text: "Đã xảy ra lỗi khi đổi mật khẩu.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#e2d0a8] bg-[#fcf5e5] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Area */}
          <div className="relative shrink-0">
            <div className="relative size-24 sm:size-28 rounded-full border-2 border-[#d9a04d] bg-[#eddcb7] text-[#800000] font-bold text-3xl flex items-center justify-center overflow-hidden shadow-sm">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={fullName || "Avatar"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <span>{userInitial}</span>
              )}

              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold">
                  Đang tải...
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarChange}
            />

            {/* Upload Button */}
            <button
              type="button"
              disabled={isUploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full bg-[#800000] text-white shadow-md transition hover:bg-[#a62424] active:scale-95 disabled:opacity-60"
              title="Đổi ảnh đại diện"
              aria-label="Đổi ảnh đại diện"
            >
              <Camera className="size-4" />
            </button>
          </div>

          {/* User Meta Info */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="truncate text-2xl sm:text-3xl font-black text-[#183b28]">
                  {fullName || "Chưa cập nhật họ tên"}
                </h1>
                <p className="mt-1 text-sm text-[#6a594d]">
                  {initialProfile.email}
                </p>
              </div>

              <div>
                {initialProfile.role === "system_admin" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#800000]">
                    <ShieldCheck className="size-4" />
                    Quản trị hệ thống
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-amber-800">
                    <User className="size-4" />
                    Thành viên dòng họ
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-[#8a7b6f] border-t border-[#e2d0a8]/60 pt-3">
              {phoneNumber && (
                <div className="inline-flex items-center gap-1 text-[#5c4a3e]">
                  <Phone className="size-3.5" />
                  <span>{phoneNumber}</span>
                </div>
              )}
              {createdFormatted && (
                <div>
                  Ngày tham gia:{" "}
                  <span className="text-[#3c3026]">{createdFormatted}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Edit Personal Information */}
        <div className="rounded-3xl border border-[#e2d0a8] bg-[#fcf5e5] p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-[#e2d0a8]/60 pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100/70 text-[#800000]">
              <User className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#183b28]">
                Thông tin cá nhân
              </h2>
              <p className="text-xs text-[#7d6c5d]">
                Cập nhật họ tên và số điện thoại liên hệ
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {profileMsg && (
              <div
                className={`flex items-start gap-2 rounded-xl p-3 text-xs sm:text-sm font-semibold ${
                  profileMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {profileMsg.type === "success" ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="full_name"
                className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5"
              >
                Họ và tên <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="full_name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên đầy đủ"
                  className="w-full rounded-xl border border-[#d8cbbb] bg-white py-2.5 pl-10 pr-3.5 text-sm font-semibold text-[#2c1a11] outline-none transition focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone_number"
                className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5"
              >
                Số điện thoại
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="phone_number"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Ví dụ: 0912345678"
                  className="w-full rounded-xl border border-[#d8cbbb] bg-white py-2.5 pl-10 pr-3.5 text-sm font-semibold text-[#2c1a11] outline-none transition focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5">
                Email đăng nhập
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  disabled
                  value={initialProfile.email}
                  className="w-full rounded-xl border border-[#d8cbbb] bg-[#ede5d5]/60 py-2.5 pl-10 pr-3.5 text-sm font-semibold text-[#7d6c5d] cursor-not-allowed outline-none"
                />
              </div>
              <p className="mt-1 text-[11px] text-[#8a7b6f]">
                Email gắn với tài khoản đăng nhập và không thể tự thay đổi.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#800000] px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#a62424] active:scale-[0.98] disabled:opacity-60"
              >
                <Save className="size-4" />
                <span>
                  {isSavingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Change Password */}
        <div className="rounded-3xl border border-[#e2d0a8] bg-[#fcf5e5] p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-[#e2d0a8]/60 pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100/70 text-[#800000]">
              <KeyRound className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#183b28]">
                Bảo mật & Đổi mật khẩu
              </h2>
              <p className="text-xs text-[#7d6c5d]">
                Cập nhật mật khẩu mới cho tài khoản của bạn
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordMsg && (
              <div
                className={`flex items-start gap-2 rounded-xl p-3 text-xs sm:text-sm font-semibold ${
                  passwordMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {passwordMsg.type === "success" ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
                )}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="current_password"
                className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5"
              >
                Mật khẩu hiện tại <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="current_password"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu đang dùng"
                  className="w-full rounded-xl border border-[#d8cbbb] bg-white py-2.5 pl-10 pr-3.5 text-sm font-semibold text-[#2c1a11] outline-none transition focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="new_password"
                className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5"
              >
                Mật khẩu mới <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="new_password"
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 8 ký tự"
                  className="w-full rounded-xl border border-[#d8cbbb] bg-white py-2.5 pl-10 pr-3.5 text-sm font-semibold text-[#2c1a11] outline-none transition focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm_password"
                className="block text-xs font-bold uppercase tracking-wider text-[#5c4a3e] mb-1.5"
              >
                Xác nhận mật khẩu mới <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="confirm_password"
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full rounded-xl border border-[#d8cbbb] bg-white py-2.5 pl-10 pr-3.5 text-sm font-semibold text-[#2c1a11] outline-none transition focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#800000] px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#a62424] active:scale-[0.98] disabled:opacity-60"
              >
                <KeyRound className="size-4" />
                <span>
                  {isChangingPassword ? "Đang cập nhật..." : "Đổi mật khẩu"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
