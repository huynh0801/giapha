/* eslint-disable @next/next/no-img-element */
import { BlogPost } from "@/types";
import Link from "next/link";

type LandingBlogPost = Pick<
  BlogPost,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "category"
  | "cover_image_url"
  | "published_at"
  | "created_at"
>;

const smokeStyles = [
  {
    background:
      "linear-gradient(to top, rgba(220,38,38,.82) 0%, rgba(249,115,22,.58) 14%, rgba(255,255,255,.24) 29%, rgba(255,255,255,.07) 39%, rgba(255,255,255,0) 47%), linear-gradient(to right, rgba(255,255,255,.22) 0%, rgba(255,255,255,.08) 24%, rgba(255,255,255,0) 42%)",
  },
  {
    background:
      "linear-gradient(to right, rgba(22,163,74,.82) 0%, rgba(20,184,166,.58) 15%, rgba(125,211,252,.28) 30%, rgba(255,255,255,.08) 40%, rgba(255,255,255,0) 48%), linear-gradient(to top, rgba(255,255,255,.2) 0%, rgba(255,255,255,.07) 24%, rgba(255,255,255,0) 42%)",
  },
  {
    background:
      "linear-gradient(to left, rgba(126,34,206,.82) 0%, rgba(236,72,153,.58) 15%, rgba(244,114,182,.3) 30%, rgba(255,255,255,.08) 40%, rgba(255,255,255,0) 50%), linear-gradient(to bottom, rgba(255,255,255,.22) 0%, rgba(255,255,255,.07) 24%, rgba(255,255,255,0) 42%)",
  },
  {
    background:
      "linear-gradient(to bottom, rgba(250,204,21,.84) 0%, rgba(251,146,60,.58) 14%, rgba(255,255,255,.26) 30%, rgba(255,255,255,.08) 40%, rgba(255,255,255,0) 48%), linear-gradient(to left, rgba(59,130,246,.26) 0%, rgba(59,130,246,.09) 24%, rgba(59,130,246,0) 42%)",
  },
  {
    background:
      "linear-gradient(to top, rgba(13,148,136,.8) 0%, rgba(45,212,191,.54) 14%, rgba(191,219,254,.26) 30%, rgba(255,255,255,.08) 40%, rgba(255,255,255,0) 48%), linear-gradient(to left, rgba(245,158,11,.28) 0%, rgba(245,158,11,.1) 24%, rgba(245,158,11,0) 42%)",
  },
  {
    background:
      "linear-gradient(to right, rgba(255,255,255,.78) 0%, rgba(191,219,254,.48) 14%, rgba(96,165,250,.28) 29%, rgba(255,255,255,.08) 39%, rgba(255,255,255,0) 48%), linear-gradient(to top, rgba(244,63,94,.28) 0%, rgba(244,63,94,.1) 24%, rgba(244,63,94,0) 42%)",
  },
];


function getPostYear(post: LandingBlogPost) {
  const value = post.published_at || post.created_at;
  return value ? new Date(value).getFullYear() : new Date().getFullYear();
}

function getCoverImage(post: LandingBlogPost) {
  return post.cover_image_url || "/family.jpg.png";
}

export default function HomeBlogCarousel({
  posts,
}: {
  posts: LandingBlogPost[];
}) {
  if (posts.length === 0) {
    return (
      <div className="mx-auto flex min-h-[320px] max-w-4xl items-center justify-center rounded-[28px] bg-white/60 px-6 text-center shadow-sm">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-600">
            Chưa có bài viết
          </p>
          <h2 className="mt-3 text-2xl font-black text-[#7D0000] md:text-3xl">
            Nội dung sẽ xuất hiện sau khi admin đăng tải
          </h2>
          <p className="mt-3 text-sm text-stone-500">
            Vào trang quản trị để tạo bài viết đầu tiên và upload ảnh bìa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-2 gap-0 md:grid-cols-4">
      {posts.map((post, index) => {
        return (
          <Link
            href={`/blog/${post.slug}`}
            key={post.id}
            className="group relative aspect-square overflow-hidden"
          >
            <img
              src={getCoverImage(post)}
              alt={post.title}
              loading={index < 4 ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              className="absolute inset-0 scale-105 opacity-90 blur-[18px] transition duration-700 group-hover:opacity-100"
              style={smokeStyles[index % smokeStyles.length]}
              aria-hidden="true"
            />
            <div className="absolute inset-0 h-full bg-gradient-to-t from-black/92 via-black/24 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-white/16 via-white/7 to-transparent opacity-70" />

            <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-end gap-3 p-3 md:p-6">
              <span className="text-[7px] font-bold text-white/45 md:text-[9px]">
                {getPostYear(post)}
              </span>
            </div>

            <div className="absolute inset-0 z-10 flex flex-col justify-end p-3 text-white md:p-6">
              <h3 className="line-clamp-2 text-[9px] font-bold uppercase leading-tight drop-shadow-lg transition-colors group-hover:text-amber-200 md:text-base">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="mt-2 hidden line-clamp-2 text-xs leading-relaxed text-white/75 md:block">
                  {post.excerpt}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
