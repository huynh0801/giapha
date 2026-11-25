# Bổ Sung Trường Nghề Nghiệp, Nơi Ở Hiện Tại & Định Vị GPS Vào Hồ Sơ Cá Nhân - Kế Hoạch Thực Hiện

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bổ sung các trường Nghề nghiệp (`occupation`) và Nơi ở hiện tại (`current_residence`) vào trang Hồ sơ cá nhân (`/profile`), hỗ trợ tính năng định vị GPS tự động điền địa chỉ, và tự động đồng bộ dữ liệu vào hồ sơ thành viên dòng họ (`person_details_private`).

**Architecture:** Next.js Server Components kết hợp Server Actions và Supabase Database. Mở rộng bảng `profiles` với 2 cột mới. Client Component `ProfileForm` tích hợp HTML5 Geolocation API + OpenStreetMap Nominatim Reverse Geocoding. Server Action `updateUserProfileFull` cập nhật hồ sơ cá nhân và đồng bộ thông tin sang `person_details_private` của thành viên tương ứng trên cây gia phả.

**Tech Stack:** Next.js 16 (App Router), Supabase (PostgreSQL, RLS), Tailwind CSS, Lucide icons (`Briefcase`, `MapPin`, `LocateFixed` / `Navigation`, `Loader2`), Browser Geolocation API, OpenStreetMap Nominatim API.

## Global Constraints
- Tuân thủ phong cách giao diện truyền thống (tông vàng nâu ấm `#f5e7c7`, viền deckle `#e2d0a8`).
- Giữ nguyên các test hiện có, đảm bảo kiểm thử chạy pass 100%.
- Tự động điền địa chỉ từ GPS bằng tiếng Việt (`accept-language=vi`), cho phép người dùng xem và chỉnh sửa tự do.
- Xử lý lỗi từ chối cấp quyền GPS hoặc thiết bị không hỗ trợ một cách lịch sự, không làm treo form.

---

### Task 1: Migration CSDL & Cập Nhật Định Nghĩa Types

**Files:**
- Create: `supabase/migrations/20261125200000_add_profile_occupation_residence.sql`
- Modify: `types/index.ts:19-45`

**Interfaces:**
- Consumes: `Profile`, `AdminUserData` trong `types/index.ts`
- Produces: `occupation?: string | null; current_residence?: string | null;` trên `Profile` và `AdminUserData`

- [x] **Step 1: Tạo migration SQL thêm 2 cột vào bảng `profiles`**
  Tạo file `supabase/migrations/20261125200000_add_profile_occupation_residence.sql`:
  ```sql
  ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS occupation TEXT,
    ADD COLUMN IF NOT EXISTS current_residence TEXT;

  COMMENT ON COLUMN public.profiles.occupation IS 'Nghề nghiệp hoặc chuyên môn của người dùng';
  COMMENT ON COLUMN public.profiles.current_residence IS 'Địa chỉ hoặc nơi ở hiện tại của người dùng';
  ```

- [x] **Step 2: Cập nhật type `Profile` và `AdminUserData` trong `types/index.ts`**
  Thêm `occupation?: string | null;` và `current_residence?: string | null;` vào interface `Profile` và `AdminUserData`.

- [x] **Step 3: Kiểm tra tính tương thích TypeScript**
  Chạy `npx tsc --noEmit` để đảm bảo không có xung đột type.

- [x] **Step 4: Commit thay đổi Task 1**
  `git add supabase/migrations types/index.ts && git commit -m "feat(profile): add occupation and current_residence to db schema and types"`

---

### Task 2: Nâng Cấp Server Action `updateUserProfileFull` & Tự Động Đồng Bộ

**Files:**
- Modify: `app/actions/user.ts:262-302`
- Test: `tests/user-profile.test.mjs`

**Interfaces:**
- Consumes: `formData.get("occupation")`, `formData.get("current_residence")`
- Produces: `updateUserProfileFull` nhận và lưu 2 trường mới vào `profiles`, đồng thời đồng bộ vào `person_details_private` nếu có liên kết `member_links`.

- [x] **Step 1: Viết test mở rộng trong `tests/user-profile.test.mjs`**
  Thêm kiểm tra assertion cho `occupation` và `current_residence` trong file `app/actions/user.ts`.

- [x] **Step 2: Cập nhật `updateUserProfileFull` trong `app/actions/user.ts`**
  - Trích xuất `occupation = readTrimmed(formData, "occupation");` và `current_residence = readTrimmed(formData, "current_residence");`.
  - Cập nhật vào đối tượng `updateData` ghi vào bảng `profiles`.
  - Thêm logic tìm các dòng họ mà người dùng có liên kết:
    ```typescript
    // Tự động đồng bộ sang hồ sơ thành viên cây gia phả nếu đã liên kết
    try {
      const { data: families } = await supabase
        .from("families")
        .select("id, settings");
      if (families) {
        for (const fam of families) {
          const settings = fam.settings as Record<string, unknown> | null;
          const memberLinks = settings?.member_links as Record<string, string> | undefined;
          const personId = memberLinks?.[user.id];
          if (personId) {
            // Lấy tree_id mặc định của family
            const { data: tree } = await supabase
              .from("trees")
              .select("id")
              .eq("family_id", fam.id)
              .maybeSingle();
            if (tree?.id) {
              await supabase.from("person_details_private").upsert({
                person_id: personId,
                family_id: fam.id,
                tree_id: tree.id,
                phone_number: phoneNumber || null,
                occupation: occupation || null,
                current_residence: current_residence || null,
              }, { onConflict: "person_id,family_id,tree_id" });
            }
          }
        }
      }
    } catch (syncErr) {
      console.warn("Failed to sync profile to genealogy member:", syncErr);
    }
    ```
  - Thêm revalidate các đường dẫn `/dashboard`.

