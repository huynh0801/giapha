"use server";

import { revalidatePath } from "next/cache";
import { applyTreeLineage } from "@/app/actions/genealogy";
import {
  getFamilyContextById,
  getProfile,
  getSupabase,
  getUser,
} from "@/utils/supabase/queries";

export interface GenealogyRequest {
  id: string;
  family_id: string;
  tree_id: string;
  user_id: string;
  user_name: string;
  user_email?: string;
  type: "claim_person" | "add_person";
  person_id?: string;
  person_name?: string;
  new_person_data?: {
    full_name: string;
    gender: "male" | "female";
    birth_year?: number | null;
    birth_order?: number | null;
    parent_id?: string | null;
    parent_name?: string | null;
  };
  message?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
}

export interface ClaimActionResult {
  success: boolean;
  error?: string;
  personId?: string;
  pendingApproval?: boolean;
  message?: string;
}

export async function claimExistingPersonAction(data: {
  familyId: string;
  personId: string;
  message?: string;
}): Promise<ClaimActionResult> {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    const context = await getFamilyContextById(data.familyId);
    if (!context || !context.membership || context.membership.status !== "active") {
      return {
        success: false,
        error: "Bạn không có quyền trong không gian dòng họ này.",
      };
    }

    const supabase = await getSupabase();

    // Verify person belongs to family
    const { data: person, error: personError } = await supabase
      .from("persons")
      .select("id, full_name, generation")
      .eq("family_id", data.familyId)
      .eq("id", data.personId)
      .maybeSingle();

    if (personError || !person) {
      return { success: false, error: "Không tìm thấy thành viên được chọn." };
    }

    const currentSettings =
      context.family.settings && typeof context.family.settings === "object"
        ? (context.family.settings as Record<string, unknown>)
        : {};

    const currentMemberLinks =
      currentSettings.member_links && typeof currentSettings.member_links === "object"
        ? (currentSettings.member_links as Record<string, string>)
        : {};

    const currentRequests = Array.isArray(currentSettings.genealogy_requests)
      ? (currentSettings.genealogy_requests as GenealogyRequest[])
      : [];

    // If caller is an Admin / canManage, auto-approve immediately
    if (context.canManage) {
      const nextSettings = {
        ...currentSettings,
        member_links: {
          ...currentMemberLinks,
          [user.id]: data.personId,
        },
      };

      const { error: updateError } = await supabase
        .from("families")
        .update({ settings: nextSettings })
        .eq("id", data.familyId);

      if (updateError) {
        return { success: false, error: "Không thể lưu liên kết: " + updateError.message };
      }

      revalidatePath(`/dashboard/${context.family.slug}`);
      revalidatePath(`/dashboard/${context.family.slug}/members`);
      return { success: true, personId: data.personId, message: "Đã liên kết danh tính thành công." };
    }

    // Option B: Regular members submit a pending request for Admin approval
    const profile = await getProfile();
    const requesterName = profile?.full_name || user.email?.split("@")[0] || "Thành viên";

    const newRequest: GenealogyRequest = {
      id: crypto.randomUUID(),
      family_id: data.familyId,
      tree_id: context.tree.id,
      user_id: user.id,
      user_name: requesterName,
      user_email: user.email || undefined,
      type: "claim_person",
      person_id: data.personId,
      person_name: person.full_name,
      message: data.message?.trim() || undefined,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    // Replace any previous pending requests from the same user to avoid duplicates
    const nextRequests = [
      newRequest,
      ...currentRequests.filter((r) => r.user_id !== user.id || r.status !== "pending"),
    ];

    const nextSettings = {
      ...currentSettings,
      genealogy_requests: nextRequests,
    };

    const { error: updateError } = await supabase
      .from("families")
      .update({ settings: nextSettings })
      .eq("id", data.familyId);

    if (updateError) {
      return { success: false, error: "Không thể gửi yêu cầu: " + updateError.message };
    }

    revalidatePath(`/dashboard/${context.family.slug}`);
    revalidatePath(`/dashboard/${context.family.slug}/members`);
    revalidatePath(`/dashboard/${context.family.slug}/requests`);

    return {
      success: true,
      pendingApproval: true,
      message: "Yêu cầu nhận tên đã được gửi đến Ban Quản Trị dòng họ để xét duyệt.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Lỗi khi gửi yêu cầu nhận danh tính.",
    };
  }
}

