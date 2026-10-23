"use server";

import { getSupabase } from "@/utils/supabase/queries";

function cleanText(value: FormDataEntryValue | null, fallback = "") {
  return (value?.toString() || fallback).slice(0, 1000);
}

export async function recordSiteVisit(formData: FormData) {
  const visitorId = cleanText(formData.get("visitor_id"));
  const path = cleanText(formData.get("path"), "/");
  const referrer = cleanText(formData.get("referrer"));
  const userAgent = cleanText(formData.get("user_agent"));

  if (!visitorId || !path) {
    return { success: false };
  }

  const supabase = await getSupabase();
  const { error } = await supabase.from("site_visits").insert({
    visitor_id: visitorId,
    path,
    referrer: referrer || null,
    user_agent: userAgent || null,
  });

  if (error) {
    return { success: false };
  }

  return { success: true };
}
