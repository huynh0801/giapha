import {
  createFamilyTreeAction,
  setPrimaryFamilyTreeAction,
} from "@/app/actions/family";
import { FamilyTree } from "@/types";
import { getFamilyContextBySlug, getSupabase } from "@/utils/supabase/queries";
import { ArrowLeft, Crown, Network, Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ familySlug: string }>;
}

function visibilityLabel(value: string) {
  if (value === "family_only") return "Chỉ trong dòng họ";
  if (value === "public") return "Công khai";
  return "Riêng tư";
}

export default async function FamilyTreesPage({ params }: PageProps) {
  const { familySlug } = await params;
  const context = await getFamilyContextBySlug(familySlug);
  if (!context) notFound();

  const supabase = await getSupabase();
  const [{ data: trees }, { data: personRows }] = await Promise.all([
    supabase
      .from("family_trees")
      .select("*")
      .eq("family_id", context.family.id)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true }),
    supabase
      .from("persons")
      .select("tree_id")
      .eq("family_id", context.family.id),
  ]);

  const treeRows = ((trees || []) as FamilyTree[]).sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.created_at.localeCompare(b.created_at);
  });
  const countByTree = (personRows || []).reduce<Record<string, number>>(
    (acc, row) => {
      const treeId = (row as { tree_id: string }).tree_id;
      acc[treeId] = (acc[treeId] || 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <main className="flex w-full flex-1 flex-col bg-stone-50/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href={`/dashboard/${familySlug}`}
              className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-stone-500 transition-colors hover:text-[#800000]"
            >
              <ArrowLeft className="size-4" />
              Quay về dashboard dòng họ
            </Link>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-600">
              Quản lý cây gia phả
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
              Cây gia phả của {context.family.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Mỗi dòng họ có thể có nhiều cây, nhưng không gian gia phả hiện tại luôn
              lấy cây được đánh dấu là cây chính để nhập liệu, xem sơ đồ và
              thống kê.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">
            <ShieldCheck className="size-4" />
            Dữ liệu riêng tư theo dòng họ
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
          {context.canManage ? (
            <form
              action={createFamilyTreeAction}
              className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <input type="hidden" name="family_id" value={context.family.id} />
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <Plus className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-stone-900">
                    Tạo cây gia phả mới
                  </h2>
                  <p className="text-sm text-stone-500">
                    Dành cho chi phái hoặc nhánh dữ liệu riêng.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Tên cây
                  </span>
                  <input
                    name="name"
                    required
                    placeholder="Ví dụ: Cây gia phả chính"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Slug
                  </span>
                  <input
                    name="slug"
                    placeholder="cay-gia-pha-chinh"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Mô tả
                  </span>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Ghi chú về phạm vi cây, chi phái hoặc dữ liệu đang nhập."
                    className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-stone-700">
                    Chế độ hiển thị
                  </span>
                  <select
                    name="visibility"
                    defaultValue="private"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-stone-900 outline-none focus:border-amber-500"
                  >
                    <option value="private">Riêng tư</option>
                    <option value="family_only">Chỉ trong dòng họ</option>
                  </select>
                </label>

                <label className="flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
                  <input
                    type="checkbox"
                    name="is_primary"
                    className="size-4 rounded border-amber-300"
                  />
                  Đặt làm cây chính sau khi tạo
                </label>
              </div>

              <button type="submit" className="btn-primary mt-6 w-full">
                Tạo cây gia phả
              </button>
            </form>
          ) : (
            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <Network className="mb-4 size-8 text-amber-600" />
              <h2 className="text-xl font-black text-stone-900">
                Danh sách cây gia phả
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Bạn có quyền xem cây trong dòng họ này. Chỉ Admin dòng họ
                active của đúng dòng họ mới được tạo cây mới và đổi cây chính.
              </p>
            </section>
          )}

          <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">
                  Cây hiện có
                </p>
                <h2 className="mt-1 text-2xl font-black text-stone-900">
                  {treeRows.length} cây
                </h2>
              </div>
              <Network className="size-7 text-stone-300" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-stone-100">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                  <tr>
                    <th className="px-4 py-3">Cây gia phả</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Thành viên</th>
                    <th className="px-4 py-3">Hiển thị</th>
                    <th className="px-4 py-3 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {treeRows.map((tree) => (
                    <tr key={tree.id} className="hover:bg-amber-50/40">
                      <td className="px-4 py-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex size-9 items-center justify-center rounded-xl bg-stone-50 text-stone-500">
                            {tree.is_primary ? (
                              <Crown className="size-4 text-amber-600" />
                            ) : (
                              <Network className="size-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-black text-stone-900">
                              {tree.name}
                            </p>
                            {tree.description && (
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-stone-500">
                                {tree.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-stone-500">
                        {tree.slug}
                      </td>
                      <td className="px-4 py-4 font-bold text-stone-700">
                        {(countByTree[tree.id] || 0).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-4 py-4 text-stone-600">
                        {visibilityLabel(tree.visibility)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/${familySlug}/members?treeId=${tree.id}`}
                            className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-black text-stone-700 transition-colors hover:bg-amber-100 hover:text-amber-800"
                          >
                            Mở cây
                          </Link>
                          {tree.is_primary ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                              <Crown className="size-3.5" />
                              Cây chính
                            </span>
                          ) : context.canManage ? (
                            <form action={setPrimaryFamilyTreeAction}>
                              <input
                                type="hidden"
                                name="family_id"
                                value={context.family.id}
                              />
                              <input
                                type="hidden"
                                name="tree_id"
                                value={tree.id}
                              />
                              <button
                                type="submit"
                                className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-black text-stone-700 transition-colors hover:bg-amber-100 hover:text-amber-800"
                              >
                                Đặt làm cây chính
                              </button>
                            </form>
                          ) : (
                            <span className="text-xs font-semibold text-stone-400">
                              Cây phụ
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {treeRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-sm font-semibold text-stone-500"
                      >
                        Chưa có cây gia phả nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
