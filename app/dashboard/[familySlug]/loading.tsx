import React from "react";
import BackgroundDecor from "@/components/landing/BackgroundDecor";
import { HeritageFrame } from "@/components/dashboard/HeritageUI";

export default function FamilyDashboardLoading() {
  return (
    <div className="relative min-h-screen bg-[#fcfaf2] pb-16 text-[#2c1a11]">
      <BackgroundDecor />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Breadcrumb & Navigation Skeleton */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#deb887]/40 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-28 animate-pulse rounded bg-[#deb887]/40" />
            <span className="text-[#deb887]">/</span>
            <div className="h-4 w-36 animate-pulse rounded bg-[#caa455]/40" />
          </div>
          <div className="h-8 w-32 animate-pulse rounded-full border border-[#deb887]/60 bg-[#deb887]/20" />
        </div>

        {/* Family Header Skeleton */}
        <div className="mb-8">
          <HeritageFrame innerClassName="!p-6 sm:!p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <div className="h-4 w-32 animate-pulse rounded bg-amber-200/60" />
                <div className="h-8 w-64 animate-pulse rounded bg-[#8c1d1d]/20" />
                <div className="h-4 w-80 animate-pulse rounded bg-stone-200/60" />
              </div>
              <div className="flex gap-2">
                <div className="h-10 w-28 animate-pulse rounded-lg border border-[#caa455]/40 bg-[#f5e7c7]/50" />
                <div className="h-10 w-28 animate-pulse rounded-lg bg-[#8c1d1d]/20" />
              </div>
            </div>
          </HeritageFrame>
        </div>

        {/* 3 Stats Card Skeletons */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <HeritageFrame key={i} innerClassName="!p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 animate-pulse rounded-xl bg-[#caa455]/30" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 animate-pulse rounded bg-stone-200" />
                  <div className="h-6 w-12 animate-pulse rounded bg-[#8c1d1d]/30" />
                </div>
              </div>
            </HeritageFrame>
          ))}
        </div>

        {/* Content Skeletons Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content Area (2 cols) */}
          <div className="space-y-6 lg:col-span-2">
            <HeritageFrame innerClassName="!p-6">
              <div className="mb-4 flex items-center justify-between border-b border-[#deb887]/30 pb-3">
                <div className="h-5 w-40 animate-pulse rounded bg-[#8c1d1d]/30" />
                <div className="h-4 w-20 animate-pulse rounded bg-stone-200" />
              </div>
              <div className="space-y-3">
                <div className="h-20 w-full animate-pulse rounded-lg bg-[#f5e7c7]/30" />
                <div className="h-20 w-full animate-pulse rounded-lg bg-[#f5e7c7]/30" />
                <div className="h-20 w-full animate-pulse rounded-lg bg-[#f5e7c7]/30" />
              </div>
            </HeritageFrame>
          </div>

          {/* Sidebar / Upcoming Events (1 col) */}
          <div className="space-y-6">
            <HeritageFrame innerClassName="!p-6">
              <div className="mb-4 flex items-center justify-between border-b border-[#deb887]/30 pb-3">
                <div className="h-5 w-32 animate-pulse rounded bg-[#8c1d1d]/30" />
              </div>
              <div className="space-y-3">
                <div className="h-16 w-full animate-pulse rounded-lg bg-stone-100" />
                <div className="h-16 w-full animate-pulse rounded-lg bg-stone-100" />
              </div>
            </HeritageFrame>
          </div>
        </div>
      </main>
    </div>
  );
}
