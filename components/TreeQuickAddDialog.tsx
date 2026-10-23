"use client";

import { createTreeQuickMemberAction } from "@/app/actions/member";
import { useDashboard } from "@/components/DashboardContext";
import { Person, Relationship, RelationshipType } from "@/types";
import {
  isChildRelationshipType,
  relationshipTypeLabel,
} from "@/utils/treeHelpers";
import {
  Briefcase,
  Link2,
  Loader2,
  MapPin,
  Phone,
  Sparkles,
  UserPlus,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type QuickAddRelation = "standalone" | "child" | "spouse";

interface AnchoredQuickAddTarget {
  mode: "person" | "couple";
  anchorPersonId: string;
  anchorPerson: Person;
  spouse?: Person | null;
}

interface StandaloneQuickAddTarget {
  mode: "standalone";
}

type QuickAddTarget = AnchoredQuickAddTarget | StandaloneQuickAddTarget;

interface TreeQuickAddDialogProps {
  target: QuickAddTarget | null;
  personsMap: Map<string, Person>;
  relationships: Relationship[];
  onClose: () => void;
}

const childRelationshipOptions: Array<{
  value: RelationshipType;
  label: string;
}> = [
  { value: "biological_child", label: "Con ruột" },
  { value: "adopted_child", label: "Con nuôi" },
  { value: "step_child", label: "Con riêng" },
  { value: "foster_child", label: "Con được nuôi" },
];

function getSpousesForPerson(
  personId: string,
  relationships: Relationship[],
  personsMap: Map<string, Person>,
) {
  return relationships
    .filter(
      (relationship) =>
        relationship.type === "marriage" &&
        (relationship.person_a === personId ||
          relationship.person_b === personId),
    )
    .map((relationship) => {
      const spouseId =
        relationship.person_a === personId
          ? relationship.person_b
          : relationship.person_a;
      return personsMap.get(spouseId) ?? null;
    })
    .filter((person): person is Person => Boolean(person));
}

function getNextBirthOrder(parentId: string, relationships: Relationship[]) {
  return (
    relationships.filter(
      (relationship) =>
        isChildRelationshipType(relationship.type) &&
        relationship.person_a === parentId,
    ).length + 1
  );
}

function getOppositeGender(gender: Person["gender"]): Person["gender"] {
  if (gender === "male") return "female";
  if (gender === "female") return "male";
  return "other";
}

function targetHasAnchor(
  target: QuickAddTarget,
): target is AnchoredQuickAddTarget {
  return target.mode !== "standalone";
}

export default function TreeQuickAddDialog({
  target,
  personsMap,
  relationships,
  onClose,
}: TreeQuickAddDialogProps) {
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!target) return;

    let node = document.getElementById("tree-quick-add-portal");
    if (!node) {
      node = document.createElement("div");
      node.id = "tree-quick-add-portal";
      document.body.appendChild(node);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => setPortalNode(node), 0);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      setPortalNode(null);
    };
  }, [target]);

  if (!target || !portalNode) return null;

  const dialogKey = targetHasAnchor(target)
    ? `${target.mode}-${target.anchorPersonId}-${target.spouse?.id ?? "none"}`
    : "standalone";

  return createPortal(
    <TreeQuickAddDialogContent
      key={dialogKey}
      target={target}
      personsMap={personsMap}
      relationships={relationships}
      onClose={onClose}
    />,
    portalNode,
  );
}

