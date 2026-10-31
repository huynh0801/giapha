import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://giaphaquangbinh.io.vn";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/news", "/blog/*"],
        disallow: [
          "/admin",
          "/admin/*",
          "/dashboard",
          "/dashboard/*",
          "/api/*",
          "/auth/*",
          "/login",
          "/profile",
          "/setup",
          "/missing-db-config",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/about", "/news", "/blog/*"],
        disallow: [
          "/admin/*",
          "/dashboard/*",
          "/api/*",
          "/auth/*",
          "/login",
          "/profile",
          "/setup",
          "/missing-db-config",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