export async function unlinkSelfAction(data: {
  familyId: string;
}): Promise<ClaimActionResult> {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    const context = await getFamilyContextById(data.familyId);
    if (!context || !context.membership || context.membership.status !== "active") {
      return { success: false, error: "Từ chối truy cập." };
    }

    const supabase = await getSupabase();

    const currentSettings =
      context.family.settings && typeof context.family.settings === "object"
        ? (context.family.settings as Record<string, unknown>)
        : {};

    const currentMemberLinks =
      currentSettings.member_links && typeof currentSettings.member_links === "object"
        ? (currentSettings.member_links as Record<string, string>)
        : {};

    const nextLinks = { ...currentMemberLinks };
    delete nextLinks[user.id];

    const nextSettings = {
      ...currentSettings,
      member_links: nextLinks,
    };

    await supabase
      .from("families")
      .update({ settings: nextSettings })
      .eq("id", data.familyId);

    revalidatePath(`/dashboard/${context.family.slug}`);
    revalidatePath(`/dashboard/${context.family.slug}/members`);
    revalidatePath(`/dashboard/${context.family.slug}/requests`);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Lỗi khi hủy liên kết.",
    };
  }
}

export async function addSelfToFamilyTreeAction(formData: FormData): Promise<ClaimActionResult> {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    const familyId = formData.get("family_id")?.toString();
    const treeId = formData.get("tree_id")?.toString();
    const fullName = formData.get("full_name")?.toString().trim();
    const gender = formData.get("gender")?.toString();
    const birthYearStr = formData.get("birth_year")?.toString().trim();
    const parentId = formData.get("parent_id")?.toString().trim() || null;
    const birthOrderStr = formData.get("birth_order")?.toString().trim();
    const message = formData.get("message")?.toString().trim() || undefined;

    if (!familyId || !treeId) {
      return { success: false, error: "Thiếu mã định danh dòng họ hoặc cây gia phả." };
    }

    if (!fullName) {
      return { success: false, error: "Vui lòng nhập họ và tên của bạn." };
    }

    if (gender !== "male" && gender !== "female") {
      return { success: false, error: "Vui lòng chọn giới tính hợp lệ." };
    }

    const context = await getFamilyContextById(familyId, treeId);
    if (!context || !context.membership || context.membership.status !== "active") {
      return {
        success: false,
        error: "Bạn chưa là thành viên chính thức của dòng họ này.",
      };
    }

    const supabase = await getSupabase();
    const birthYear = birthYearStr ? parseInt(birthYearStr, 10) : null;
    const birthOrder = birthOrderStr ? parseInt(birthOrderStr, 10) : null;

    const currentSettings =
      context.family.settings && typeof context.family.settings === "object"
        ? (context.family.settings as Record<string, unknown>)
        : {};

    const currentMemberLinks =
      currentSettings.member_links && typeof currentSettings.member_links === "object"
        ? (currentSettings.member_links as Record<string, string>)
        : {};

    const currentRequests = Array.isArray(currentSettings.genealogy_requests)
      ? (currentSettings.genealogy_requests as GenealogyRequest[])
      : [];

    // If caller is an Admin / canManage, auto-approve immediately
    if (context.canManage) {
      // 1. Create the new person in persons table
      const { data: createdPerson, error: personError } = await supabase
        .from("persons")
        .insert({
          family_id: context.family.id,
          tree_id: context.tree.id,
          full_name: fullName,
          gender,
          birth_year: isNaN(birthYear as number) ? null : birthYear,
          is_deceased: false,
          is_in_law: false,
          birth_order: isNaN(birthOrder as number) ? null : birthOrder,
          generation: null,
          visibility: "private",
          created_by: user.id,
        })
        .select("id")
        .single();

      if (personError || !createdPerson?.id) {
        return {
          success: false,
          error: personError?.message || "Không thể tạo hồ sơ người trong gia phả.",
        };
      }

      const newPersonId = createdPerson.id as string;

      // 2. If parent was selected, add biological_child relationship
      if (parentId) {
        await supabase.from("relationships").insert({
          family_id: context.family.id,
          tree_id: context.tree.id,
          type: "biological_child",
          person_a: parentId,
          person_b: newPersonId,
        });
      }

      // 3. Recalculate lineage & generations
      await applyTreeLineage(supabase, context);

      // 4. Link profile to this new person
      const nextSettings = {
        ...currentSettings,
        member_links: {
          ...currentMemberLinks,
          [user.id]: newPersonId,
        },
      };

      await supabase
        .from("families")
        .update({ settings: nextSettings })
        .eq("id", context.family.id);

      revalidatePath(`/dashboard/${context.family.slug}`);
      revalidatePath(`/dashboard/${context.family.slug}/members`);

      return { success: true, personId: newPersonId, message: "Đã thêm thành công vào cây gia phả." };
    }

    // Option B: Regular members submit a pending request for Admin approval
    let parentName: string | null = null;
    if (parentId) {
      const { data: parentPerson } = await supabase
        .from("persons")
        .select("full_name")
        .eq("id", parentId)
        .maybeSingle();
      if (parentPerson) {
        parentName = parentPerson.full_name;
      }
    }

    const profile = await getProfile();
    const requesterName = profile?.full_name || user.email?.split("@")[0] || fullName;

    const newRequest: GenealogyRequest = {
      id: crypto.randomUUID(),
      family_id: familyId,
      tree_id: context.tree.id,
      user_id: user.id,
      user_name: requesterName,
      user_email: user.email || undefined,
      type: "add_person",
      new_person_data: {
        full_name: fullName,
        gender: gender as "male" | "female",
        birth_year: isNaN(birthYear as number) ? null : birthYear,
        birth_order: isNaN(birthOrder as number) ? null : birthOrder,
        parent_id: parentId,
        parent_name: parentName,
      },
      message,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    const nextRequests = [
      newRequest,
      ...currentRequests.filter((r) => r.user_id !== user.id || r.status !== "pending"),
    ];

    const nextSettings = {
      ...currentSettings,
      genealogy_requests: nextRequests,
    };

    const { error: updateError } = await supabase
      .from("families")
      .update({ settings: nextSettings })
      .eq("id", context.family.id);

    if (updateError) {
      return { success: false, error: "Không thể gửi yêu cầu: " + updateError.message };
    }

    revalidatePath(`/dashboard/${context.family.slug}`);
    revalidatePath(`/dashboard/${context.family.slug}/members`);
    revalidatePath(`/dashboard/${context.family.slug}/requests`);

    return {
      success: true,
      pendingApproval: true,
      message: "Yêu cầu thêm vào gia phả đã được gửi đến Ban Quản Trị dòng họ để xét duyệt.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Đã xảy ra lỗi khi gửi yêu cầu.",
    };
  }
}

