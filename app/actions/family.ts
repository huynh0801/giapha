"use server";

import {
  getFamilyContextById,
  getProfile,
  getSupabase,
} from "@/utils/supabase/queries";
import { parseBlogImageLimitInput } from "@/utils/blogImageRules";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateFamilyActionState = {
  success?: boolean;
  error?: string;
  message?: string;
  familySlug?: string;
  familyName?: string;
};

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function getText(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() || "";
}

function getSupabaseErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === "object") {
    const supabaseError = error as {
      code?: string;
      message?: string;
      details?: string;
      hint?: string;
    };
    const parts = [
      supabaseError.code,
      supabaseError.message,
      supabaseError.details,
      supabaseError.hint,
    ].filter(Boolean);

    if (parts.length > 0) return parts.join(" - ");
  }

  return "Không thể hoàn tất thao tác. Hãy kiểm tra log server.";
}

async function ensureFamilyManager(familyId: string) {
  if (!familyId) {
    return { error: "Thiếu thông tin dòng họ." };
  }

  const context = await getFamilyContextById(familyId);
  if (!context?.canManage) {
    return {
      error:
        "Bạn không có quyền quản trị cấu hình của dòng họ này. Chỉ Admin dòng họ active của đúng dòng họ mới được thao tác.",
    };
  }

  return { context };
}

