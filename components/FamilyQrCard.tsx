"use client";

import { Check, Copy, Download, ExternalLink, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";

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
    <section className="rounded-2xl border border-amber-200 bg-[#fffaf0] p-4 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm">
            <QrCode className="size-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
              Mã QR truy cập gia phả
            </p>
            <h2 className="mt-1 text-xl font-black text-stone-950">
              {familyName}
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-stone-600">
              In mã này đặt tại nhà thờ tổ hoặc đưa vào tài liệu giấy. Con cháu
              quét bằng điện thoại để mở trang hồ sơ dòng họ, xem thông tin chung
              rồi bấm vào cây gia phả “{treeName}” khi có quyền truy cập.
            </p>
            <p className="mt-3 break-all rounded-xl bg-white px-3 py-2 text-xs font-bold text-stone-500">
              {url}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col">
          <div
            ref={qrRef}
            className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm"
          >
            <QRCodeSVG
              value={url}
              size={148}
              level="H"
              marginSize={2}
              fgColor="#1c1917"
              bgColor="#ffffff"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyUrl}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-stone-700 shadow-sm transition hover:bg-amber-50"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Đã copy" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={downloadSvg}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-stone-700 shadow-sm transition hover:bg-amber-50"
            >
              <Download className="size-4" />
              Tải SVG
            </button>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#800000] px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#650000]"
            >
              <ExternalLink className="size-4" />
              Mở thử
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
