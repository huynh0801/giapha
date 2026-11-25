# Thiết Kế Chi Tiết: Bổ Sung Trường Nghề Nghiệp & Nơi Ở Hiện Tại Vào Hồ Sơ Cá Nhân

- **Ngày tạo:** 2026-11-25
- **Tác giả:** Antigravity & User
- **Trạng thái:** Chờ người dùng phê duyệt (Pending Review)

---

## 1. Mục tiêu & Bối cảnh

Hiện tại, trang **Hồ sơ cá nhân** (`/profile`) của tài khoản cho phép người dùng xem và cập nhật họ tên (`full_name`), số điện thoại (`phone_number`), ảnh đại diện (`avatar_url`), và đổi mật khẩu.

Tuy nhiên, người dùng chưa thể cập nhật thông tin nghề nghiệp và nơi ở hiện tại của bản thân. Trong khi đó, ở các cây gia phả dòng họ, bảng `person_details_private` đã có hai trường `occupation` (Nghề nghiệp) và `current_residence` (Nơi ở hiện tại) nhưng chỉ người có quyền quản trị mới chỉnh sửa được trong form quản lý thành viên.

### Mục tiêu cần đạt:
1. Cho phép người dùng trực tiếp cập nhật **Nghề nghiệp** (`occupation`) và **Nơi ở hiện tại** (`current_residence`) ngay tại trang **Hồ sơ cá nhân** (`/profile`).
2. Lưu trữ 2 trường thông tin này trong bảng `public.profiles`.
3. Tự động đồng bộ hai thông tin này vào hồ sơ thành viên dòng họ (`person_details_private`) nếu tài khoản người dùng đã được liên kết với một thành viên trên cây gia phả (`member_links[user.id]`).

---

## 2. Kiến trúc Cơ sở Dữ liệu

### 2.1 Migration SQL
Tạo migration `supabase/migrations/20261125200000_add_profile_occupation_residence.sql`:

```sql
-- Thêm cột occupation và current_residence vào bảng profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS occupation TEXT,
  ADD COLUMN IF NOT EXISTS current_residence TEXT;

COMMENT ON COLUMN public.profiles.occupation IS 'Nghề nghiệp hoặc chuyên môn của người dùng';
COMMENT ON COLUMN public.profiles.current_residence IS 'Địa chỉ hoặc nơi ở hiện tại của người dùng';
```

### 2.2 Quy tắc bảo mật RLS
- Bảng `public.profiles` đã có sẵn chính sách RLS cho phép người dùng tự cập nhật dòng của mình (`auth.uid() = id`). Hai cột mới kế thừa trọn vẹn chính sách này, không yêu cầu thay đổi RLS.

---

## 3. Cập nhật Type Definitions (`types/index.ts`)

Mở rộng interface `Profile` và `AdminUserData`:

```typescript
export interface Profile {
  id: string;
  full_name: string | null;
  role: PlatformRole;
  is_active: boolean;
  must_change_password: boolean;
  password_changed_at: string | null;
  avatar_url?: string | null;
  phone_number?: string | null;
  occupation?: string | null;
  current_residence?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUserData {
  id: string;
  full_name: string | null;
  email: string;
  phone_number?: string | null;
  occupation?: string | null;
  current_residence?: string | null;
  role: PlatformRole;
  is_active: boolean;
  must_change_password: boolean;
  created_at: string;
}
```

---

## 4. Logic Xử lý Phía Server (`app/actions/user.ts`)

### Cập nhật action `updateUserProfileFull`
1. Đọc dữ liệu từ `FormData`:
   - `occupation = readTrimmed(formData, "occupation")`
   - `current_residence = readTrimmed(formData, "current_residence")`
2. Cập nhật vào bảng `profiles`:
   ```typescript
   const updateData: Record<string, unknown> = {
     full_name: fullName,
     phone_number: phoneNumber || null,
     occupation: occupation || null,
     current_residence: current_residence || null,
     updated_at: new Date().toISOString(),
   };
   ```
