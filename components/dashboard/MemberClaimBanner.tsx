"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock3,
  Edit3,
  GitBranch,
  Loader2,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  claimExistingPersonAction,
  addSelfToFamilyTreeAction,
  unlinkSelfAction,
  cancelGenealogyRequestAction,
  syncMemberProfileWithTreeAction,
  GenealogyRequest,
} from "@/app/actions/family-claim";

interface PersonItem {
  id: string;
  full_name: string;
  gender: string;
  birth_year?: number | null;
  generation?: number | null;
  is_deceased?: boolean;
}

interface MemberClaimBannerProps {
  familyId: string;
  familySlug: string;
  treeId: string;
  currentUserId: string;
  currentUserName: string;
  linkedPerson: PersonItem | null;
  persons: PersonItem[];
  pendingRequest?: GenealogyRequest | null;
  rejectedRequest?: GenealogyRequest | null;
  canManage?: boolean;
}

export default function MemberClaimBanner({
  familyId,
  familySlug,
  treeId,
  currentUserId,
  currentUserName,
  linkedPerson,
  persons = [],
  pendingRequest,
  rejectedRequest,
  canManage = false,
}: MemberClaimBannerProps) {
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);
  const [dismissedRejected, setDismissedRejected] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Claim Modal States
  const [claimSearch, setClaimSearch] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [claimMessage, setClaimMessage] = useState("");

  // Add Self Modal States
  const [fullName, setFullName] = useState(currentUserName || "");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [birthYear, setBirthYear] = useState("");
  const [selectedParentId, setSelectedParentId] = useState("");
  const [birthOrder, setBirthOrder] = useState("1");
  const [parentSearch, setParentSearch] = useState("");
  const [addMessage, setAddMessage] = useState("");

  // Handle claiming existing person
  const handleClaim = () => {
    if (!selectedPersonId) return;
    setErrorMsg(null);
    startTransition(async () => {
      const res = await claimExistingPersonAction({
        familyId,
        personId: selectedPersonId,
        message: claimMessage.trim() || undefined,
      });
      if (res.success) {
        setShowClaimModal(false);
        window.location.reload();
      } else {
        setErrorMsg(res.error || "Không thể nhận diện thành viên.");
      }
    });
  };

  // Handle adding self to tree under a parent
  const handleAddSelf = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!fullName.trim()) {
      setErrorMsg("Vui lòng điền họ và tên.");
      return;
    }

    const formData = new FormData();
    formData.set("family_id", familyId);
    formData.set("tree_id", treeId);
    formData.set("full_name", fullName.trim());
    formData.set("gender", gender);
    if (birthYear.trim()) formData.set("birth_year", birthYear.trim());
    if (selectedParentId) formData.set("parent_id", selectedParentId);
    if (birthOrder.trim()) formData.set("birth_order", birthOrder.trim());
    if (addMessage.trim()) formData.set("message", addMessage.trim());

    startTransition(async () => {
      const res = await addSelfToFamilyTreeAction(formData);
      if (res.success) {
        setShowAddModal(false);
        window.location.reload();
      } else {
        setErrorMsg(res.error || "Không thể thêm vào cây gia phả.");
      }
    });
  };

  // Handle syncing user profile with tree person
  const handleSyncInfo = () => {
    if (!linkedPerson) return;
    setErrorMsg(null);
    setSyncSuccessMsg(null);
    startTransition(async () => {
      const res = await syncMemberProfileWithTreeAction({
        familyId,
        personId: linkedPerson.id,
      });
      if (res.success) {
        setSyncSuccessMsg(res.message || "Đồng bộ thông tin thành công!");
      } else {
        setErrorMsg(res.error || "Không thể đồng bộ thông tin.");
      }
    });
  };

  // Handle unlinking self
  const handleUnlink = () => {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await unlinkSelfAction({ familyId });
      if (res.success) {
        setShowUnlinkModal(false);
        window.location.reload();
      } else {
        setErrorMsg(res.error || "Không thể hủy liên kết.");
      }
    });
  };

  // Handle cancelling pending request
  const handleCancelRequest = (requestId: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy yêu cầu phê duyệt phả hệ này không?")) return;
    setErrorMsg(null);
    startTransition(async () => {
      const res = await cancelGenealogyRequestAction({ familyId, requestId });
      if (res.success) {
        window.location.reload();
      } else {
        setErrorMsg(res.error || "Không thể hủy yêu cầu.");
      }
    });
  };

  // Filter persons for claim modal
  const filteredClaimPersons = persons.filter((p) => {
    const q = claimSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      p.full_name.toLowerCase().includes(q) ||
      (p.generation && `đời ${p.generation}`.includes(q)) ||
      (p.birth_year && p.birth_year.toString().includes(q))
    );
  });

  // Filter persons for parent selection dropdown
  const filteredParents = persons.filter((p) => {
    const q = parentSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      p.full_name.toLowerCase().includes(q) ||
      (p.generation && `đời ${p.generation}`.includes(q))
    );
  });

  return (
    <>
      {/* 1. NẾU ĐÃ ĐƯỢC DUYỆT & LIÊN KẾT THÀNH CÔNG */}
      {linkedPerson ? (
        <div className="mb-6 rounded-2xl border-2 border-[#caa455] bg-[#fffdf7] p-3.5 sm:p-5 shadow-sm font-sans">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#8c1d1d] text-white shadow-xs">
                <UserCheck className="size-5.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-[#8c1d1d] bg-[#f5e7c7] px-2 py-0.5 rounded-md border border-[#deb887]">
                    Vị trí của bạn trong gia phả
                  </span>
                  {linkedPerson.generation && (
                    <span className="text-[11px] font-bold text-[#183b28]">
                      &bull; Đời thứ {linkedPerson.generation}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="size-3" /> Đã xác thực
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#183b28] truncate mt-0.5">
                  {linkedPerson.full_name}
                  {linkedPerson.birth_year ? ` (sinh năm ${linkedPerson.birth_year})` : ""}
                </h3>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0">
              <Link
                href={`/dashboard/${familySlug}/kinship?p1=${linkedPerson.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8c1d1d] text-white text-xs font-bold hover:bg-[#a62424] transition-colors shadow-xs"
              >
                <Sparkles className="size-3.5" />
                <span>Tra cứu xưng hô</span>
              </Link>

              <Link
                href={`/dashboard/${familySlug}/members/${linkedPerson.id}?treeId=${treeId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fffdf7] border border-[#deb887] text-[#183b28] text-xs font-bold hover:bg-[#f5e7c7] transition-colors shadow-xs"
              >
                <User className="size-3.5" />
                <span>Xem hồ sơ</span>
              </Link>

              <button
                type="button"
                onClick={handleSyncInfo}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fffdf7] border border-[#caa455] text-[#183b28] text-xs font-bold hover:bg-[#f5e7c7] transition-colors shadow-xs cursor-pointer"
                title="Đồng bộ họ tên, ảnh đại diện và số điện thoại giữa tài khoản cá nhân và cây gia phả"
              >
                {isPending ? (
                  <Loader2 className="size-3.5 animate-spin text-[#8c1d1d]" />
                ) : (
                  <RefreshCw className="size-3.5 text-[#8c1d1d]" />
                )}
                <span>Đồng bộ thông tin</span>
              </button>

              <Link
                href={`/dashboard/${familySlug}/members/${linkedPerson.id}/edit?treeId=${treeId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fffdf7] border border-[#deb887] text-[#183b28] text-xs font-bold hover:bg-[#f5e7c7] transition-colors shadow-xs"
              >
                <Edit3 className="size-3.5" />
                <span>Cập nhật thông tin</span>
              </Link>

              <button
                type="button"
                onClick={() => setShowUnlinkModal(true)}
                className="text-xs text-[#8a7667] hover:text-[#8c1d1d] hover:underline cursor-pointer px-2 py-1 ml-auto lg:ml-0"
              >
                Đổi vị trí khác
              </button>
            </div>
          </div>

          {syncSuccessMsg && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center justify-between">
              <span>{syncSuccessMsg}</span>
              <button
                type="button"
                onClick={() => setSyncSuccessMsg(null)}
                className="text-emerald-700 hover:text-emerald-900 cursor-pointer ml-2 text-sm font-black"
              >
                ×
              </button>
            </div>
          )}
        </div>
      ) : pendingRequest ? (
        /* 2. NẾU CÓ YÊU CẦU ĐANG CHỜ PHÊ DUYỆT (PHƯƠNG ÁN B) */
        <div className="mb-6 rounded-2xl border-2 border-amber-400 bg-amber-50/70 p-4 sm:p-5 shadow-sm font-sans">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                <Clock3 className="size-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-amber-800 bg-amber-200 px-2 py-0.5 rounded-md border border-amber-300">
                    Đang chờ Ban Quản Trị phê duyệt
                  </span>
                  <span className="text-xs text-amber-900/80">
                    Gửi ngày {new Date(pendingRequest.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <h4 className="text-base font-bold text-amber-950 mt-1">
                  {pendingRequest.type === "claim_person" ? (
                    <>Yêu cầu nhận danh tính: <span className="text-[#8c1d1d]">{pendingRequest.person_name}</span></>
                  ) : (
                    <>
                      Yêu cầu thêm vào gia phả: <span className="text-[#8c1d1d]">{pendingRequest.new_person_data?.full_name}</span>
                      {pendingRequest.new_person_data?.parent_name && (
                        <span className="text-stone-600 font-normal"> (Con của: {pendingRequest.new_person_data.parent_name})</span>
                      )}
                    </>
                  )}
                </h4>
                {pendingRequest.message && (
                  <p className="text-xs text-amber-900/90 mt-1 italic bg-amber-100/60 p-2 rounded-lg border border-amber-200/60">
                    &ldquo;{pendingRequest.message}&rdquo;
                  </p>
                )}
                <p className="text-xs text-stone-600 mt-1.5">
                  Tộc trưởng hoặc Admin đang đối chiếu gia phả dòng họ. Bạn sẽ nhận được thông báo ngay khi yêu cầu được duyệt.
                </p>
              </div>
            </div>

            <div className="shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleCancelRequest(pendingRequest.id)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-stone-700 hover:text-red-700 hover:border-red-300 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                {isPending && <Loader2 className="size-3 animate-spin" />}
                <span>Hủy yêu cầu</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 3. NẾU CHƯA LIÊN KẾT & CHƯA CÓ YÊU CẦU: HIỂN THỊ BANNER GỬI YÊU CẦU */
        <div className="mb-6 relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/50 shadow-sm rounded-2xl font-sans">
          {/* Thông báo từ chối nếu có yêu cầu trước bị reject */}
          {rejectedRequest && !dismissedRejected && (
            <div className="mb-2 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start justify-between gap-2 text-xs text-red-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Yêu cầu phả hệ trước đó của bạn đã bị từ chối: </span>
                  <span>{rejectedRequest.rejection_reason || "Thông tin huyết thống chưa trùng khớp. Vui lòng kiểm tra và gửi lại."}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDismissedRejected(true)}
                className="text-red-600 hover:text-red-900 font-bold shrink-0 text-[11px]"
              >
                Đóng
              </button>
            </div>
          )}

          <div className="relative border border-[#deb887] bg-[#fffdf7] p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 rounded-xl">
            {/* 4 Traditional Corner Brackets */}
            <span className="pointer-events-none absolute top-1.5 left-1.5 size-2.5 border-t-2 border-l-2 border-[#8c1d1d]" />
            <span className="pointer-events-none absolute top-1.5 right-1.5 size-2.5 border-t-2 border-r-2 border-[#8c1d1d]" />
            <span className="pointer-events-none absolute bottom-1.5 left-1.5 size-2.5 border-b-2 border-l-2 border-[#8c1d1d]" />
            <span className="pointer-events-none absolute bottom-1.5 right-1.5 size-2.5 border-b-2 border-r-2 border-[#8c1d1d]" />

            <div className="flex items-start sm:items-center gap-3.5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#8c1d1d]/10 border border-[#8c1d1d]/30 text-[#8c1d1d] shadow-2xs">
                <GitBranch className="size-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8c1d1d] uppercase tracking-wider mb-0.5">
                  <Sparkles className="size-3.5" />
                  <span>Kết nối huyết thống</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#183b28] leading-snug">
                  Bạn chưa có tên trên Cây Gia Phả của dòng họ
                </h4>
                <p className="text-xs sm:text-sm text-[#6a594d] mt-1 leading-relaxed">
                  Gửi yêu cầu nhận tên hoặc thêm bản thân dưới tên cha/mẹ. Ban Quản Trị / Tộc Trưởng sẽ xác minh và phê duyệt đưa bạn lên phả đồ.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full lg:w-auto pt-2 lg:pt-0">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setShowClaimModal(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#deb887] bg-[#fffdf7] hover:bg-[#f5e7c7] text-[#183b28] font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
              >
                <Search className="size-4 text-[#8c1d1d]" />
                <span>Nhận tên tôi trên cây</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setShowAddModal(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#8c1d1d] hover:bg-[#a62424] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="size-4" />
                <span>Thêm tôi vào gia phả</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Nhận tên tôi trên cây (Claim Existing Person) */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl border-2 border-[#caa455] bg-[#fffdf7] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#deb887]/60 pb-3">
              <div className="flex items-center gap-2 text-[#8c1d1d]">
                <UserCheck className="size-5" />
                <h3 className="text-base sm:text-lg font-bold text-[#183b28]">
                  Yêu cầu nhận diện vị trí trên cây
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowClaimModal(false)}
                className="text-[#8a7667] hover:text-[#8c1d1d] p-1 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-xs text-[#6a594d]">
              Tìm và chọn tên của bạn đã có trong cây gia phả. Yêu cầu sẽ được gửi tới Ban Quản Trị dòng họ phê duyệt:
            </p>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* Ô tìm kiếm tên */}
            <div className="relative">
              <Search className="size-4 absolute left-3 top-3 text-[#8a7667]" />
              <input
                type="text"
                value={claimSearch}
                onChange={(e) => setClaimSearch(e.target.value)}
                placeholder="Nhập họ và tên để tìm kiếm nhanh..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#deb887] rounded-lg focus:outline-hidden focus:border-[#8c1d1d]"
              />
            </div>

            {/* Danh sách người để chọn */}
            <div className="max-h-52 overflow-y-auto divide-y divide-[#deb887]/30 border border-[#deb887]/50 rounded-xl bg-white p-1">
              {filteredClaimPersons.length > 0 ? (
                filteredClaimPersons.map((p) => {
                  const isSelected = selectedPersonId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPersonId(p.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#8c1d1d]/10 border border-[#8c1d1d] text-[#8c1d1d]"
                          : "hover:bg-[#f5e7c7]/40 text-[#2c1a11]"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs sm:text-sm">
                          {p.full_name}
                        </div>
                        <div className="text-[11px] text-[#7a6455] flex items-center gap-2 mt-0.5">
                          <span>{p.gender === "male" ? "Nam" : "Nữ"}</span>
                          {p.generation && <span>&bull; Đời {p.generation}</span>}
                          {p.birth_year && <span>&bull; Sinh {p.birth_year}</span>}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="size-5 rounded-full bg-[#8c1d1d] text-white flex items-center justify-center shrink-0">
                          <Check className="size-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-[#8a7667]">
                  Không tìm thấy tên phù hợp. Bạn có thể chọn mục &ldquo;Thêm tôi vào gia phả&rdquo;.
                </div>
              )}
            </div>

            {/* Lời nhắn căn cứ huyết thống */}
            <div>
              <label className="block text-xs font-bold text-[#2c1a11] mb-1">
                Lời nhắn / Căn cứ huyết thống (tuỳ chọn):
              </label>
              <textarea
                rows={2}
                value={claimMessage}
                onChange={(e) => setClaimMessage(e.target.value)}
                placeholder="Ví dụ: Cháu là con trai út của chú Bảy Nam ở chi Ba..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#deb887] rounded-lg focus:outline-hidden focus:border-[#8c1d1d]"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#deb887]/50">
              <button
                type="button"
                onClick={() => setShowClaimModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-[#6a594d] hover:bg-[#ede5d5] cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleClaim}
                disabled={!selectedPersonId || isPending}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#8c1d1d] hover:bg-[#a62424] text-white text-xs sm:text-sm font-bold shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                <span>{canManage ? "Xác nhận đây là tôi" : "Gửi yêu cầu phê duyệt"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Thêm tôi vào cây gia phả (Add Self Under Parent) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl border-2 border-[#caa455] bg-[#fffdf7] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#deb887]/60 pb-3">
              <div className="flex items-center gap-2 text-[#8c1d1d]">
                <UserPlus className="size-5" />
                <h3 className="text-base sm:text-lg font-bold text-[#183b28]">
                  Yêu cầu thêm bản thân vào Cây Gia Phả
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#8a7667] hover:text-[#8c1d1d] p-1 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-xs text-[#6a594d]">
              Nhập thông tin của bạn và chọn Cha hoặc Mẹ. Ban Quản Trị dòng họ sẽ kiểm tra và phê duyệt thêm vào phả đồ:
            </p>

            {/* Nút đồng bộ thông tin từ tài khoản */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs">
              <div className="flex items-center gap-2 text-stone-800 font-medium">
                <Sparkles className="size-4 text-amber-600 shrink-0" />
                <span>
                  Đồng bộ từ tài khoản: <strong>{currentUserName || "Bạn"}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (currentUserName) setFullName(currentUserName);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-amber-300 font-bold text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer"
              >
                <RefreshCw className="size-3 text-amber-700" />
                Tự động điền
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddSelf} className="space-y-3.5 text-xs sm:text-sm">
              {/* Họ và tên */}
              <div>
                <label className="block font-bold text-[#2c1a11] mb-1">
                  Họ và tên của bạn <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3 py-2 bg-white border border-[#deb887] rounded-lg focus:outline-hidden focus:border-[#8c1d1d]"
                />
              </div>

              {/* Giới tính & Năm sinh */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2c1a11] mb-1">
                    Giới tính <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "male" | "female")}
                    className="w-full px-3 py-2 bg-white border border-[#deb887] rounded-lg focus:outline-hidden focus:border-[#8c1d1d]"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#2c1a11] mb-1">
                    Năm sinh (Dương lịch)
                  </label>
                  <input
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    placeholder="Ví dụ: 1995"
                    className="w-full px-3 py-2 bg-white border border-[#deb887] rounded-lg focus:outline-hidden focus:border-[#8c1d1d]"
                  />
                </div>
              </div>

              {/* Chọn Cha hoặc Mẹ */}
              <div>
                <label className="block font-bold text-[#2c1a11] mb-1">
                  Chọn Cha hoặc Mẹ trong cây gia phả:
                </label>
                <div className="space-y-1.5">
                  <div className="relative">
                    <Search className="size-3.5 absolute left-2.5 top-2.5 text-[#8a7667]" />
                    <input
                      type="text"
                      value={parentSearch}
                      onChange={(e) => setParentSearch(e.target.value)}
                      placeholder="Tìm tên cha/mẹ trong danh sách họ tộc..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#deb887] rounded-lg focus:outline-hidden focus:border-[#8c1d1d]"
                    />
                  </div>

                  <select
                    value={selectedParentId}
                    onChange={(e) => setSelectedParentId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#deb887] rounded-lg focus:outline-hidden focus:border-[#8c1d1d] text-xs sm:text-sm"
                  >
                    <option value="">-- Chưa rõ / Không liên kết cha mẹ --</option>
                    {filteredParents.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name} ({p.gender === "male" ? "Nam" : "Nữ"}
                        {p.generation ? `, Đời ${p.generation}` : ""}
                        {p.birth_year ? `, Sinh ${p.birth_year}` : ""})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Thứ tự sinh */}
              <div>
                <label className="block font-bold text-[#2c1a11] mb-1">
                  Con thứ mấy trong gia đình:
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={birthOrder}
                  onChange={(e) => setBirthOrder(e.target.value)}
                  className="w-24 px-3 py-2 bg-white border border-[#deb887] rounded-lg focus:outline-hidden focus:border-[#8c1d1d]"
                />
              </div>

              {/* Lời nhắn căn cứ huyết thống */}
              <div>
                <label className="block font-bold text-[#2c1a11] mb-1">
                  Lời nhắn / Căn cứ huyết thống (tuỳ chọn):
                </label>
                <textarea
                  rows={2}
                  value={addMessage}
                  onChange={(e) => setAddMessage(e.target.value)}
                  placeholder="Ví dụ: Cháu là con gái đầu của bố Nguyễn Văn A, hiện đang sinh sống tại Hà Nội..."
                  className="w-full px-3 py-2 bg-white border border-[#deb887] rounded-lg focus:outline-hidden focus:border-[#8c1d1d]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#deb887]/50">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#6a594d] hover:bg-[#ede5d5] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#8c1d1d] hover:bg-[#a62424] text-white text-xs sm:text-sm font-bold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isPending && <Loader2 className="size-3.5 animate-spin" />}
                  <span>{canManage ? "Lưu & Nối tôi vào Cây Gia Phả" : "Gửi yêu cầu phê duyệt"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Xác nhận đổi vị trí / Hủy liên kết */}
      {showUnlinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-2xl border-2 border-[#caa455] bg-[#fffdf7] p-5 shadow-2xl space-y-4 text-center">
            <div className="size-12 rounded-full bg-amber-100 text-[#8c1d1d] mx-auto flex items-center justify-center">
              <RotateCcw className="size-6" />
            </div>
            <h3 className="text-base font-bold text-[#183b28]">
              Thay đổi liên kết tài khoản?
            </h3>
            <p className="text-xs text-[#6a594d]">
              Bạn đang liên kết với hồ sơ <strong>{linkedPerson?.full_name}</strong>. Bạn có muốn hủy liên kết hiện tại để chọn hoặc tạo hồ sơ khác không?
            </p>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowUnlinkModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-[#6a594d] hover:bg-[#ede5d5] cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleUnlink}
                disabled={isPending}
                className="px-4 py-2 rounded-lg bg-[#8c1d1d] text-white text-xs font-bold hover:bg-[#a62424] cursor-pointer"
              >
                {isPending ? "Đang xử lý..." : "Đồng ý hủy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
