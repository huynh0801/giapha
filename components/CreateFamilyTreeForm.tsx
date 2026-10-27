"use client";

import { createFamilyTreeAction } from "@/app/actions/family";
import { slugify } from "@/utils/slug";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CreateFamilyTreeFormProps {
  familyId: string;
}

export default function CreateFamilyTreeForm({
  familyId,
}: CreateFamilyTreeFormProps) {
  const [nameValue, setNameValue] = useState("");
  const [slugValue, setSlugValue] = useState("");
  const [isCustomSlug, setIsCustomSlug] = useState(false);

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

  return (
    <form
      action={createFamilyTreeAction}
      className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <input type="hidden" name="family_id" value={familyId} />
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <Plus className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-stone-900">
            Tạo cây gia phả mới
          </h2>
          <p className="text-sm text-stone-500">
            Dành cho chi phái hoặc nhánh dữ liệu riêng.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-stone-700">
            Tên cây
          </span>
          <input
            name="name"
            required
            value={nameValue}
            onChange={handleNameChange}
            placeholder="Ví dụ: Cây gia phả chính"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-stone-700">
            Slug
          </span>
          <input
            name="slug"
            value={slugValue}
            onChange={handleSlugChange}
            placeholder="cay-gia-pha-chinh"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-stone-700">
            Mô tả
          </span>
          <textarea
            name="description"
            rows={4}
            placeholder="Ghi chú về phạm vi cây, chi phái hoặc dữ liệu đang nhập."
            className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-stone-700">
            Chế độ hiển thị
          </span>
          <select
            name="visibility"
            defaultValue="private"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
          >
            <option value="private">Riêng tư</option>
            <option value="family_only">Chỉ trong dòng họ</option>
          </select>
        </label>

        <label className="flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
          <input
            type="checkbox"
            name="is_primary"
            className="size-4 rounded border-amber-300"
          />
          Đặt làm cây chính sau khi tạo
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-700"
        >
          Tạo cây gia phả
        </button>
      </div>
    </form>
  );
}