export async function cancelGenealogyRequestAction(data: {
  familyId: string;
  requestId: string;
}): Promise<ClaimActionResult> {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    const context = await getFamilyContextById(data.familyId);
    if (!context || !context.membership || context.membership.status !== "active") {
      return { success: false, error: "Từ chối truy cập." };
    }

    const supabase = await getSupabase();
    const currentSettings =
      context.family.settings && typeof context.family.settings === "object"
        ? (context.family.settings as Record<string, unknown>)
        : {};

    const currentRequests = Array.isArray(currentSettings.genealogy_requests)
      ? (currentSettings.genealogy_requests as GenealogyRequest[])
      : [];

    const nextRequests = currentRequests.map((r) => {
      if (r.id === data.requestId && r.user_id === user.id && r.status === "pending") {
        return { ...r, status: "cancelled" as const };
      }
      return r;
    });

    const nextSettings = {
      ...currentSettings,
      genealogy_requests: nextRequests,
    };

    await supabase
      .from("families")
      .update({ settings: nextSettings })
      .eq("id", data.familyId);

    revalidatePath(`/dashboard/${context.family.slug}`);
    revalidatePath(`/dashboard/${context.family.slug}/members`);
    revalidatePath(`/dashboard/${context.family.slug}/requests`);

    return { success: true, message: "Đã hủy yêu cầu thành công." };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Lỗi khi hủy yêu cầu.",
    };
  }
}