- [x] **Step 3: Chạy test xác nhận logic Server Action**
  Chạy `node --test tests/user-profile.test.mjs`.

- [x] **Step 4: Commit thay đổi Task 2**
  `git add app/actions/user.ts tests/user-profile.test.mjs && git commit -m "feat(profile): handle occupation and residence in updateUserProfileFull with genealogy sync"`

---

### Task 3: Cập Nhật Giao Diện `ProfileForm.tsx` & Hỗ Trợ Định Vị GPS

**Files:**
- Modify: `components/ProfileForm.tsx`
- Modify: `app/profile/page.tsx:40-48`

**Interfaces:**
- Consumes: `initialProfile.occupation`, `initialProfile.currentResidence`
- Produces: Ô nhập Nghề nghiệp, Nơi ở hiện tại, Nút định vị GPS kèm hàm `handleDetectLocation`

- [x] **Step 1: Cập nhật `app/profile/page.tsx` truyền dữ liệu ban đầu**
  Bổ sung `occupation: profile.occupation || ""` và `currentResidence: profile.current_residence || ""` vào `initialProfile`.

- [x] **Step 2: Cập nhật `ProfileFormProps` và khởi tạo state trong `components/ProfileForm.tsx`**
  - Mở rộng `initialProfile`:
    ```typescript
    occupation?: string | null;
    currentResidence?: string | null;
    ```
  - State:
    ```typescript
    const [occupation, setOccupation] = useState(initialProfile.occupation || "");
    const [currentResidence, setCurrentResidence] = useState(initialProfile.currentResidence || "");
    const [isLocating, setIsLocating] = useState(false);
    ```

- [x] **Step 3: Xây dựng hàm định vị GPS `handleDetectLocation`**
  ```typescript
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setProfileMsg({
        type: "error",
        text: "Trình duyệt của bạn không hỗ trợ định vị GPS.",
      });
      return;
    }

    setIsLocating(true);
    setProfileMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=vi`
          );
          if (!res.ok) throw new Error("Không thể kết nối dịch vụ bản đồ.");
          const data = await res.json();
          if (data && data.display_name) {
            setCurrentResidence(data.display_name);
            setProfileMsg({
              type: "success",
              text: "Đã định vị thành công địa chỉ hiện tại!",
            });
          } else {
            setCurrentResidence(`Tọa độ: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          }
        } catch (err) {
          console.error("GPS Reverse Geocode Error:", err);
          setProfileMsg({
            type: "error",
            text: "Đã lấy được tọa độ nhưng chưa chuyển đổi được địa chỉ. Vui lòng nhập tay.",
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = "Không thể lấy vị trí hiện tại.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Bạn đã từ chối quyền truy cập vị trí. Vui lòng cấp quyền trong cài đặt trình duyệt.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Yêu cầu định vị đã hết thời gian chờ.";
        }
        setProfileMsg({ type: "error", text: msg });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };
  ```

- [x] **Step 4: Render 2 ô nhập liệu và nút GPS trong Form**
  - Ô **Nghề nghiệp**: Icon `Briefcase`, input text `value={occupation}`.
  - Ô **Nơi ở hiện tại**: Icon `MapPin`, input text `value={currentResidence}`, kèm nút icon `LocateFixed` (hoặc `Navigation`) với tooltip / nhãn "Định vị GPS".
  - Trong `handleSaveProfile`:
    `formData.append("occupation", occupation.trim());`
    `formData.append("current_residence", currentResidence.trim());`
  - Trong `handleAvatarChange`:
    `saveFormData.append("occupation", occupation);`
    `saveFormData.append("current_residence", currentResidence);`

- [x] **Step 5: Commit thay đổi Task 3**
  `git add components/ProfileForm.tsx app/profile/page.tsx && git commit -m "feat(profile): add occupation, residence inputs and gps geolocation button"`

---

### Task 4: Kiểm Thử Toàn Diện & Đóng Gói Hoàn Tất

**Files:**
- Modify: `tests/user-profile.test.mjs`

- [x] **Step 1: Cập nhật `tests/user-profile.test.mjs`**
  Đảm bảo test kiểm tra:
  - Form có chứa `Briefcase`, `MapPin`, `LocateFixed` hoặc `handleDetectLocation`.
  - Có các nhãn `Nghề nghiệp`, `Nơi ở hiện tại`.
  - Kiểm tra `updateUserProfileFull` nhận đúng các trường mới.

- [x] **Step 2: Chạy bộ kiểm thử tự động**
  Chạy `node --test tests/user-profile.test.mjs`.

- [x] **Step 3: Chạy TypeScript check**
  Chạy `npx tsc --noEmit` để đảm bảo không có lỗi type.

- [x] **Step 4: Commit và hoàn tất**
  `git add tests/user-profile.test.mjs && git commit -m "test(profile): update tests to cover occupation, residence and gps location"`
