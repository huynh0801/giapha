# Hướng Dẫn Sử Dụng Codebase Knowledge Graph (Graphify AI Context Guide)

- **Ngày tạo:** 2026-11-01
- **Phạm vi:** Tài liệu hướng dẫn dành cho các AI Coding Assistants (Antigravity, Claude Code, Cursor, Codex, Gemini, v.v.) và Developer khi tìm hiểu, định hướng và tác nghiệp trên codebase `giaphadongho`.

---

## 1. Tổng Quan Kiến Trúc Tri Thức (Overview)

Dự án `giaphadongho` được lập chỉ mục toàn diện bằng công cụ **Graphify** (`graphifyy`), trích xuất Abstract Syntax Tree (AST) từ toàn bộ mã nguồn TypeScript, React/Next.js, Supabase Server Actions, database queries và types để tạo thành Codebase Knowledge Graph.

Toàn bộ tri thức được lưu trữ trong thư mục `graphify-out/`:
- **`graphify-out/GRAPH_REPORT.md`**: Báo cáo tổng hợp kiến trúc hệ thống, được Git theo dõi trực tiếp. Chứa danh sách các God Nodes, các module trọng yếu, 69 cụm cộng đồng (communities), chu kỳ phụ thuộc (import cycles) và các liên kết tiềm ẩn.
- **`graphify-out/graph.html`**: Giao diện tương tác 2D/3D (Force-directed Graph) mở trực tiếp trên trình duyệt, trực quan hóa toàn bộ mạng lưới thực thể và quan hệ trong hệ thống.
- **`graphify-out/graph.json`**: Cấu trúc dữ liệu đồ thị GraphRAG phục vụ cho các lệnh truy vấn BFS/DFS, tìm đường đi ngắn nhất (shortest path), và giải thích ngữ cảnh nút (explain).

---

## 2. Bối Cảnh Kiến Trúc Codebase (Architectural Context)

Kết quả phân tích từ Knowledge Graph hiện tại:
- **1,323 nodes** (tệp tin, hàm, kiểu dữ liệu, React components, server actions, endpoints, npm packages).
- **3,780 edges** (quan hệ imports, calls, references, contains, implements).
- **69 communities** (các phân vùng kiến trúc logic độc lập hoặc liên kết yếu).
- **Extraction quality:** 100% trích xuất cú pháp tĩnh từ mã nguồn (EXTRACTED), không suy diễn giả tạo.

### Các "God Nodes" Cốt Lõi (Core Abstractions)
Khi điều hướng hoặc sửa đổi codebase, các AI Assistant cần đặc biệt lưu ý các nút có độ liên kết cao (high degree centrality & betweenness):

1. **`getSupabase` (`utils/supabase/queries.ts`) - 126 liên kết**:
   - Trung tâm truy vấn cơ sở dữ liệu Supabase cho toàn bộ ứng dụng (Server Actions, Data Fetching, Auth, RLS).
   - Tác động rộng: Mọi thay đổi trong `queries.ts` hoặc cấu hình client Supabase đều có khả năng ảnh hưởng đến hơn 20 cụm cộng đồng khác nhau.
2. **`getUser` (`utils/supabase/queries.ts`) - 61 liên kết**:
   - Trọng tâm xác thực phiên làm việc người dùng hiện tại từ cookie/session.
3. **`getProfile` (`utils/supabase/queries.ts`) - 58 liên kết**:
   - Đọc hồ sơ người dùng (`profiles`), vai trò (`role`: admin / member), và trạng thái kích hoạt.
4. **`Person` (`types/index.ts`) - 48 liên kết**:
   - Kiểu thực thể cốt lõi biểu diễn thành viên gia phả trong cây phả hệ (quan hệ cha mẹ, vợ chồng, con cái, thế hệ, chi nhánh).
5. **`getFamilyContextBySlug` (`utils/supabase/queries.ts`) - 41 liên kết**:
   - Đảm bảo cơ chế Multi-tenant cho từng dòng họ dựa trên `familySlug`. Kiểm tra quyền truy cập và trả về ngữ cảnh dòng họ.
6. **`getFamilyContextById` (`utils/supabase/queries.ts`) - 39 liên kết**:
   - Tương tự ngữ cảnh slug nhưng truy xuất trực tiếp theo UUID dòng họ trong các Server Actions.
7. **`useDashboard()` (`components/DashboardContext.tsx`) - 36 liên kết**:
   - React Context trung tâm điều phối trạng thái hiển thị của trang Dashboard dòng họ (chọn thành viên, chế độ xem Cây / Mạng bong bóng / Phả đồ, bộ lọc thế hệ).

---

## 3. Hướng Dẫn AI Assistant Truy Vấn Codebase (Graphify CLI)

