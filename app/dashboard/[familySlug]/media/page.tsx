import { notFound } from "next/navigation";
import HeritagePageHeader from "@/components/dashboard/HeritagePageHeader";
import { HeritageBadge, HeritageFrame } from "@/components/dashboard/HeritageUI";
import MediaLibrary from "@/components/MediaLibrary";
import { getFamilyContextBySlug } from "@/utils/supabase/queries";
import { listMediaAction } from "@/app/actions/storage";
import { Image as ImageIcon, ShieldCheck } from "lucide-react";

interface PageProps {
  params: Promise<{ familySlug: string }>;
}

export default async function FamilyMediaPage({ params }: PageProps) {
  const { familySlug } = await params;
  const context = await getFamilyContextBySlug(familySlug);
  if (!context) notFound();

  const family = context.family;
  const mediaRes = await listMediaAction(familySlug);
  const initialFiles = mediaRes.success ? mediaRes.files : [];

  return (
    <div className="flex w-full flex-1 flex-col pb-16">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        <HeritagePageHeader
          familySlug={familySlug}
          familyName={family.name}
          title="Kho Ảnh & Tư Liệu Dòng Họ"
          description="Quản lý toàn bộ ảnh đại diện, ảnh bài viết, kỷ vật và tư liệu của dòng họ được lưu trữ trên Cloudflare R2."
          badge={
            <HeritageBadge variant="crimson" className="inline-flex items-center gap-1.5">
              <ImageIcon className="size-3.5" />
              <span>Kho lưu trữ R2</span>
            </HeritageBadge>
          }
        />

        <HeritageFrame cornerColor="#8c1d1d">
          <MediaLibrary
            familySlug={familySlug}
            familyId={family.id}
            canManage={context.canManage}
            initialFiles={initialFiles}
          />
        </HeritageFrame>
      </main>
    </div>
  );
}
