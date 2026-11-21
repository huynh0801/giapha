# Kế Hoạch Triển Khai: Chức Năng Xóa Dòng Họ Cho Super Admin

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thêm nút xóa dòng họ trực tiếp trên từng dòng của bảng Dashboard (`/admin/families/dashboard`) đi kèm Modal xác nhận đối chiếu tên dòng họ an toàn, tự động dọn dẹp state và cập nhật danh sách.

**Architecture:** 
- Xây dựng component `DeleteFamilyModal.tsx` độc lập, rõ ràng, có cơ chế đối chiếu chuỗi tên dòng họ trước khi kích hoạt nút xóa.
- Tích hợp `DeleteFamilyModal` và icon thùng rác vào từng dòng bảng dữ liệu trong `AdminFamilyDashboard.tsx`, đồng thời kết nối nút xóa ở thanh chi tiết (drawer) mở chung Modal này.
- Tái sử dụng Server Action `deleteFamilyAction(formData)` và RPC `delete_family` đã có sẵn cơ chế cascade và bảo mật Super Admin.
- Xử lý mượt mà việc chuyển đổi `selectedFamilyId` khi dòng họ đang hiển thị bị xóa.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Lucide React, Node.js Test Runner (`node:test`).

## Global Constraints

- Không phá vỡ các luồng quản trị hiện có trong `AdminFamilyDashboard.tsx` (đổi primary admin, cập nhật trạng thái, v.v.).
- Đảm bảo 100% test hiện có trong bộ test (`npm test`) tiếp tục pass.
- Bắt buộc nhập chính xác tên dòng họ mới kích hoạt nút xóa vĩnh viễn.
- Chỉ tài khoản Super Admin mới được phép thực hiện hành động này.

---

### Task 1: Xây Dựng Component `DeleteFamilyModal` & Viết Test Khung UI

**Files:**
- Create: `components/admin/DeleteFamilyModal.tsx`
- Create: `tests/family-deletion-ui.test.mjs`

**Interfaces:**
- Consumes: `AdminFamilyRow` từ `components/AdminFamilyDashboard.tsx`.
- Produces: `DeleteFamilyModal({ family, isOpen, onClose, onConfirm, isDeleting, errorMessage })`.

- [ ] **Step 1: Viết test cho `DeleteFamilyModal` và cấu trúc trong `tests/family-deletion-ui.test.mjs`**

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf-8");
}

