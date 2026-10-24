import { ChevronsDownUp, ChevronsUpDown, Crosshair, ZoomIn, ZoomOut } from "lucide-react";
import type { ReactNode } from "react";
import BaseToolbar, { BaseToolbarProps } from "./BaseToolbar";

interface TreeToolbarProps extends BaseToolbarProps {
  scale: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  handleCenter: () => void;
  handleExpandAll?: () => void;
  handleCollapseAll?: () => void;
  extraActions?: ReactNode;
}

export default function TreeToolbar({
  scale,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  handleCenter,
  handleExpandAll,
  handleCollapseAll,
  extraActions,
  ...baseProps
}: TreeToolbarProps) {
  return (
    <BaseToolbar {...baseProps}>
      {/* Zoom Controls */}
      <div className="flex items-center bg-white/80 backdrop-blur-md shadow-sm border border-stone-200/60 rounded-full overflow-hidden transition-opacity h-10">
        <button
          onClick={handleZoomOut}
          className="px-3 h-full hover:bg-stone-100/50 text-stone-600 transition-colors disabled:opacity-50"
          title="Thu nhỏ"
          disabled={scale <= 0.2}
        >
          <ZoomOut className="size-4" />
        </button>
        <button
          onClick={handleResetZoom}
          className="px-2 h-full hover:bg-stone-100/50 text-stone-600 transition-colors text-xs font-medium min-w-[50px] text-center border-x border-stone-200/50"
          title="Đặt lại"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={handleZoomIn}
          className="px-3 h-full hover:bg-stone-100/50 text-stone-600 transition-colors disabled:opacity-50"
          title="Phóng to"
          disabled={scale >= 2.5}
        >
          <ZoomIn className="size-4" />
        </button>
      </div>

      {/* Expand/Collapse Controls */}
      {(handleExpandAll || handleCollapseAll) && (
        <div className="flex items-center bg-white/80 backdrop-blur-md shadow-sm border border-stone-200/60 rounded-full overflow-hidden transition-opacity h-10">
          {handleCollapseAll && (
            <button
              onClick={handleCollapseAll}
              className="px-3 md:px-4 h-full flex items-center gap-1.5 hover:bg-stone-100/50 text-stone-600 transition-colors font-medium"
              title="Thu gọn các nhánh đời sau"
            >
              <ChevronsDownUp className="size-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">Thu gọn</span>
            </button>
          )}
          {handleExpandAll && (
            <button
              onClick={handleExpandAll}
              className="px-3 md:px-4 h-full flex items-center gap-1.5 hover:bg-stone-100/50 text-stone-600 transition-colors font-medium border-l border-stone-200/50"
              title="Mở rộng toàn bộ cây"
            >
              <ChevronsUpDown className="size-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">Mở rộng tất cả</span>
            </button>
          )}
        </div>
      )}

      {/* Center Button */}
      <button
        onClick={handleCenter}
        className="flex items-center justify-center size-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-stone-200/60 text-stone-600 hover:bg-white hover:text-stone-900 hover:shadow-md transition-all"
        title="Căn giữa"
      >
        <Crosshair className="size-4" />
      </button>

      {extraActions}
    </BaseToolbar>
  );
}