function TreeQuickAddDialogContent({
  target,
  personsMap,
  relationships,
  onClose,
}: {
  target: QuickAddTarget;
  personsMap: Map<string, Person>;
  relationships: Relationship[];
  onClose: () => void;
}) {
  const router = useRouter();
  const { familyId, treeId } = useDashboard();
  const hasAnchor = targetHasAnchor(target);

  const spouseOptions = useMemo(
    () =>
      hasAnchor
        ? getSpousesForPerson(target.anchorPersonId, relationships, personsMap)
        : [],
    [hasAnchor, personsMap, relationships, target],
  );

  const defaultSpouseId =
    hasAnchor ? target.spouse?.id || spouseOptions[0]?.id || "" : "";
  const defaultBirthOrder =
    hasAnchor && target.mode !== "couple"
      ? getNextBirthOrder(target.anchorPersonId, relationships)
      : "";

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [gender, setGender] = useState<Person["gender"]>("male");
  const [relation, setRelation] = useState<QuickAddRelation>(
    hasAnchor ? "child" : "standalone",
  );
  const [childType, setChildType] =
    useState<RelationshipType>("biological_child");
  const [birthYear, setBirthYear] = useState<number | "">("");
  const [birthMonth, setBirthMonth] = useState<number | "">("");
  const [birthDay, setBirthDay] = useState<number | "">("");
  const [birthOrder, setBirthOrder] = useState<number | "">(defaultBirthOrder);
  const [relationNote, setRelationNote] = useState("");
  const [personNote, setPersonNote] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [occupation, setOccupation] = useState("");
  const [currentResidence, setCurrentResidence] = useState("");
  const [selectedSpouseId, setSelectedSpouseId] =
    useState<string>(defaultSpouseId);

  const close = () => {
    setError(null);
    onClose();
  };

  const chooseRelation = (nextRelation: QuickAddRelation) => {
    if (!hasAnchor && nextRelation !== "standalone") return;
    setRelation(nextRelation);
    setError(null);

    if (!hasAnchor || nextRelation === "standalone") {
      setBirthOrder("");
      setSelectedSpouseId("");
      return;
    }

    if (nextRelation === "spouse") {
      setGender(getOppositeGender(target.anchorPerson.gender));
      setBirthOrder("");
      setSelectedSpouseId("");
      return;
    }

    setGender("male");
    setBirthOrder(defaultBirthOrder);
    setSelectedSpouseId(defaultSpouseId);
  };

  const savePerson = async () => {
    if (!familyId || !treeId) {
      setError("Thiếu ngữ cảnh dòng họ hoặc cây gia phả.");
      return;
    }

    if (!fullName.trim()) {
      setError("Vui lòng nhập họ và tên.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("family_id", familyId);
      formData.set("tree_id", treeId);
      formData.set("relation", relation);
      if (hasAnchor) {
        formData.set("anchor_person_id", target.anchorPersonId);
        formData.set("selected_spouse_id", selectedSpouseId);
      }
      formData.set("child_type", childType);
      formData.set("full_name", fullName.trim());
      formData.set("other_names", otherNames.trim());
      formData.set("gender", gender);
      formData.set("birth_year", birthYear === "" ? "" : String(birthYear));
      formData.set("birth_month", birthMonth === "" ? "" : String(birthMonth));
      formData.set("birth_day", birthDay === "" ? "" : String(birthDay));
      formData.set("birth_order", birthOrder === "" ? "" : String(birthOrder));
      formData.set("relation_note", relationNote.trim());
      formData.set("person_note", personNote.trim());
      formData.set("phone_number", phoneNumber.trim());
      formData.set("occupation", occupation.trim());
      formData.set("current_residence", currentResidence.trim());

      const result = await createTreeQuickMemberAction(formData);
      if (result?.error) throw new Error(result.error);

      router.refresh();
      close();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể tạo thành viên.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const anchorTitle = hasAnchor
    ? target.mode === "couple" && target.spouse
      ? `${target.anchorPerson.full_name} và ${target.spouse.full_name}`
      : target.anchorPerson.full_name
    : "Chưa gắn với ai";
  const previewTitle =
    relation === "standalone"
      ? "Thành viên độc lập"
      : relation === "child"
        ? `Con của ${targetHasAnchor(target) ? anchorTitle : "người được chọn"}`
        : `Vợ/chồng của ${targetHasAnchor(target) ? target.anchorPerson.full_name : ""}`;

  return (
    <div
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-stone-950/70 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Thêm thành viên mới"
    >
      <div className="relative flex max-h-[calc(100dvh-24px)] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_32px_120px_rgba(20,16,12,0.42)] sm:max-h-[calc(100dvh-48px)]">
        <header className="shrink-0 border-b border-stone-100 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b56a10]">
                Thêm thành viên từ cây gia phả
              </p>
              <h3 className="mt-1 text-2xl font-black tracking-tight text-stone-950">
                Thêm thành viên mới
              </h3>
              <p className="mt-1 text-sm font-medium text-stone-500">
                {relation === "standalone" ? (
                  "Tạo hồ sơ trước, sau đó kéo dây để nối quan hệ trên sơ đồ."
                ) : (
                  <>
                    Đang tạo quan hệ từ{" "}
                    <span className="font-black text-stone-800">{anchorTitle}</span>.
                    Dây nối sẽ cập nhật ngay sau khi lưu.
                  </>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition hover:bg-stone-50 hover:text-stone-900"
              aria-label="Đóng"
            >
              <X className="size-5" />
            </button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 overflow-y-auto bg-stone-50/70 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4 p-4 sm:p-5">
            <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">
                Nút đang gắn với
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-full ${
                    hasAnchor ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {hasAnchor ? <Link2 className="size-5" /> : <UserPlus className="size-5" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-black text-stone-900">
                    {anchorTitle}
                  </p>
                  <p className="text-xs font-semibold text-stone-500">
                    {hasAnchor
                      ? target.mode === "couple"
                        ? "Tự động nối với cặp cha mẹ đang chọn"
                        : "Tự động tạo quan hệ theo nút này"
                      : "Thành viên sẽ nằm riêng để kéo nối sau"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-black text-stone-950">
                Cách tạo quan hệ
              </p>
              {hasAnchor ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => chooseRelation("child")}
                      className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${
                        relation === "child"
                          ? "border-amber-300 bg-amber-50 text-amber-800"
                          : "border-stone-200 bg-white text-stone-600 hover:border-amber-200 hover:text-amber-700"
                      }`}
                    >
                      Thêm con
                    </button>
                    <button
                      type="button"
                      onClick={() => chooseRelation("spouse")}
                      className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${
                        relation === "spouse"
                          ? "border-amber-300 bg-amber-50 text-amber-800"
                          : "border-stone-200 bg-white text-stone-600 hover:border-amber-200 hover:text-amber-700"
                      }`}
                    >
                      Thêm vợ/chồng
                    </button>
                  </div>

                  {relation === "child" && (
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-bold text-stone-700">
                        Loại quan hệ
                      </span>
                      <select
                        value={childType}
                        onChange={(event) =>
                          setChildType(event.target.value as RelationshipType)
                        }
                        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-800 outline-none focus:border-amber-500"
                      >
                        {childRelationshipOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {relation === "child" &&
                    (target.mode === "couple" || spouseOptions.length > 0) && (
                      <label className="block">
                        <span className="mb-1.5 block text-sm font-bold text-stone-700">
                          Người còn lại trong cặp
                        </span>
                        <select
                          value={selectedSpouseId}
                          onChange={(event) =>
                            setSelectedSpouseId(event.target.value)
                          }
                          className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-800 outline-none focus:border-amber-500"
                        >
                          <option value="">Không nối với người còn lại</option>
                          {spouseOptions.map((spouse) => (
                            <option key={spouse.id} value={spouse.id}>
                              {spouse.full_name}
                            </option>
                          ))}
                          {target.spouse &&
                            !spouseOptions.some(
                              (spouse) => spouse.id === target.spouse?.id,
                            ) && (
                              <option value={target.spouse.id}>
                                {target.spouse.full_name}
                              </option>
                            )}
                        </select>
                      </label>
                    )}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3">
                  <p className="font-black text-amber-900">Tạo thành viên rời</p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-amber-800">
                    Thành viên mới sẽ xuất hiện trên sơ đồ, chưa có dây quan hệ.
                    Admin có thể kéo nối sau.
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-black text-stone-950">
                Thông tin thành viên
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Họ và tên <span className="text-red-500">*</span>
                  </span>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Nhập họ và tên..."
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Tên gọi khác
                  </span>
                  <input
                    value={otherNames}
                    onChange={(event) => setOtherNames(event.target.value)}
                    placeholder="Tên thường gọi, biệt danh..."
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Giới tính
                  </span>
                  <select
                    value={gender}
                    onChange={(event) =>
                      setGender(event.target.value as Person["gender"])
                    }
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-800 outline-none focus:border-amber-500"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Năm sinh
                  </span>
                  <input
                    type="number"
                    value={birthYear}
                    onChange={(event) =>
                      setBirthYear(event.target.value ? Number(event.target.value) : "")
                    }
                    placeholder="Tùy chọn"
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Tháng
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={birthMonth}
                    onChange={(event) =>
                      setBirthMonth(event.target.value ? Number(event.target.value) : "")
                    }
                    placeholder="--"
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Ngày
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={birthDay}
                    onChange={(event) =>
                      setBirthDay(event.target.value ? Number(event.target.value) : "")
                    }
                    placeholder="--"
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {relation === "child" && (
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-bold text-stone-700">
                      Thứ tự sinh
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={birthOrder}
                      onChange={(event) =>
                        setBirthOrder(
                          event.target.value ? Number(event.target.value) : "",
                        )
                      }
                      placeholder="Tùy chọn"
                      className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                    />
                  </label>
                )}
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1 text-sm font-bold text-stone-700">
                    <Phone className="size-3.5" />
                    Điện thoại
                  </span>
                  <input
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    placeholder="Tùy chọn"
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1 text-sm font-bold text-stone-700">
                    <Briefcase className="size-3.5" />
                    Nghề nghiệp
                  </span>
                  <input
                    value={occupation}
                    onChange={(event) => setOccupation(event.target.value)}
                    placeholder="Tùy chọn"
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1 text-sm font-bold text-stone-700">
                    <MapPin className="size-3.5" />
                    Nơi ở hiện tại
                  </span>
                  <input
                    value={currentResidence}
                    onChange={(event) => setCurrentResidence(event.target.value)}
                    placeholder="Tùy chọn"
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Ghi chú hồ sơ
                  </span>
                  <input
                    value={personNote}
                    onChange={(event) => setPersonNote(event.target.value)}
                    placeholder="Tùy chọn"
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>
              </div>

              {relation !== "standalone" && (
                <label className="mt-4 block">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Ghi chú quan hệ
                  </span>
                  <input
                    value={relationNote}
                    onChange={(event) => setRelationNote(event.target.value)}
                    placeholder={relationshipTypeLabel(
                      relation === "child" ? childType : "marriage",
                    )}
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>
              )}
            </section>
          </div>

          <aside className="space-y-4 border-t border-stone-100 bg-white p-4 sm:p-5 lg:border-l lg:border-t-0">
            <div className="rounded-3xl bg-[#800000] px-4 py-4 text-white shadow-[0_14px_40px_rgba(128,0,0,0.18)]">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-white/65">
                <Sparkles className="size-4" />
                Xem trước
              </div>
              <p className="mt-2 text-lg font-black">{previewTitle}</p>
              <p className="mt-1 text-sm text-white/75">
                {relation === "standalone"
                  ? "Chưa có dây nối. Có thể kéo nối sau."
                  : "Dây nối sẽ cập nhật ngay sau khi lưu."}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">
                Tóm tắt
              </p>
              <dl className="mt-3 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="font-semibold text-stone-500">Tên</dt>
                  <dd className="text-right font-black text-stone-900">
                    {fullName || "Chưa nhập"}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="font-semibold text-stone-500">Quan hệ</dt>
                  <dd className="text-right font-black text-stone-900">
                    {relation === "standalone"
                      ? "Chưa nối"
                      : relation === "child"
                        ? relationshipTypeLabel(childType)
                        : "Vợ/chồng"}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="font-semibold text-stone-500">Kết nối</dt>
                  <dd className="text-right font-black text-stone-900">
                    {anchorTitle}
                  </dd>
                </div>
              </dl>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={close}
                className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-black text-stone-700 transition hover:bg-stone-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={savePerson}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#800000] px-4 py-3 text-sm font-black text-white transition hover:bg-[#650000] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                {saving ? "Đang lưu..." : "Tạo thành viên"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