3. **Cơ chế tự động đồng bộ sang hồ sơ thành viên dòng họ:**
   - Tìm kiếm các dòng họ mà tài khoản đang tham gia có lưu thông tin liên kết thành viên (`settings.member_links[user.id] = person_id`).
   - Với mỗi `person_id` tìm thấy, thực hiện upsert thông tin vào bảng `person_details_private`:
     ```typescript
     await supabaseAdmin.from("person_details_private").upsert({
       person_id: personId,
       family_id: family.id,
       tree_id: familyTreeId,
       phone_number: phoneNumber || null,
       occupation: occupation || null,
       current_residence: current_residence || null,
     }, { onConflict: "person_id" });
     ```
   - Revalidate các đường dẫn liên quan:
     - `revalidatePath("/profile")`
     - `revalidatePath("/")`
     - `revalidatePath("/dashboard")`
     - `revalidatePath("/dashboard/[familySlug]")`
     - `revalidatePath("/dashboard/[familySlug]/members")`

---

## 5. Giao diện Người dùng

### 5.1 `app/profile/page.tsx`
Cung cấp giá trị ban đầu vào đối tượng `initialProfile`:
```typescript
const initialProfile = {
  id: user.id,
  fullName: profile.full_name || "",
  phoneNumber: profile.phone_number || "",
  occupation: profile.occupation || "",
  currentResidence: profile.current_residence || "",
  email: user.email || "",
  role: profile.role,
  avatarUrl: profile.avatar_url || null,
  createdAt: profile.created_at,
};
```

### 5.2 `components/ProfileForm.tsx`
- Nhận `occupation` và `currentResidence` trong props `initialProfile`.
- Khởi tạo state:
  ```typescript
  const [occupation, setOccupation] = useState(initialProfile.occupation || "");
  const [currentResidence, setCurrentResidence] = useState(initialProfile.currentResidence || "");
  ```
- Thêm 2 trường input trong khối **Thông tin cá nhân**:
  1. **Nghề nghiệp**:
     - Nhãn: `NGHỀ NGHIỆP`
     - Icon: `Briefcase` (từ `lucide-react`)
     - Input text: `placeholder="Ví dụ: Kỹ sư, Giáo viên, Bác sĩ..."`
     - State binding: `occupation`
  2. **Nơi ở hiện tại & Định vị GPS:**
     - Nhãn: `NƠI Ở HIỆN TẠI`
     - Icon: `MapPin` (từ `lucide-react`)
     - Input text: `placeholder="Ví dụ: Ba Đình, Hà Nội..."`
     - State binding: `currentResidence`
     - **Nút định vị GPS ("Lấy vị trí hiện tại"):**
       - Tích hợp nút icon `Navigation` / `LocateFixed` ngay cạnh hoặc bên phải ô nhập nơi ở.
       - Khi nhấn, kích hoạt `navigator.geolocation.getCurrentPosition`.
       - Hiển thị trạng thái đang định vị (`isLocating` với spinner).
       - Reverse geocode tọa độ sang địa chỉ tiếng Việt rõ ràng thông qua OpenStreetMap Nominatim API (`accept-language=vi`).
       - Tự động điền chuỗi địa chỉ xác định được vào ô nhập `Nơi ở hiện tại` để người dùng có thể xem lại hoặc tinh chỉnh nếu muốn.
       - Xử lý lỗi thân thiện nếu người dùng từ chối cấp quyền vị trí hoặc thiết bị không hỗ trợ GPS.
- Trong hàm `handleSaveProfile`:
  - `formData.append("occupation", occupation.trim());`
  - `formData.append("current_residence", currentResidence.trim());`
- Trong hàm `handleAvatarChange`:
  - Giữ lại `occupation` và `currentResidence` khi tự động lưu avatar mới.

---

## 6. Kế hoạch Kiểm thử & Xác minh

1. **Unit / Integration Tests (`tests/user-profile.test.mjs`):**
   - Kiểm tra `updateUserProfileFull` xử lý `occupation` và `current_residence`.
   - Kiểm tra `ProfileForm.tsx` có render input và icon cho `Nghề nghiệp` (`Briefcase`) và `Nơi ở hiện tại` (`MapPin`), cùng nút định vị GPS.
   - Kiểm tra `app/profile/page.tsx` truyền đúng `occupation` và `currentResidence` sang form.
2. **Kiểm tra cú pháp & Build:**
   - Chạy lệnh test tự động: `node --test tests/user-profile.test.mjs`.
   - Kiểm tra Typescript compile: `npx tsc --noEmit`.
