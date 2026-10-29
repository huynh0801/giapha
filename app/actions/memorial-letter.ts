"use server";

import { revalidatePath } from "next/cache";
import { PersonMemorialLetter } from "@/types";
import {
  getAdminSupabase,
  getFamilyContextById,
  getProfile,
  getSupabase,
  getUser,
} from "@/utils/supabase/queries";

export interface MemorialLetterResult {
  success: boolean;
  data?: PersonMemorialLetter | null;
  error?: string;
}

export interface SaveMemorialLetterInput {
  personId: string;
  familyId: string;
  treeId: string;
  title: string;
  content: string;
  authorType: "self" | "descendant" | "admin";
  authorName: string;
  authorRelationship?: string;
}

/**
 * Lấy thông tin tâm thư của một thành viên
 */
export async function getMemorialLetterAction(
  personId: string,
  familyId: string,
): Promise<MemorialLetterResult> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("person_memorial_letters")
      .select("*")
      .eq("person_id", personId)
      .maybeSingle();

    if (error) {
      // Nếu bảng chưa có trong database, không crash trang mà trả về null an toàn
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return { success: true, data: null };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data: (data as PersonMemorialLetter) || null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi khi tải tâm thư.";
    return { success: false, error: message };
  }
}

/**
 * Lưu hoặc cập nhật tâm thư
 */
export async function saveMemorialLetterAction(
  input: SaveMemorialLetterInput,
): Promise<MemorialLetterResult> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Vui lòng đăng nhập để thực hiện chức năng này." };
    }

    const trimmedTitle = input.title?.trim() || "Tâm thư gửi đời sau";
    const trimmedContent = input.content?.trim();
    if (!trimmedContent) {
      return { success: false, error: "Nội dung tâm thư không được để trống." };
    }

    const context = await getFamilyContextById(input.familyId);
    if (!context) {
      return { success: false, error: "Không tìm thấy thông tin dòng họ." };
    }

    const profile = await getProfile(user.id);
    const isSystemAdmin = profile?.role === "system_admin" && profile.is_active;
    const isFamilyAdmin = context.canManage || context.canEdit;
    const isMember = context.membership?.status === "active";

    if (!isSystemAdmin && !isFamilyAdmin && !isMember) {
      return {
        success: false,
        error: "Bạn không có quyền cập nhật tâm thư trong dòng họ này.",
      };
    }

    // Kiểm tra xem tài khoản này có phải là chính chủ của người đó không
    const settings = (context.family.settings as Record<string, unknown>) || {};
    const memberLinks = (settings.member_links as Record<string, string>) || {};
    const isSelfClaimed = memberLinks[user.id] === input.personId;

    let finalAuthorType = input.authorType;
    if (isSelfClaimed) {
      finalAuthorType = "self";
    }

    const trimmedAuthorName =
      input.authorName?.trim() ||
      profile?.full_name ||
      user.email?.split("@")[0] ||
      "Thành viên dòng họ";

    const trimmedRelationship =
      input.authorRelationship?.trim() ||
      (isSelfClaimed ? "Bản thân" : isFamilyAdmin ? "Ban quản trị dòng họ" : "Con / Cháu");

    const payload = {
      person_id: input.personId,
      family_id: input.familyId,
      tree_id: input.treeId,
      title: trimmedTitle,
      content: trimmedContent,
      author_type: finalAuthorType,
      author_name: trimmedAuthorName,
      author_relationship: trimmedRelationship,
      created_by: user.id,
      updated_at: new Date().toISOString(),
    };

    const client = getAdminSupabase() || (await getSupabase());
    const { data, error } = await client
      .from("person_memorial_letters")
      .upsert(payload, { onConflict: "person_id" })
      .select()
      .single();

    if (error) {
      return { success: false, error: "Không thể lưu tâm thư: " + error.message };
    }

    revalidatePath(`/dashboard/${context.family.slug}/members/${input.personId}`);
    revalidatePath(`/dashboard/${context.family.slug}/members`);
    revalidatePath(`/dashboard/${context.family.slug}/tree`);

    return { success: true, data: data as PersonMemorialLetter };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
    return { success: false, error: message };
  }
}

/**
 * Xóa tâm thư
 */
export async function deleteMemorialLetterAction(
  personId: string,
  familyId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Vui lòng đăng nhập." };
    }

    const context = await getFamilyContextById(familyId);
    if (!context) {
      return { success: false, error: "Không tìm thấy thông tin dòng họ." };
    }

    const profile = await getProfile(user.id);
    const isSystemAdmin = profile?.role === "system_admin" && profile.is_active;
    const isFamilyAdmin = context.canManage || context.canEdit;

    const supabase = await getSupabase();
    // Lấy bài viết để kiểm tra người tạo nếu không phải admin
    const { data: existing } = await supabase
      .from("person_memorial_letters")
      .select("created_by")
      .eq("person_id", personId)
      .maybeSingle();

    if (!existing) {
      return { success: true };
    }

    const isCreator = existing.created_by === user.id;
    if (!isSystemAdmin && !isFamilyAdmin && !isCreator) {
      return { success: false, error: "Bạn không có quyền xóa bức tâm thư này." };
    }

    const client = getAdminSupabase() || supabase;
    const { error } = await client
      .from("person_memorial_letters")
      .delete()
      .eq("person_id", personId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/${context.family.slug}/members/${personId}`);
    revalidatePath(`/dashboard/${context.family.slug}/members`);
    revalidatePath(`/dashboard/${context.family.slug}/tree`);

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi khi xóa tâm thư.";
    return { success: false, error: message };
  }
}
