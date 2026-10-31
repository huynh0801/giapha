import type { MetadataRoute } from "next";
import { getPublicSupabase } from "@/utils/supabase/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://giaphaquangbinh.io.vn";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    const supabase = getPublicSupabase();
    if (!supabase) {
      return staticRoutes;
    }

    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at, created_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(1000);

    if (error || !posts) {
      return staticRoutes;
    }

    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(
        post.updated_at || post.published_at || post.created_at || Date.now()
      ),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...blogRoutes];
  } catch (err) {
    console.error("Error generating sitemap:", err);
    return staticRoutes;
  }
}
