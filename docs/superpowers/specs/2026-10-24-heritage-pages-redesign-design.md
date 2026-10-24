# Thiết Kế Chi Tiết: Redesign 7 Trang Chức Năng Gia Phả Theo Phong Cách Heritage Hoàng Gia

## 1. Tổng quan & Mục tiêu

### 1.1 Mục tiêu
Đồng bộ hóa toàn diện giao diện của 7 trang chức năng chính thuộc không gian dòng họ (`/dashboard/[familySlug]/*`):
1. **Cây gia phả** (`/members`)
2. **Tra danh xưng** (`/kinship`)
3. **Thống kê** (`/stats`)
4. **Sự kiện & Giỗ chạp** (`/events`)
5. **Hồ sơ dòng họ** (`/about`)
6. **Thông tin dòng họ** (`/blog`)
7. **Người phụ trách** (`/admins`)

Hiện tại, trang chủ Dashboard mang phong cách Di Sản (Heritage) với nền giấy điệp, viền thếp vàng, góc hoa văn truyền thống, nhưng các trang chức năng con vẫn mang phong cách Tailwind xám (`stone-100`, `stone-500`, `border-stone-200`) gây đứt gãy thị giác. Dự án này sẽ mang lại trải nghiệm thị giác hoàng gia, cung đình và hoài niệm sâu sắc cho toàn bộ hệ thống.

### 1.2 Nguyên tắc thiết kế (Design Principles)
- **Bản sắc văn hóa:** Tông màu giấy điệp cổ (`#f5e7c7`), viền thếp vàng (`#caa455`, `#deb887`), đỏ son (`#8c1d1d`), xanh ngọc bích (`#183b28`).
- **Thư pháp & Kiểu chữ:** Tiêu đề dùng font `SVN-Studio Brush` kết hợp serif sang trọng; nội dung biểu mẫu, số liệu dùng font sans sạch sẽ, dễ đọc.
- **Bảo toàn chức năng 100%:** Giữ nguyên các cơ chế server-side query, server action, kiểm tra quyền hạn (`canEdit`, `canManage`), state client và bộ lọc.
- **Đáp ứng tốt trên di động (Mobile-friendly):** Đảm bảo hiển thị hoàn hảo trên điện thoại thông minh, không bị tràn màn hình hay che khuất thông tin.

---

## 2. Hệ Thống Token & Component Dùng Chung

### 2.1 Thành phần `HeritagePageHeader` (`components/dashboard/HeritagePageHeader.tsx`)
Header thống nhất cho tất cả các trang con, gồm:
- **Nút quay về:** `← Về tổng quan dòng họ` dẫn về `/dashboard/${familySlug}`.
- **Huy hiệu ngữ cảnh (Context Badges):**
  - Tên dòng họ (ví dụ: `Họ Huỳnh`, `Họ Nguyễn`) với huy hiệu mạ vàng/đỏ son.
  - Cây gia phả hiện tại (nếu trang gắn với cây) với icon `FolderTree`.
- **Tiêu đề lớn:** Font thư pháp `SVN-Studio Brush`, màu xanh ngọc bích cổ điển `#183b28`.
- **Mô tả dẫn nhập:** Font sans, màu nâu gỗ `#5c4a3e`.
- **Khu vực thao tác (Actions Slot):** Chứa các nút bấm bổ trợ như *Đổi cây*, *Thêm sự kiện*, *Thêm bài viết*, *Xuất file*.

### 2.2 Các thẻ di sản (`components/dashboard/HeritageUI.tsx`)
- Tái sử dụng và nâng cấp:
  - `HeritageFrame`: Khung đôi với 4 góc hoa văn đỏ son/hoàng kim.
  - `HeritageBadge`: Các biến thể `crimson`, `jade`, `amber`, `neutral`.
  - `HeritageStatCard`: Thẻ chỉ số số liệu với đường viền di sản và hiệu ứng ánh vàng.

---

## 3. Thiết Kế Chi Tiết Từng Trang Chức Năng

### 3.1 Cây gia phả (`/members`)
- **Tệp chỉnh sửa:** `app/dashboard/[familySlug]/members/page.tsx`, `components/ViewToggle.tsx`.
- **Thiết kế:**
  - Áp dụng `HeritagePageHeader` với nút đổi cây gia phả viền vàng nổi bật.
  - Chuyển đổi thanh chế độ xem `ViewToggle` (Danh sách, Phả đồ cây, Mindmap, Bubble map) thành thanh điều khiển thẻ bài di sản sang trọng, nút bấm active có nền đỏ son/vàng kim.
  - Khung bao quanh phả đồ và danh sách thành viên có hoa văn viền góc thanh thoát.

### 3.2 Tra cứu danh xưng (`/kinship`)
- **Tệp chỉnh sửa:** `app/dashboard/[familySlug]/kinship/page.tsx`, `components/KinshipFinder.tsx`.
- **Thiết kế:**
  - Áp dụng `HeritagePageHeader` ("Tra Cứu Danh Xưng & Quan Hệ").
  - Hộp chọn Người A và Người B: Đặt trong 2 khung lụa đối xứng, có biểu tượng Nam (xanh ngọc) / Nữ (đỏ son) trang nhã.
  - Thẻ hiển thị kết quả xưng hô: Đặt trong `HeritageFrame` với hoa văn triện son, phân định rõ:
    - Cách Người A gọi Người B và ngược lại.
    - Bậc thế hệ (cùng đời, trên 1 đời, dưới 2 đời...).
    - Lời giải thích thứ tự họ hàng theo phong tục truyền thống Việt Nam.

