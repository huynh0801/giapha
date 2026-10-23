"use server";

import {
  getFamilyContextById,
  getProfile,
  getSupabase,
  getUser,
} from "@/utils/supabase/queries";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getText(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() || "";
}

function safeDashboardReturnTo(value: string) {
  if (!value.startsWith("/dashboard")) return "/dashboard";
  return value;
}

function appendStatus(url: string, key: string, value: string) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${key}=${encodeURIComponent(value)}`;
}

export async function requestJoinFamilyAction(formData: FormData) {
  const [supabase, user, profile] = await Promise.all([
    getSupabase(),
    getUser(),
    getProfile(),
  ]);

  if (!user || !profile?.is_active) {
    redirect("/login");
  }

  if (profile.role !== "member") {
    throw new Error("Super Admin không thể gửi yêu cầu tham gia dòng họ.");
  }

  const familyId = getText(formData, "family_id");
  const message = getText(formData, "message");
  const returnTo = safeDashboardReturnTo(getText(formData, "return_to"));

  if (!familyId) {
    redirect(appendStatus(returnTo, "request", "missing-family"));
  }

  const { data: activeMembership } = await supabase
    .from("family_memberships")
    .select("id")
    .eq("family_id", familyId)
    .eq("profile_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (activeMembership) {
    redirect(appendStatus(returnTo, "request", "already-member"));
  }

  const { error } = await supabase.from("join_requests").upsert(
    {
      family_id: familyId,
      profile_id: user.id,
      message: message || null,
      status: "pending",
      reviewed_by: null,
      reviewed_at: null,
    },
    { onConflict: "family_id,profile_id" },
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  redirect(appendStatus(returnTo, "request", "sent"));
}

export async function reviewJoinRequestAction(formData: FormData) {
  const [supabase, user] = await Promise.all([getSupabase(), getUser()]);
  if (!user) redirect("/login");

  const familyId = getText(formData, "family_id");
  const requestId = getText(formData, "request_id");
  const decision = getText(formData, "decision");

  const context = await getFamilyContextById(familyId);
  if (!context?.canManage) {
    throw new Error(
      "Chỉ Admin dòng họ đang hoạt động mới được duyệt yêu cầu tham gia.",
    );
  }

  const { data: joinRequest, error: requestError } = await supabase
    .from("join_requests")
    .select("id, profile_id")
    .eq("id", requestId)
    .eq("family_id", familyId)
    .eq("status", "pending")
    .maybeSingle();

  if (requestError) throw new Error(requestError.message);
  if (!joinRequest) {
    throw new Error("Không tìm thấy yêu cầu đang chờ duyệt.");
  }

  if (decision === "approve") {
    const { error: membershipError } = await supabase.rpc(
      "set_family_membership",
      {
        target_family_id: familyId,
        target_profile_id: joinRequest.profile_id,
        new_role: "member",
        new_status: "active",
      },
    );

    if (membershipError) throw new Error(membershipError.message);
  }

  const nextStatus = decision === "approve" ? "approved" : "rejected";
  const { error: updateError } = await supabase
    .from("join_requests")
    .update({
      status: nextStatus,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .eq("family_id", familyId);

  if (updateError) throw new Error(updateError.message);

  revalidatePath(`/dashboard/${context.family.slug}`);
  revalidatePath(`/dashboard/${context.family.slug}/requests`);
  revalidatePath(`/dashboard/${context.family.slug}/members`);
}