test("DeleteFamilyModal component is properly defined with safety confirmation", () => {
  const modalPath = "components/admin/DeleteFamilyModal.tsx";
  assert.ok(fs.existsSync(path.join(root, modalPath)), "DeleteFamilyModal.tsx should exist");
  const modalCode = read(modalPath);

  assert.match(modalCode, /DeleteFamilyModal/);
  assert.match(modalCode, /Xác nhận xóa dòng họ|Xóa dòng họ/);
  assert.match(modalCode, /Trash2|AlertTriangle/);
  assert.match(modalCode, /confirmation/i);
  assert.match(modalCode, /disabled=\{/);
  assert.match(modalCode, /Loader2/);
  assert.match(modalCode, /onClose/);
  assert.match(modalCode, /onConfirm/);
});
```

- [ ] **Step 2: Chạy test để xác nhận test thất bại**

Run: `node --test tests/family-deletion-ui.test.mjs`
Expected: FAIL (tệp chưa tồn tại).

- [ ] **Step 3: Tạo component `components/admin/DeleteFamilyModal.tsx`**

```tsx
"use client";

import { AdminFamilyRow } from "@/components/AdminFamilyDashboard";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface DeleteFamilyModalProps {
  family: AdminFamilyRow | null;
  isOpen: boolean;
  isDeleting: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onConfirm: (family: AdminFamilyRow, confirmationName: string) => void;
}

export default function DeleteFamilyModal({
  family,
  isOpen,
  isDeleting,
  errorMessage,
  onClose,
  onConfirm,
}: DeleteFamilyModalProps) {
  const [confirmationInput, setConfirmationInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setConfirmationInput("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !family) return null;

  const isMatched = confirmationInput.trim() === family.name.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMatched && !isDeleting) {
      onConfirm(family, confirmationInput);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-stone-900/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertTriangle className="size-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-stone-900">
                Xóa dòng họ vĩnh viễn
              </h3>
              <p className="text-xs font-semibold text-stone-500">
                Hành động nguy hiểm không thể hoàn tác
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3 rounded-2xl bg-red-50/70 p-4 border border-red-200">
          <p className="text-sm font-bold text-red-950">
            Bạn đang chuẩn bị xóa dòng họ:{" "}
            <span className="font-black text-red-600 underline">
              {family.name}
            </span>{" "}
            <span className="text-xs font-semibold text-stone-500">
              (/{family.slug})
            </span>
          </p>
          <p className="text-xs font-medium leading-relaxed text-red-800">
            Toàn bộ dữ liệu thành viên ({family.person_count || 0} hồ sơ), cây gia phả,
            bài viết, sự kiện, yêu cầu và tư cách thành viên thuộc dòng họ này sẽ bị xóa
            hoàn toàn khỏi cơ sở dữ liệu.
          </p>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-xl bg-red-100 p-3 text-xs font-bold text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Để xác nhận, vui lòng nhập chính xác tên dòng họ:{" "}
              <span className="font-black text-stone-950 select-all">
                {family.name}
              </span>
            </label>
            <input
              type="text"
              autoFocus
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              disabled={isDeleting}
              placeholder={family.name}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100 disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={!isMatched || isDeleting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-200 disabled:shadow-none"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Đang xóa...</span>
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  <span>Xác nhận xóa dòng họ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Chạy test để xác nhận test pass**

Run: `node --test tests/family-deletion-ui.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit component và test**

Run: `git add components/admin/DeleteFamilyModal.tsx tests/family-deletion-ui.test.mjs; git commit -m "feat(admin): create DeleteFamilyModal component and unit test"`

---

### Task 2: Tích Hợp Nút Xóa và Modal Vào `AdminFamilyDashboard.tsx`

**Files:**
- Modify: `components/AdminFamilyDashboard.tsx`
- Modify: `tests/family-deletion-ui.test.mjs`

**Interfaces:**
- Consumes: `DeleteFamilyModal`, `deleteFamilyAction`.
- Produces: Action button trong bảng và modal trigger kết nối với server action.

- [ ] **Step 1: Mở rộng test trong `tests/family-deletion-ui.test.mjs` để kiểm tra tích hợp trong `AdminFamilyDashboard.tsx`**

```javascript
test("AdminFamilyDashboard integrates trash button in table and triggers DeleteFamilyModal", () => {
  const dashboardCode = read("components/AdminFamilyDashboard.tsx");

  assert.match(dashboardCode, /DeleteFamilyModal/);
  assert.match(dashboardCode, /familyToDelete/);
  assert.match(dashboardCode, /setFamilyToDelete/);
  assert.match(dashboardCode, /Trash2/);
  assert.match(dashboardCode, /handleConfirmDelete/);
});
```

- [ ] **Step 2: Chạy test để xác nhận test thất bại**

Run: `node --test tests/family-deletion-ui.test.mjs`
Expected: FAIL (chưa tích hợp vào dashboard).

- [ ] **Step 3: Cập nhật `components/AdminFamilyDashboard.tsx`**

1. Import `DeleteFamilyModal` từ `@/components/admin/DeleteFamilyModal`.
2. Thêm state:
   ```tsx
   const [familyToDelete, setFamilyToDelete] = useState<AdminFamilyRow | null>(null);
   const [deleteModalError, setDeleteModalError] = useState<string | null>(null);
   ```
3. Thêm hàm xử lý `handleConfirmDelete`:
   ```tsx
   const handleConfirmDelete = (family: AdminFamilyRow, confirmationName: string) => {
     setDeleteModalError(null);
     const formData = new FormData();
     formData.set("family_id", family.id);
     formData.set("family_name", family.name);
     formData.set("confirmation", confirmationName);

     runAction("delete-family", async () => {
       const result = await deleteFamilyAction(formData);
       if (result && "error" in result && result.error) {
         setDeleteModalError(result.error);
         return result;
       }
       setFamilyToDelete(null);
       setDeleteModalError(null);
       if (selectedFamilyId === family.id) {
         const remaining = families.filter((f) => f.id !== family.id);
         setSelectedFamilyId(remaining[0]?.id || "");
       }
       setNotice({
         type: "success",
         text: `Đã xóa thành công dòng họ ${family.name}.`,
       });
       router.refresh();
       return result;
     });
   };
   ```
4. Thêm nút thùng rác trong cột Thao tác của bảng:
   ```tsx
   <button
     type="button"
     onClick={(event) => {
       event.stopPropagation();
       setDeleteModalError(null);
       setFamilyToDelete(family);
     }}
     className="inline-flex items-center justify-center rounded-full border border-stone-200 bg-white p-2 text-stone-700 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
     title={`Xóa dòng họ ${family.name}`}
   >
     <Trash2 className="size-4" />
   </button>
   ```
5. Trong section "Xóa dòng họ" ở drawer bên phải, cập nhật nút bấm để mở `setFamilyToDelete(selectedFamily)` thay cho form nhập gò bó.
6. Render `<DeleteFamilyModal>`:
   ```tsx
   <DeleteFamilyModal
     family={familyToDelete}
     isOpen={familyToDelete !== null}
     isDeleting={pendingAction === "delete-family"}
     errorMessage={deleteModalError}
     onClose={() => {
       if (pendingAction !== "delete-family") {
         setFamilyToDelete(null);
         setDeleteModalError(null);
       }
     }}
     onConfirm={handleConfirmDelete}
   />
   ```

- [ ] **Step 4: Chạy test để xác nhận test pass**

Run: `node --test tests/family-deletion-ui.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit tích hợp**

Run: `git add components/AdminFamilyDashboard.tsx tests/family-deletion-ui.test.mjs; git commit -m "feat(admin): integrate delete button and modal into AdminFamilyDashboard"`

---

### Task 3: Cập Nhật Script Test trong `package.json` & Kiểm Thử Toàn Diện

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Bổ sung `tests/family-deletion-ui.test.mjs` vào script `test` trong `package.json`**
- [ ] **Step 2: Chạy toàn bộ test suite `npm test`**

Run: `npm test`
Expected: Tất cả bài test đều PASS.

- [ ] **Step 3: Chạy TypeScript check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Commit và hoàn tất**

Run: `git add package.json; git commit -m "test: register family deletion UI tests and verify full suite"`