export async function reviewGenealogyRequestAction(formData: FormData): Promise<void> {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("Bạn chưa đăng nhập.");
    }

    const familyId = formData.get("family_id")?.toString();
    const requestId = formData.get("request_id")?.toString();
    const decision = formData.get("decision")?.toString(); // "approved" | "rejected"
    const rejectionReason = formData.get("rejection_reason")?.toString().trim();

    if (!familyId || !requestId || !decision) {
      throw new Error("Thiếu thông tin phê duyệt.");
    }

    const context = await getFamilyContextById(familyId);
    if (!context?.canManage) {
      throw new Error("Chỉ Ban Quản Trị dòng họ mới có quyền duyệt yêu cầu phả hệ.");
    }

    const supabase = await getSupabase();
    const currentSettings =
      context.family.settings && typeof context.family.settings === "object"
        ? (context.family.settings as Record<string, unknown>)
        : {};

    const currentMemberLinks =
      currentSettings.member_links && typeof currentSettings.member_links === "object"
        ? (currentSettings.member_links as Record<string, string>)
        : {};

    const currentRequests = Array.isArray(currentSettings.genealogy_requests)
      ? (currentSettings.genealogy_requests as GenealogyRequest[])
      : [];

    const targetRequest = currentRequests.find((r) => r.id === requestId);
    if (!targetRequest || targetRequest.status !== "pending") {
      throw new Error("Yêu cầu không tồn tại hoặc đã được xử lý.");
    }

    let linkedPersonId: string | null = null;
    const nowIso = new Date().toISOString();

    if (decision === "approved") {
      if (targetRequest.type === "claim_person") {
        if (!targetRequest.person_id) {
          throw new Error("Yêu cầu thiếu mã thành viên cần nhận.");
        }
        linkedPersonId = targetRequest.person_id;
      } else if (targetRequest.type === "add_person") {
        const pData = targetRequest.new_person_data;
        if (!pData || !pData.full_name) {
          throw new Error("Yêu cầu thiếu dữ liệu hồ sơ mới.");
        }

        // 1. Create person in tree
        const { data: createdPerson, error: personError } = await supabase
          .from("persons")
          .insert({
            family_id: context.family.id,
            tree_id: targetRequest.tree_id || context.tree.id,
            full_name: pData.full_name,
            gender: pData.gender,
            birth_year: pData.birth_year ?? null,
            is_deceased: false,
            is_in_law: false,
            birth_order: pData.birth_order ?? null,
            generation: null,
            visibility: "private",
            created_by: user.id,
          })
          .select("id")
          .single();

        if (personError || !createdPerson?.id) {
          throw new Error("Lỗi tạo hồ sơ người: " + (personError?.message || ""));
        }

        linkedPersonId = createdPerson.id;

        // 2. Add parent relationship
        if (pData.parent_id) {
          await supabase.from("relationships").insert({
            family_id: context.family.id,
            tree_id: targetRequest.tree_id || context.tree.id,
            type: "biological_child",
            person_a: pData.parent_id,
            person_b: linkedPersonId,
          });
        }

        // 3. Recalculate lineage
        await applyTreeLineage(supabase, context);
      }
    }

    // Update settings
    const nextRequests = currentRequests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: (decision === "approved" ? "approved" : "rejected") as "approved" | "rejected",
          reviewed_at: nowIso,
          reviewed_by: user.id,
          rejection_reason: decision === "rejected" ? rejectionReason : undefined,
          person_id: linkedPersonId || r.person_id,
        };
      }
      return r;
    });

    const nextMemberLinks = { ...currentMemberLinks };
    if (decision === "approved" && linkedPersonId) {
      nextMemberLinks[targetRequest.user_id] = linkedPersonId;
    }

    const nextSettings = {
      ...currentSettings,
      member_links: nextMemberLinks,
      genealogy_requests: nextRequests,
    };

    const { error: updateError } = await supabase
      .from("families")
      .update({ settings: nextSettings })
      .eq("id", familyId);

    if (updateError) {
      throw new Error("Không thể lưu kết quả phê duyệt: " + updateError.message);
    }

    revalidatePath(`/dashboard/${context.family.slug}`);
    revalidatePath(`/dashboard/${context.family.slug}/members`);
    revalidatePath(`/dashboard/${context.family.slug}/requests`);

  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Lỗi khi xử lý phê duyệt.");
  }
}