Các AI coding assistants có thể thực thi trực tiếp các lệnh CLI sau trong terminal để nhanh chóng định vị mã nguồn và hiểu luồng kiến trúc mà không cần duyệt toàn bộ file tree:

### 3.1 Truy vấn khái niệm và tìm kiếm lân cận (`graphify query`)
Sử dụng thuật toán BFS để tìm các nút và tệp liên quan đến một chủ đề cụ thể:
```powershell
# Tìm kiếm các thành phần liên quan đến authentication / xác thực
graphify query "auth"

# Tìm kiếm các thành phần liên quan đến dòng họ (family)
graphify query "family"

# Tìm kiếm với điểm xuất phát cụ thể (seed node)
graphify query "import" --seed "excel-import.ts"
```

### 3.2 Giải thích chi tiết một Node và các láng giềng (`graphify explain`)
Phân tích chi tiết một hàm, component, hoặc module cùng tất cả các lời gọi đến nó:
```powershell
# Phân tích hàm getSupabase và danh sách các caller
graphify explain "getSupabase"

# Phân tích chi tiết component cây gia phả
graphify explain "FamilyTree"

# Xem toàn bộ liên kết (không giới hạn 20 liên kết đầu)
graphify explain "getFamilyContextBySlug" --all
```

### 3.3 Tìm đường đi ngắn nhất giữa hai thành phần (`graphify path`)
Xác định chuỗi phụ thuộc / lời gọi trực tiếp hoặc gián tiếp giữa 2 module:
```powershell
# Tìm đường dẫn phụ thuộc trực tiếp (directed)
graphify path "loginAction()" "createClient()"

# Tìm chuỗi liên kết giữa một Server Action và Database Client (sử dụng --undirected khi cần tìm quan hệ chia sẻ)
graphify path "loginAction()" "getSupabase" --undirected

# Tìm quan hệ giữa giao diện người dùng và hàm cập nhật cây
graphify path "RelationshipCanvasEditor" "applyLineageSyncAction" --undirected
```

---

## 4. Quy Trình Cập Nhật Knowledge Graph (Maintenance Workflow)

Khi có các tính năng mới được thêm vào hoặc refactor cấu trúc thư mục, hãy giữ cho Knowledge Graph luôn tươi mới:

### 4.1 Lệnh cập nhật nhanh khi code thay đổi (Incremental Update)
Lệnh này quét lại các tệp mã nguồn vừa thay đổi và tái lập cụm (không tốn token LLM):
```powershell
npm run graphify:update
```

### 4.2 Lệnh trích xuất và tái tạo toàn bộ đồ thị (Full Re-extract)
Lệnh này quét toàn bộ codebase từ đầu và cập nhật `graphify-out/`:
```powershell
npm run graphify
```

### 4.3 Kiểm tra độ tươi mới của đồ thị (Freshness Check)
Trong `graphify-out/GRAPH_REPORT.md` có ghi lại Git commit SHA tại thời điểm đồ thị được sinh ra:
```powershell
# So sánh commit hiện tại với commit trong GRAPH_REPORT.md
git rev-parse --short HEAD
```
Nếu commit hiện tại cách xa commit trong báo cáo, hãy chạy `npm run graphify:update` hoặc `npm run graphify`.

---

## 5. Best Practices Dành Cho AI Assistants Khi Làm Việc Trên Codebase Này

1. **Trước khi sửa đổi logic cốt lõi**:
   - Đọc `graphify-out/GRAPH_REPORT.md` để nắm các God nodes liên quan.
   - Chạy `graphify explain "<ten_ham>"` để kiểm tra xem hàm đó có đang được dùng ở nhiều Server Actions hay Pages khác không, tránh phá vỡ giao diện hợp đồng (breaking changes).
2. **Trước khi tạo Server Action mới**:
   - Sử dụng `graphify query` để kiểm tra các Server Actions hiện có thuộc cùng Community (ví dụ: `Community 0` cho Blog, `Community 1` cho Lineage/Tree, `Community 3` cho Auth, `Community 11` cho Claim, `Community 12` cho Family Creation).
   - Tái sử dụng `getSupabase`, `getUser`, `getFamilyContextBySlug` theo chuẩn convention của dự án.
3. **Khi gặp lỗi phụ thuộc vòng (Import Cycle)**:
   - Tham khảo mục `## Import Cycles` trong `graphify-out/GRAPH_REPORT.md` để giải quyết triệt để vấn đề coupling giữa các components.
4. **Luôn chạy kiểm thử hồi quy**:
   - Sau khi hoàn thành code, luôn chạy `npm test` để đảm bảo 100% test suite pass trước khi tạo commit.
