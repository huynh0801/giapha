"use client";

import Link from 'next/link';

export default function DashboardHeader() {
  return (
    // Ép Header co lại hết cỡ trên mobile để dành không gian cho menu
    <header className="w-full bg-white border-b border-orange-100 py-2 md:py-5 px-1 md:px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      
      {/* Khối bên trái: Thu nhỏ tối đa */}
      <div className="flex items-center gap-1 md:gap-4 flex-shrink-0">
        <div className="bg-[#8B0000] text-white p-1 md:p-2.5 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div className="flex flex-col">
          {/* Ép chữ "GIA PHẢ" cực nhỏ để nhường chỗ cho Menu bên cạnh */}
          <h1 className="font-black text-[11px] md:text-2xl tracking-tighter text-[#8B0000] m-0 p-0 whitespace-nowrap">GIA PHẢ</h1>
          <p className="hidden xs:block text-[8px] md:text-[10px] uppercase text-orange-600 font-extrabold m-0 mt-0.5">Dòng họ</p>
        </div>
      </div>

      {/* Khối Menu: Ép tất cả nằm trên 1 hàng, cỡ chữ 11px */}
      <nav className="flex items-center gap-1 md:gap-8 flex-1 justify-end">
        <div className="flex items-center gap-2 md:gap-8">
          <Link href="/" className="text-[11px] md:text-sm font-bold text-gray-700 no-underline whitespace-nowrap">Trang chủ</Link>
          <Link href="/dashboard/about?id=gioi-thieu" className="text-[11px] md:text-sm font-bold text-gray-700 whitespace-nowrap">Giới thiệu</Link>
          <Link href="/news" className="text-[11px] md:text-sm font-bold text-gray-700 no-underline whitespace-nowrap">Tin tức</Link>
        </div>
        
        {/* Đăng xuất: Chỉ hiện icon trên điện thoại để không đẩy mất chữ Trang chủ */}
        <button className="flex items-center justify-center p-1.5 md:px-6 md:py-2.5 bg-red-50 text-red-600 rounded-lg border-none cursor-pointer flex-shrink-0">
          <span className="hidden md:inline mr-2 text-sm font-bold">Đăng xuất</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </nav>
    </header>
  );
}
