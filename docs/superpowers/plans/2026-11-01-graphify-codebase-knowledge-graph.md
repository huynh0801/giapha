# Graphify Codebase Knowledge Graph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cài đặt Graphify CLI, tích hợp quy trình tạo Knowledge Graph vào dự án `giaphadongho`, sinh bộ artifacts (`graph.html`, `GRAPH_REPORT.md`, `graph.json`) và hướng dẫn AI assistants khai thác tri thức codebase.

**Architecture:** Sử dụng `uv tool` để cô lập CLI `graphifyy`, cấu hình `.gitignore` và npm scripts trong `package.json`, chạy phân tích AST trên toàn bộ codebase Next.js, và theo dõi báo cáo kiến trúc Markdown cho AI.

**Tech Stack:** Graphify (`graphifyy`), Python 3.12, uv, Next.js 16, Git, Node.js test runner.

## Global Constraints
- Windows PowerShell environment with Python 3.12.10 and uv 0.11.19.
- Không sửa đổi mã nguồn logic ứng dụng (`app/`, `components/`, `lib/`, `tests/`).
- 100% tests hiện tại của dự án (`npm test`) phải tiếp tục pass.
- Bỏ qua các file tĩnh bundle nặng trong `graphify-out/`, chỉ commit `graphify-out/GRAPH_REPORT.md`.

---

### Task 1: Cài đặt và kiểm tra Graphify CLI qua `uv tool`

**Files:**
- Không tạo file mới trong repo (quản lý công cụ qua môi trường uv tool)

**Interfaces:**
- Consumes: `uv` CLI (đã có sẵn `uv 0.11.19`)
- Produces: CLI binary `graphify` có thể gọi được từ terminal

- [x] **Step 1: Cài đặt gói `graphifyy` qua uv tool**

```powershell
uv tool install graphifyy
```

- [x] **Step 2: Kiểm tra phiên bản và sự sẵn sàng của lệnh `graphify`**

```powershell
graphify --version
```
Expected: Trả về phiên bản của graphify (hoặc trợ giúp CLI thành công).

---

### Task 2: Cấu hình `.gitignore` và thêm script vào `package.json`

**Files:**
- Modify: `.gitignore`
- Modify: `package.json`

**Interfaces:**
- Consumes: Task 1 binary `graphify`
- Produces: `npm run graphify` và cấu hình bỏ qua `graphify-out/*` ngoại trừ `GRAPH_REPORT.md`

- [x] **Step 1: Cập nhật `.gitignore` để bỏ qua các artifact nặng nhưng giữ `GRAPH_REPORT.md`**

Thêm vào cuối tệp `.gitignore`:
```gitignore

# Graphify knowledge graph artifacts
graphify-out/*
!graphify-out/GRAPH_REPORT.md
```

- [x] **Step 2: Thêm scripts vào `package.json`**

Thêm vào mục `"scripts"` của `package.json`:
```json
    "graphify": "graphify extract . --code-only && graphify cluster-only --no-label .",
    "graphify:update": "graphify update . && graphify cluster-only --no-label .",
    "graphify:report": "graphify extract . --code-only && graphify cluster-only --no-label . && node -e \"console.log('Graph report updated at graphify-out/GRAPH_REPORT.md')\""
```

- [x] **Step 3: Kiểm tra cấu hình và commit**

```powershell
git add .gitignore package.json
git commit -m "chore: add graphify npm scripts and gitignore rules"
```

---

### Task 3: Chạy phân tích codebase sinh Knowledge Graph Artifacts

**Files:**
- Create/Generate: `graphify-out/graph.html`
- Create/Generate: `graphify-out/GRAPH_REPORT.md`
- Create/Generate: `graphify-out/graph.json`

**Interfaces:**
- Consumes: `npm run graphify`
- Produces: Bộ 3 file artifacts trong `graphify-out/`

- [x] **Step 1: Chạy lệnh quét và xây dựng đồ thị**

```powershell
npm run graphify
```

- [x] **Step 2: Kiểm tra sự tồn tại và tính hợp lệ của các file kết quả**

```powershell
Test-Path "graphify-out/graph.html", "graphify-out/GRAPH_REPORT.md", "graphify-out/graph.json"
```
Expected: Cả 3 file đều trả về `True`.

- [x] **Step 3: Kiểm tra nội dung `GRAPH_REPORT.md`**

Đọc các dòng đầu tiên của `graphify-out/GRAPH_REPORT.md` để đảm bảo báo cáo đã trích xuất các thành phần cốt lõi của dự án `giaphadongho`.

- [x] **Step 4: Kiểm tra trạng thái git và commit `GRAPH_REPORT.md`**

```powershell
git status
git add graphify-out/GRAPH_REPORT.md
git commit -m "docs(graphify): generate initial codebase knowledge graph report"
```
Expected: Git chỉ theo dõi `graphify-out/GRAPH_REPORT.md`, các file `graph.html` và `graph.json` bị ignore đúng như cấu hình.

---

### Task 4: Bổ sung tài liệu AI Guide và Chạy toàn bộ Test Suite

**Files:**
- Create: `docs/superpowers/specs/2026-11-01-graphify-ai-context.md`
- Test: Chạy bộ test suite của toàn bộ dự án

**Interfaces:**
- Consumes: `graphify-out/GRAPH_REPORT.md`
- Produces: Hướng dẫn dành cho AI assistant và xác nhận kiểm thử hồi quy đạt 100%

- [x] **Step 1: Tạo tệp tài liệu hướng dẫn AI context `docs/superpowers/specs/2026-11-01-graphify-ai-context.md`**

Nội dung mô tả cách AI trợ lý lập trình (Antigravity, Cursor, Claude Code) đọc `graphify-out/GRAPH_REPORT.md` để nắm bắt sơ đồ quan hệ các module chính (`app/`, `components/`, `lib/`, `tests/`, `supabase/`).

- [x] **Step 2: Chạy kiểm thử hồi quy toàn bộ dự án (`npm test`)**

```powershell
npm test
```
Expected: Tất cả 127 tests vượt qua mà không có lỗi hồi quy nào.

- [x] **Step 3: Commit tài liệu và hoàn tất kế hoạch**

```powershell
git add docs/superpowers/specs/2026-11-01-graphify-ai-context.md
git commit -m "docs: add AI context guide for graphify knowledge graph"
```