export async function createFamilyAction(
  _prevState: CreateFamilyActionState,
  formData: FormData,
): Promise<CreateFamilyActionState> {
  const profile = await getProfile();
  if (!profile?.is_active || profile.role !== "system_admin") {
    return { error: "Chỉ Super Admin mới có quyền tạo dòng họ." };
  }

  const name = getText(formData, "name");
  const requestedSlug = getText(formData, "slug");
  const description = getText(formData, "description");
  const adminProfileId = getText(formData, "admin_profile_id");

  if (!name) return { error: "Tên dòng họ là bắt buộc." };
  if (!adminProfileId) {
    return { error: "Vui lòng chọn Admin dòng họ đầu tiên." };
  }

  const slug = slugify(requestedSlug || name);
  if (!slug) return { error: "Slug không hợp lệ." };

  const supabase = await getSupabase();
  const { error } = await supabase.rpc("create_family_with_admin", {
    family_name: name,
    family_slug: slug,
    family_description: description,
    admin_profile_id: adminProfileId,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/families");
  revalidatePath("/admin/families/dashboard");
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${slug}`);
  return {
    success: true,
    message: `Đã tạo dòng họ ${name} thành công.`,
    familySlug: slug,
    familyName: name,
  };
}

async function ensureSystemAdmin() {
  const profile = await getProfile();
  if (!profile?.is_active || profile.role !== "system_admin") {
    return { error: "Chỉ Super Admin mới có quyền thao tác dòng họ." };
  }

  return { profile };
}

export async function replaceFamilyAdminAction(formData: FormData) {
  const familyId = getText(formData, "family_id");
  const profileId = getText(formData, "profile_id");

  const guard = await ensureSystemAdmin();
  if ("error" in guard) return { error: guard.error };
  if (!familyId || !profileId) {
    return { error: "Vui lòng chọn dòng họ và tài khoản Admin Dòng Họ mới." };
  }

  const supabase = await getSupabase();
  const { data: family } = await supabase
    .from("families")
    .select("slug")
    .eq("id", familyId)
    .maybeSingle();
  const { error } = await supabase.rpc("replace_family_admin", {
    target_family_id: familyId,
    target_profile_id: profileId,
  });

  if (error) {
    console.error("Failed to replace family admin:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/families");
  revalidatePath("/admin/families/dashboard");
  revalidatePath("/dashboard");
  if (family?.slug) {
    revalidatePath(`/dashboard/${family.slug}`);
    revalidatePath(`/dashboard/${family.slug}/admins`);
  }
  return { success: true };
}

export async function deleteFamilyAction(formData: FormData) {
  const familyId = getText(formData, "family_id");
  const familyName = getText(formData, "family_name");
  const confirmation = getText(formData, "confirmation");

  const guard = await ensureSystemAdmin();
  if ("error" in guard) return { error: guard.error };
  if (!familyId || !familyName) {
    return { error: "Thiếu thông tin dòng họ cần xóa." };
  }
  if (confirmation !== familyName) {
    return { error: "Vui lòng nhập đúng tên dòng họ để xác nhận xóa." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase.rpc("delete_family", {
    target_family_id: familyId,
  });

  if (error) {
    const message = getSupabaseErrorMessage(error);
    console.error("Failed to delete family:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    return { error: message };
  }

  revalidatePath("/admin/families");
  revalidatePath("/admin/families/dashboard");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateFamilyBlogImageLimitAction(formData: FormData) {
  const familyId = getText(formData, "family_id");
  const limitInput = getText(formData, "blog_max_images_per_post");

  const guard = await ensureSystemAdmin();
  if ("error" in guard) return { error: guard.error };
  if (!familyId) return { error: "Thiếu thông tin dòng họ." };

  const limit = parseBlogImageLimitInput(limitInput);
  const supabase = await getSupabase();
  const { data: family, error: fetchError } = await supabase
    .from("families")
    .select("slug,settings")
    .eq("id", familyId)
    .maybeSingle();

  if (fetchError) return { error: fetchError.message };
  if (!family) return { error: "Không tìm thấy dòng họ." };

  const settings =
    family.settings && typeof family.settings === "object"
      ? (family.settings as Record<string, unknown>)
      : {};
  const nextSettings = {
    ...settings,
    blog_max_images_per_post: limit,
  };

  const { error } = await supabase
    .from("families")
    .update({ settings: nextSettings })
    .eq("id", familyId);

  if (error) return { error: error.message };

  revalidatePath("/admin/families");
  revalidatePath("/admin/families/dashboard");
  revalidatePath(`/dashboard/${family.slug}`);
  revalidatePath(`/dashboard/${family.slug}/blog`);
  return { success: true, settings: nextSettings };
}

export async function updateFamilyAction(formData: FormData) {
  const familyId = getText(formData, "family_id");
  const guard = await ensureFamilyManager(familyId);
  if ("error" in guard) throw new Error(guard.error);

  const currentSlug = guard.context.family.slug;
  const name = getText(formData, "name");
  const requestedSlug = getText(formData, "slug");
  const description = getText(formData, "description");
  const originLocation = getText(formData, "origin_location");
  const logoUrl = getText(formData, "logo_url");
  const visibilityInput = getText(formData, "visibility");
  const visibility =
    visibilityInput === "family_only" || visibilityInput === "public"
      ? visibilityInput
      : "private";

  if (!name) throw new Error("Tên dòng họ là bắt buộc.");

  const slug = slugify(requestedSlug || name);
  if (!slug) throw new Error("Slug không hợp lệ.");

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("families")
    .update({
      name,
      slug,
      description: description || null,
      origin_location: originLocation || null,
      logo_url: logoUrl || null,
      visibility,
    })
    .eq("id", familyId)
    .select("slug")
    .single();

  if (error) throw new Error(error.message);

  const nextSlug = data?.slug || slug;
  revalidatePath("/dashboard");
  revalidatePath("/admin/families");
  revalidatePath("/admin/families/dashboard");
  revalidatePath(`/dashboard/${currentSlug}`);
  revalidatePath(`/dashboard/${currentSlug}/about`);
  revalidatePath(`/dashboard/${nextSlug}`);
  revalidatePath(`/dashboard/${nextSlug}/about`);

  redirect(`/dashboard/${nextSlug}/about`);
}

export async function createFamilyTreeAction(formData: FormData) {
  const familyId = getText(formData, "family_id");
  const guard = await ensureFamilyManager(familyId);
  if ("error" in guard) throw new Error(guard.error);

  const name = getText(formData, "name");
  const requestedSlug = getText(formData, "slug");
  const description = getText(formData, "description");
  const visibilityInput = getText(formData, "visibility");
  const isPrimary = formData.get("is_primary") === "on";
  const visibility =
    visibilityInput === "family_only" || visibilityInput === "public"
      ? visibilityInput
      : "private";

  if (!name) throw new Error("Tên cây gia phả là bắt buộc.");

  const slug = slugify(requestedSlug || name);
  if (!slug) throw new Error("Slug cây gia phả không hợp lệ.");

  const supabase = await getSupabase();

  if (isPrimary) {
    const resetResult = await supabase
      .from("family_trees")
      .update({ is_primary: false })
      .eq("family_id", familyId);
    if (resetResult.error) throw new Error(resetResult.error.message);
  }

  const { error } = await supabase.from("family_trees").insert({
    family_id: familyId,
    name,
    slug,
    description: description || null,
    visibility,
    is_primary: isPrimary,
  });

  if (error) throw new Error(error.message);

  const targetSlug = guard.context.family.slug;
  revalidatePath(`/dashboard/${targetSlug}`);
  revalidatePath(`/dashboard/${targetSlug}/trees`);
  redirect(`/dashboard/${targetSlug}/trees`);
}

export async function setPrimaryFamilyTreeAction(formData: FormData) {
  const familyId = getText(formData, "family_id");
  const treeId = getText(formData, "tree_id");
  const guard = await ensureFamilyManager(familyId);
  if ("error" in guard) throw new Error(guard.error);
  if (!treeId) throw new Error("Thiếu thông tin cây gia phả.");

  const supabase = await getSupabase();
  const resetResult = await supabase
    .from("family_trees")
    .update({ is_primary: false })
    .eq("family_id", familyId);
  if (resetResult.error) throw new Error(resetResult.error.message);

  const setResult = await supabase
    .from("family_trees")
    .update({ is_primary: true })
    .eq("family_id", familyId)
    .eq("id", treeId);
  if (setResult.error) throw new Error(setResult.error.message);

  const targetSlug = guard.context.family.slug;
  revalidatePath(`/dashboard/${targetSlug}`);
  revalidatePath(`/dashboard/${targetSlug}/trees`);
  redirect(`/dashboard/${targetSlug}/trees`);
}
