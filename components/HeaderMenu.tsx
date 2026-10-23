"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function HeaderMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 focus:outline-none group"
      >
        {/* KHỐI CHỮ B VÀNG HỔ PHÁCH CHUẨN MẪU */}
        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-black text-lg border-2 border-white shadow-[0_4px_0_rgb(180,83,9)] group-active:translate-y-px transition-all">
          B
        </div>
        <span className="text-amber-600 font-bold text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border-2 border-amber-100 p-3 z-[100] animate-in fade-in zoom-in duration-200">
          <div className="px-4 py-2 text-[10px] font-black text-amber-500 uppercase tracking-widest border-b border-amber-50 mb-2">Quản trị viên</div>
          <Link href="/dashboard/profile" className="block px-4 py-3 text-sm font-bold text-stone-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors">Hồ sơ cá nhân</Link>
          <Link href="/dashboard/settings" className="block px-4 py-3 text-sm font-bold text-stone-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors">Cài đặt hệ thống</Link>
          <hr className="my-2 border-amber-50" />
          <button className="w-full text-left px-4 py-3 text-sm font-extrabold text-red-600 hover:bg-red-50 rounded-xl transition-colors">Đăng xuất</button>
        </div>
      )}
    </div>
  );
}
