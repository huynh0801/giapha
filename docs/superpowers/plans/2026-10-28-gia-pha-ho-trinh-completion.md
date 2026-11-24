# Hoàn thiện Gia Phả Dòng Họ Trình (Trịnh) - Chi II - Cụ Trình Thạch

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện 100% dữ liệu cây gia phả và tiểu sử chi tiết Dòng Họ Trình (Trịnh) - Chi II - Cụ Trình Thạch từ tập tài liệu 134 ảnh trong thư mục `giaphahotrinh`, đồng bộ chính xác vào cơ sở dữ liệu Supabase.

**Architecture:** 
1. Sử dụng 5 bản Phả đồ đồ họa gốc (Ảnh 0, 1, 2, 3, 4) kết hợp hệ thống Mã số phả hệ thập phân phân cấp (vd: `7.121`, `7.1211`, `7.121221`) để xác lập cấu trúc cây huyết thống không sai lệch.
2. Bóc tách toàn diện thông tin lý lịch (ngày sinh dương/âm can chi, ngày mất/mộ táng, cha/mẹ, hôn phối, học vấn, nghề nghiệp, công danh sự nghiệp, nơi cư trú) từ 129 trang sách chi tiết trong `giaphahotrinh`.
3. Đồng bộ vào bảng `persons`, `person_details_private` và `relationships` trên Supabase bằng các migration/import scripts có cơ chế rollback an toàn.

**Tech Stack:** Node.js, Supabase PostgREST / PostgreSQL, Next.js, tsx/node test runner.

## Global Constraints
- Bảo tồn toàn vẹn `id` của 84 thành viên và các mối quan hệ đã có, chỉ bổ sung/làm giàu trường thông tin còn thiếu.
- Bắt buộc tuân thủ ràng buộc toàn vẹn cơ sở dữ liệu: `birth_month` (1-12), `birth_day` (1-31), `gender` ('male'/'female'), `relationship_type` ('marriage'/'biological_child').
- Mã định danh phả hệ được lưu chuẩn mực vào `external_ref` để thuận tiện tra cứu và đối chiếu sách gốc.

---

### Task 1: Bóc tách & Làm giàu dữ liệu Phái Nhì - Cành 1 (Trình Luyến, Đời 10 -> 13)
**Files:**
- Create: `scripts/data/canh1-data.json`
- Create: `scripts/enrich-canh1.mjs`
- Test: `tests/genealogy-canh1.test.mjs`

- [ ] **Step 1: Viết test kiểm tra tính hợp lệ dữ liệu Cành 1**
- [ ] **Step 2: Chạy test và xác nhận thất bại (đỏ)**
- [ ] **Step 3: Biên soạn `canh1-data.json` từ các ảnh (Trang 41 - 85) và triển khai script cập nhật**
- [ ] **Step 4: Chạy test và xác nhận vượt qua (xanh)**
- [ ] **Step 5: Commit kết quả Cành 1**

---

### Task 2: Bóc tách & Bổ sung dữ liệu Phái Nhì - Cành 2 (Trình Quyển, Đời 10 -> 13)
**Files:**
- Create: `scripts/data/canh2-data.json`
- Create: `scripts/enrich-canh2.mjs`
- Test: `tests/genealogy-canh2.test.mjs`

- [ ] **Step 1: Viết test kiểm tra thành viên và liên kết Cành 2**
- [ ] **Step 2: Chạy test và xác nhận thất bại (đỏ)**
- [ ] **Step 3: Biên soạn `canh2-data.json` từ các ảnh (Trang 86 - 126) bao gồm nhánh Trình Buồi & Trịnh Ninh**
- [ ] **Step 4: Chạy test và xác nhận vượt qua (xanh)**
- [ ] **Step 5: Commit kết quả Cành 2**

---

### Task 3: Bóc tách & Bổ sung dữ liệu Phái Nhì - Cành 3 (Trình Kháu, Đời 10 -> 13)
**Files:**
- Create: `scripts/data/canh3-data.json`
- Create: `scripts/enrich-canh3.mjs`
- Test: `tests/genealogy-canh3.test.mjs`

- [ ] **Step 1: Viết test kiểm tra thành viên và liên kết Cành 3**
- [ ] **Step 2: Chạy test và xác nhận thất bại (đỏ)**
- [ ] **Step 3: Biên soạn `canh3-data.json` từ các ảnh (Trang 127 - 162) bao gồm 4 nhánh con của Cụ Trình Kháu**
- [ ] **Step 4: Chạy test và xác nhận vượt qua (xanh)**
- [ ] **Step 5: Commit kết quả Cành 3**

---

### Task 4: Bóc tách & Bổ sung dữ liệu Phái Nhì - Cành 4 (Trình Báu, Đời 10 -> 14)
**Files:**
- Create: `scripts/data/canh4-data.json`
- Create: `scripts/enrich-canh4.mjs`
- Test: `tests/genealogy-canh4.test.mjs`

- [ ] **Step 1: Viết test kiểm tra thành viên và liên kết Cành 4**
- [ ] **Step 2: Chạy test và xác nhận thất bại (đỏ)**
- [ ] **Step 3: Biên soạn `canh4-data.json` từ các ảnh (Trang 163 - 171+)**
- [ ] **Step 4: Chạy test và xác nhận vượt qua (xanh)**
- [ ] **Step 5: Commit kết quả Cành 4**

---

### Task 5: Đồng bộ cơ sở dữ liệu Supabase & Kiểm thử toàn diện
**Files:**
- Create: `scripts/sync-ho-trinh-genealogy.mjs`
- Modify: `backups/`
- Test: `npm test`

- [ ] **Step 1: Viết script đồng bộ toàn diện vào Supabase sử dụng Service Role**
- [ ] **Step 2: Chạy script đồng bộ dữ liệu**
- [ ] **Step 3: Tạo bản sao lưu mới kiểm chứng số lượng thành viên và mối quan hệ**
- [ ] **Step 4: Chạy toàn bộ 113+ tests đảm bảo hệ thống vận hành mượt mà**
- [ ] **Step 5: Commit hoàn tất**
