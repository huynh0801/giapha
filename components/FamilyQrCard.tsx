"use client";

import { Check, Copy, Download, ExternalLink, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { HeritageFrame, HeritageBadge } from "./dashboard/HeritageUI";

interface FamilyQrCardProps {
  familyName: string;
  treeName: string;
  url: string;
}

export default function FamilyQrCard({
  familyName,
  treeName,
  url,
}: FamilyQrCardProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const downloadSvg = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const source = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `ma-qr-${familyName.toLowerCase().replace(/\s+/g, "-")}.svg`;
    link.click();
    URL.revokeObjectURL(objectUrl);
  };

  return (
    <HeritageFrame cornerColor="#caa455">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[#deb887] bg-gradient-to-br from-[#f5e7c7] to-[#deb887] text-[#8c1d1d] shadow-xs">
            <QrCode className="size-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HeritageBadge variant="amber">
                Ấn Tín Điện Tử
              </HeritageBadge>
              <span className="text-xs font-black uppercase tracking-wider text-[#8c1d1d]">
                Mã QR Gia Tộc
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#183b28]">
              {familyName}
            </h2>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#5c4a3e]">
              In mã ấn tín này đặt tại nhà thờ tổ hoặc tài liệu lưu hành nội bộ. Con cháu
              quét bằng điện thoại để mở nhanh hồ sơ dòng họ và cây gia phả “{treeName}”.
            </p>
            <p className="mt-3 break-all rounded-xl border border-[#deb887]/60 bg-[#fffdf7] px-3.5 py-2 text-xs font-bold text-[#7a6455]">
              {url}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end shrink-0">
          <div
            ref={qrRef}
            className="rounded-2xl border-2 border-[#deb887] bg-white p-3 shadow-xs"
          >
            <QRCodeSVG
              value={url}
              size={136}
              level="H"
              marginSize={2}
              fgColor="#183b28"
              bgColor="#ffffff"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyUrl}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#deb887] bg-[#fffdf7] px-3 py-2 text-xs font-bold text-[#183b28] shadow-xs transition hover:bg-[#f5e7c7]"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              <span>{copied ? "Đã copy" : "Copy link"}</span>
            </button>
            <button
              type="button"
              onClick={downloadSvg}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#deb887] bg-[#fffdf7] px-3 py-2 text-xs font-bold text-[#183b28] shadow-xs transition hover:bg-[#f5e7c7]"
            >
              <Download className="size-3.5" />
              <span>Tải SVG</span>
            </button>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#8c1d1d] to-[#6e1616] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:from-[#6e1616] hover:to-[#500e0e]"
            >
              <ExternalLink className="size-3.5" />
              <span>Mở thử</span>
            </a>
          </div>
        </div>
      </div>
    </HeritageFrame>
  );
}
