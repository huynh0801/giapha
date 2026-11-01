# Thiết Kế Kỹ Thuật: Tích Hợp Graphify Tạo Codebase Knowledge Graph Cho Dự Án Gia Phả Dòng Họ

- **Ngày tạo:** 2026-11-01
- **Trạng thái:** Đã duyệt (Approved)
- **Phạm vi:** Cài đặt công cụ phân tích Graphify (`graphifyy`), tích hợp script vào `package.json`, cấu hình `.gitignore`, sinh bộ tri thức đồ thị (`graphify-out/`), và cập nhật tài liệu kiến trúc cho AI assistants.

---

## 1. Mục Tiêu & Yêu Cầu

### 1.1 Mục tiêu
Tích hợp công cụ [Graphify](https://github.com/Graphify-Labs/graphify) vào dự án `giaphadongho` để trích xuất AST và xây dựng Knowledge Graph hoàn chỉnh của codebase. Đồ thị này giúp các AI coding assistants (Antigravity, Cursor, Claude Code, v.v.) nắm bắt chính xác quan hệ phụ thuộc giữa các module, các God nodes, luồng kiến trúc, đồng thời cung cấp giao diện trực quan 2D/3D trực quan trên trình duyệt cho lập trình viên.

### 1.2 Yêu cầu chức năng
1. **Cài đặt công cụ CLI:** Sử dụng công cụ quản lý Python hiện đại `uv tool` để cài đặt gói phân tích chính thức `graphifyy` (tạo binary command `graphify`), bảo đảm môi trường sandbox độc lập.
2. **Kịch bản tự động hóa (`package.json`):** Thêm script `npm run graphify` và `npm run graphify:report` vào `package.json` để cho phép quét và tái tạo đồ thị tri thức nhanh chóng sau các thay đổi mã nguồn.
3. **Quản lý Git (`.gitignore`):** Cấu hình bỏ qua các file đồ thị HTML và dữ liệu nặng trong `graphify-out/*`, nhưng giữ lại file báo cáo Markdown kiến trúc `graphify-out/GRAPH_REPORT.md` trong Git repository để AI assistants có thể đọc trực tiếp trên bất kỳ branch nào.
4. **Tạo bộ Knowledge Graph Artifacts:**
   - `graphify-out/graph.html`: Giao diện tương tác 2D/3D force-directed graph mở trực tiếp trên trình duyệt.
   - `graphify-out/GRAPH_REPORT.md`: Báo cáo tóm tắt cấu trúc module, danh sách God nodes, ranh giới domain.
   - `graphify-out/graph.json`: Cấu trúc dữ liệu đồ thị GraphRAG phục vụ truy vấn.
5. **Hướng dẫn cho AI Assistant:** Bổ sung hướng dẫn tham chiếu `graphify-out/GRAPH_REPORT.md` vào tài liệu dự án để AI tự động tra cứu khi phân tích codebase.

### 1.3 Ràng buộc kỹ thuật & Quy chuẩn
- Máy dev chạy Windows PowerShell, đã có sẵn Python 3.12.10 và uv 0.11.19.
- Không chỉnh sửa hay làm xáo trộn mã nguồn ứng dụng chính (`app/`, `components/`, `lib/`, `tests/`).
- Toàn bộ 100% các bài kiểm thử hiện có của dự án (`npm test`) phải tiếp tục chạy thành công.

---

## 2. Kiến Trúc & Luồng Xử Lý

### 2.1 Sơ đồ luồng (Workflow Flow)

```
[Lập trình viên / AI Assistant]
          │
          │ Thực thi `npm run graphify` (hoặc `graphify run .`)
          ▼
[Graphify CLI (Python 3.12 AST Engine via uv)]
          │
          │ Quét các tệp: .ts, .tsx, .mjs, .sql, .json, .md
          │ Phân tích Abstract Syntax Tree (AST via tree-sitter)
          │ Trích xuất quan hệ imports, exports, database schemas, API routes
          ▼
[Thư mục graphify-out/]
          ├── graph.html          (Trực quan hóa đồ thị tương tác cho Dev)
          ├── GRAPH_REPORT.md     (Bản đồ kiến trúc cho AI đọc & Git track)
          └── graph.json          (Đồ thị GraphRAG queryable)
          │
          ▼
[AI Coding Assistant / Git]
          - AI đọc `GRAPH_REPORT.md` để hiểu sâu codebase khi code tính năng mới
          - Git commit `GRAPH_REPORT.md`, bỏ qua các file bundle tĩnh
```

---

## 3. Chi Tiết Triển Khai

### 3.1 Cài đặt `graphifyy` qua `uv tool`
Thực thi lệnh PowerShell:
```powershell
uv tool install graphifyy
```
Xác nhận lệnh `graphify --help` hoặc `graphify --version` hoạt động trơn tru.

### 3.2 Cập nhật `package.json`
Thêm vào block `"scripts"` trong `package.json`:
```json
"graphify": "graphify run .",
"graphify:report": "graphify run . && node -e \"console.log('Graph report updated at graphify-out/GRAPH_REPORT.md')\""
```

### 3.3 Cấu hình `.gitignore`
Thêm cấu hình sau vào `.gitignore` của dự án:
```gitignore
# Graphify knowledge graph artifacts
graphify-out/*
!graphify-out/GRAPH_REPORT.md
```

### 3.4 Thực thi phân tích mã nguồn
Chạy lệnh từ thư mục gốc của dự án `e:\Work\giaphadongho`:
```powershell
npm run graphify
```
Kiểm tra kết quả sinh ra trong thư mục `graphify-out/`.

### 3.5 Bổ sung hướng dẫn cho AI Coding Assistant
Tạo hoặc cập nhật mục hướng dẫn trong `docs/huong-dan-su-dung.md` hoặc tài liệu tham chiếu AI để hướng dẫn AI đọc `graphify-out/GRAPH_REPORT.md` trước khi thực hiện các thay đổi kiến trúc lớn.

---

## 4. Xử Lý Ngoại Lệ & Dự Phòng (Error Handling)

| Tình huống ngoại lệ | Nguyên nhân tiềm ẩn | Giải pháp xử lý |
|---------------------|---------------------|-----------------|
| `graphify: command not found` sau khi cài | Đường dẫn `uv tool` bin chưa có trong biến môi trường PATH hiện tại | Chạy `uv tool update-shell` hoặc gọi trực tiếp qua `uv run --with graphifyy graphify run .` |
| Quét qua thư mục rác / build (`node_modules`, `.next`, `backups`) | Graphify quét đệ quy các thư mục phụ không cần thiết | Cấu hình cờ exclude hoặc kiểm tra file cấu hình của Graphify (`.graphifyignore` nếu hỗ trợ) |
| Lỗi encoding / Unicode ký tự tiếng Việt trong SQL hoặc Markdown | File mã nguồn chứa tiếng Việt UTF-8 | Đảm bảo terminal và Python đọc/ghi với encoding UTF-8 chuẩn |

---

## 5. Kế Hoạch Kiểm Thử & Nghiệm Thu (Verification)

1. **Kiểm tra công cụ:** Chạy `graphify --help` xác nhận CLI hoạt động.
2. **Kiểm tra tạo đồ thị:** Chạy `npm run graphify` và xác nhận sinh đủ 3 file:
   - `graphify-out/graph.html` (kích thước > 0, hợp lệ)
   - `graphify-out/GRAPH_REPORT.md` (chứa các phần phân tích cấu trúc dự án)
   - `graphify-out/graph.json` (chứa nodes và links)
3. **Kiểm tra Git Status:** Chạy `git status` để bảo đảm `.gitignore` hoạt động đúng: chỉ hiển thị `GRAPH_REPORT.md` được theo dõi, các file bundle html/json được bỏ qua.
4. **Kiểm tra hồi quy ứng dụng:** Chạy `npm test` để xác nhận tất cả các bài test kiểm thử của `giaphadongho` tiếp tục pass 100%.