### 3.3 Thống kê gia phả (`/stats`)
- **Tệp chỉnh sửa:** `app/dashboard/[familySlug]/stats/page.tsx`, `components/FamilyStats.tsx`.
- **Thiết kế:**
  - Áp dụng `HeritagePageHeader` ("Bảng Vàng Thống Kê Dòng Họ").
  - Các khối chỉ số tổng quan (Tổng nhân đinh, Số đời/thế hệ, Số nam/nữ, Còn sống/Đã mất) được chuyển đổi hoàn toàn sang `HeritageStatCard` với ánh vàng hoàng gia.
  - Bảng thống kê các thế hệ (Đời 1 đến Đời N): Thiết kế thanh tiến trình dạng cuộn thư cổ, tông màu vàng mật ong và xanh ngọc.
  - Phân tích độ tuổi, con giáp và các chỉ số thống kê nâng cao với viền hoa văn sắc nét.

### 3.4 Sự kiện & Giỗ chạp (`/events`)
- **Tệp chỉnh sửa:** `app/dashboard/[familySlug]/events/page.tsx`, `components/EventsList.tsx`, `components/CustomEventModal.tsx`.
- **Thiết kế:**
  - Áp dụng `HeritagePageHeader` ("Lịch Sự Kiện & Tiệc Giỗ Gia Tộc").
  - Tách nhóm thẻ sự kiện rõ ràng:
    - **Ngày Kỵ Nhật (Ngày Giỗ):** Thẻ có viền đỏ son trầm `#8c1d1d`, nổi bật ngày Âm lịch cổ truyền kèm số ngày đếm ngược ("Hôm nay", "Sắp đến").
    - **Sinh nhật / Mừng thọ:** Thẻ viền hổ phách ấm áp `#caa455`.
    - **Việc họ / Sự kiện chung:** Thẻ viền ngọc bích `#183b28`.
  - Bộ lọc loại sự kiện thiết kế dạng thẻ lụa, dễ bấm trên mobile.
  - Modal tạo sự kiện `CustomEventModal`: Form nền giấy sáng, nút lưu đỏ son trang trọng.

### 3.5 Hồ sơ dòng họ (`/about`)
- **Tệp chỉnh sửa:** `app/dashboard/[familySlug]/about/page.tsx`.
- **Thiết kế:**
  - Thay thế toàn bộ khung nền xám `bg-stone-50/50` bằng nền parchment ấm áp.
  - Trình bày thông tin như một "Chứng thư dòng họ" hoặc "Bản khắc gia sử".
  - Hiển thị nguồn gốc, nhà thờ tổ, câu đối gia huấn, quy mô chi phái trong các khối `HeritageFrame`.
  - Khối biểu mẫu chỉnh sửa (dành cho người phụ trách) có các trường nhập liệu viền vàng đồng sang trọng, nút lưu mạ vàng/đỏ son.

### 3.6 Thông tin dòng họ (`/blog`)
- **Tệp chỉnh sửa:** `app/dashboard/[familySlug]/blog/page.tsx`, `components/BlogAdminPanel.tsx`.
- **Thiết kế:**
  - Áp dụng `HeritagePageHeader` ("Bảng Tin & Chiếu Thư Dòng Tộc").
  - Tin tức ghim / thông báo nội bộ được đặt trong khung chiếu chỉ viền gấm hoàng gia.
  - Trình soạn thảo và quản lý bài viết được thiết kế hài hòa, trực quan nhưng vẫn giữ phong vị hoài cổ.

### 3.7 Người phụ trách (`/admins`)
- **Tệp chỉnh sửa:** `app/dashboard/[familySlug]/admins/page.tsx`, `components/FamilyAdminRosterPanel.tsx`.
- **Thiết kế:**
  - Áp dụng `HeritagePageHeader` ("Hội Đồng Quản Trị & Tộc Biểu").
  - Danh sách người phụ trách: Phân nhóm rõ ràng:
    - **Tộc Trưởng / Trưởng Ban Quản Trị (Primary Admin):** Huy hiệu ấn triện son đỏ viền vàng.
    - **Ủy Viên Ban Quản Trị (Assistant Admins):** Huy hiệu ngọc bích trang nhã.
  - Bảng hoặc thẻ liên lạc hiển thị email, số điện thoại, trạng thái hoạt động với phong cách trang nghiêm, tin cậy.

---

## 4. Kế Hoạch Kiểm Thử & Xác Nhận (Verification)
1. **Kiểm tra biên dịch & Lint:** Đảm bảo `npm run build` hoặc typecheck không phát sinh lỗi TypeScript hay cú pháp CSS.
2. **Kiểm tra trực quan (Visual & Responsiveness):** Kiểm tra hiển thị của cả 7 trang trên trình duyệt (màn hình máy tính và thiết bị di động).
3. **Kiểm tra chức năng:**
   - Điều hướng qua lại giữa Dashboard và 7 trang không bị lỗi 404 hay hỏng tham số URL (`treeId`, `view`).
   - Tra danh xưng tính toán đúng quan hệ.
   - Lọc và xem sự kiện kỵ nhật âm lịch chính xác.
   - Thao tác cập nhật hồ sơ dòng họ và bài viết hoạt động bình thường.
