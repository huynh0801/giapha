-- Migration: Sửa lỗi đệ quy vô hạn trong RLS policy của bảng family_creation_requests
-- Loại bỏ subquery tự tham chiếu bảng family_creation_requests trong WITH CHECK

-- 1. Thêm partial unique index: Mỗi người dùng chỉ có tối đa 1 yêu cầu pending ở mức database
CREATE UNIQUE INDEX IF NOT EXISTS idx_family_creation_requests_user_pending 
ON public.family_creation_requests(user_id) 
WHERE status = 'pending';

-- 2. Cập nhật lại INSERT policy: chỉ kiểm tra auth.uid() = user_id mà không tự truy vấn lại chính bảng đó
DROP POLICY IF EXISTS "Users can create their own creation requests" ON public.family_creation_requests;

CREATE POLICY "Users can create their own creation requests"
ON public.family_creation_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);
