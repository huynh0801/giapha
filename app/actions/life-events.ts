"use server";

import { revalidatePath } from "next/cache";
import { PersonLifeEvent } from "@/types";
import {
  getAdminSupabase,
  getFamilyContextById,
  getProfile,
  getSupabase,
  getUser,
} from "@/utils/supabase/queries";

export interface LifeEventsResult {
  success: boolean;
  data?: PersonLifeEvent[];
  error?: string;
}

export interface SingleLifeEventResult {
  success: boolean;
  data?: PersonLifeEvent;
  error?: string;
}

export interface SaveLifeEventInput {
  id?: string;
  personId: string;
  familyId: string;
  treeId: string;
  year: number;
  month?: number | null;
  day?: number | null;
  title: string;
  content: string;
  imageUrl?: string | null;
  authorType: "self" | "descendant" | "admin";
  authorName: string;
  authorRelationship?: string;
}

/**
 * Lấy danh sách các mốc niên biểu / nhật ký theo năm của thành viên
 */
export async function getPersonLifeEventsAction(
  personId: string,
  familyId: string,
): Promise<LifeEventsResult> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("person_life_events")
      .select("*")
      .eq("person_id", personId)
      .order("year", { ascending: true })
      .order("month", { ascending: true, nullsFirst: true })
      .order("day", { ascending: true, nullsFirst: true })
      .order("created_at", { ascending: true });

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return { success: true, data: [] };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data: (data as PersonLifeEvent[]) || [] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi khi tải nhật ký cuộc đời.";
    return { success: false, error: message };
  }
}

/**
 * Thêm mới hoặc cập nhật một mốc nhật ký theo năm
 */
export async function savePersonLifeEventAction(
  input: SaveLifeEventInput,
): Promise<SingleLifeEventResult> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Vui lòng đăng nhập để thực hiện chức năng này." };
    }

    const year = Number(input.year);
    if (!year || isNaN(year) || year < 1 || year > 2100) {
      return { success: false, error: "Vui lòng nhập năm hợp lệ (ví dụ: 1975)." };
    }

    const trimmedTitle = input.title?.trim();
    if (!trimmedTitle) {
      return { success: false, error: "Tiêu đề mốc năm không được để trống." };
    }

    const trimmedContent = input.content?.trim();
    if (!trimmedContent) {
      return { success: false, error: "Nội dung nhật ký không được để trống." };
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
        error: "Bạn không có quyền cập nhật nhật ký trong dòng họ này.",
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
      year,
      month: input.month ? Number(input.month) : null,
      day: input.day ? Number(input.day) : null,
      title: trimmedTitle,
      content: trimmedContent,
      image_url: input.imageUrl?.trim() || null,
      author_type: finalAuthorType,
      author_name: trimmedAuthorName,
      author_relationship: trimmedRelationship,
      created_by: user.id,
      updated_at: new Date().toISOString(),
    };

    const client = getAdminSupabase() || (await getSupabase());
    let savedData: PersonLifeEvent;

    if (input.id) {
      const { data, error } = await client
        .from("person_life_events")
        .update(payload)
        .eq("id", input.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: "Lỗi cập nhật: " + error.message };
      }
      savedData = data as PersonLifeEvent;
    } else {
      const { data, error } = await client
        .from("person_life_events")
        .insert(payload)
        .select()
        .single();

      if (error) {
        return { success: false, error: "Lỗi tạo mới: " + error.message };
      }
      savedData = data as PersonLifeEvent;
    }

    revalidatePath(`/dashboard/${context.family.slug}/members/${input.personId}`);
    revalidatePath(`/dashboard/${context.family.slug}/members`);
    revalidatePath(`/dashboard/${context.family.slug}/tree`);

    return { success: true, data: savedData };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
    return { success: false, error: message };
  }
}

/**
 * Xóa một mốc nhật ký
 */
export async function deletePersonLifeEventAction(
  eventId: string,
  familyId: string,
  personId: string,
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
    const { data: existing } = await supabase
      .from("person_life_events")
      .select("created_by")
      .eq("id", eventId)
      .maybeSingle();

    if (!existing) {
      return { success: true };
    }

    const isCreator = existing.created_by === user.id;
    if (!isSystemAdmin && !isFamilyAdmin && !isCreator) {
      return { success: false, error: "Bạn không có quyền xóa mốc nhật ký này." };
    }

    const client = getAdminSupabase() || supabase;
    const { error } = await client
      .from("person_life_events")
      .delete()
      .eq("id", eventId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/${context.family.slug}/members/${personId}`);
    revalidatePath(`/dashboard/${context.family.slug}/members`);
    revalidatePath(`/dashboard/${context.family.slug}/tree`);

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi khi xóa sự kiện.";
    return { success: false, error: message };
  }
}
