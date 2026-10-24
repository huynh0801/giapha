"use client";

import { useState, useTransition } from "react";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  GitBranch,
  Loader2,
  RotateCcw,
  Search,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  claimExistingPersonAction,
  addSelfToFamilyTreeAction,
  unlinkSelfAction,
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
}

export default function MemberClaimBanner({
  familyId,
  familySlug,
  treeId,
  currentUserId,
  currentUserName,
  linkedPerson,
  persons = [],
}: MemberClaimBannerProps) {
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Claim Modal States
  const [claimSearch, setClaimSearch] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  // Add Self Modal States
  const [fullName, setFullName] = useState(currentUserName || "");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [birthYear, setBirthYear] = useState("");
  const [selectedParentId, setSelectedParentId] = useState("");
  const [birthOrder, setBirthOrder] = useState("1");
  const [parentSearch, setParentSearch] = useState("");

  // Handle claiming existing person
  const handleClaim = () => {
    if (!selectedPersonId) return;
    setErrorMsg(null);
    startTransition(async () => {
      const res = await claimExistingPersonAction({
        familyId,
        personId: selectedPersonId,
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
      {/* 1. Nếu đã liên kết: Hiển thị Thẻ nhận diện vị trí của thành viên */}
      {linkedPerson ? (
        <div className="mb-6 rounded-2xl border-2 border-[#caa455] bg-[#fffdf7] p-3.5 sm:p-4 shadow-sm font-sans">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#8c1d1d] text-white shadow-xs">
                <UserCheck className="size-5" />
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
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#183b28] truncate mt-0.5">
                  {linkedPerson.full_name}
                  {linkedPerson.birth_year ? ` (sinh năm ${linkedPerson.birth_year})` : ""}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => setShowUnlinkModal(true)}
                className="text-xs text-[#8a7667] hover:text-[#8c1d1d] hover:underline cursor-pointer px-2 py-1"
              >
                Đổi vị trí khác
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 2. Nếu chưa liên kết: Hiển thị Banner mời nhận diện / thêm tên vào cây gia phả */
        <div className="mb-6 relative p-1.5 border-2 border-[#caa455] bg-[#f5e7c7]/50 shadow-sm rounded-2xl font-sans">
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
                  Để hiển thị tên của bạn trong sơ đồ gia phả và các thế hệ, hãy chọn vị trí sẵn có hoặc thêm bản thân dưới tên cha/mẹ.
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
                  Nhận diện vị trí của bạn trên cây
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowClaimModal(false)}
                className="text-[#8a7667] hover:text-[#8c1d1d] p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-xs text-[#6a594d]">
              Tìm và chọn tên của bạn đã được Trưởng tộc nhập sẵn trong cây gia phả:
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
            <div className="max-h-60 overflow-y-auto divide-y divide-[#deb887]/30 border border-[#deb887]/50 rounded-xl bg-white p-1">
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
                <span>Xác nhận đây là tôi</span>
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
                  Thêm bản thân vào Cây Gia Phả
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#8a7667] hover:text-[#8c1d1d] p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-xs text-[#6a594d]">
              Nhập thông tin của bạn và chọn Cha hoặc Mẹ để hệ thống tự động cắm đúng cành nhánh trong sơ đồ phả hệ:
            </p>

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
                <p className="text-[11px] text-[#7a6455] mt-1">
                  * Hệ thống sẽ tự động nối bạn làm con của người này và xếp đúng đời kế tiếp.
                </p>
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
                  <span>Lưu & Nối tôi vào Cây Gia Phả</span>
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
