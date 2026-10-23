"use client";

import {
  uploadBlogInlineImage,
  uploadFamilyBlogInlineImage,
} from "@/app/actions/blog";
import {
  countBlogImages,
  getBlogImageLimitError,
  type BlogImageLimit,
} from "@/utils/blogImageRules";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Palette,
  Quote,
  Redo2,
  Underline,
  Undo2,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

function toEditorHtml(content: string) {
  const value = content.trim();
  if (!value) return "<p><br></p>";
  if (/<[a-z][\s\S]*>/i.test(value)) return normalizeCaptions(value);

  return value
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.trim().replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function normalizeCaptions(value: string) {
  return value
    .replace(
      /<figcaption(?:\s+[^>]*)?>\s*(?:Chú thích ảnh|Chú thích dưới ảnh|&nbsp;|<br\s*\/?>|\s)*\s*<\/figcaption>/gi,
      "",
    )
    .replace(/\sdata-placeholder="[^"]*"/gi, "");
}

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");
    if (host === "youtu.be") {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }
    if (host.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (parsed.pathname.startsWith("/embed/")) return parsed.href;
    }
  } catch {
    return "";
  }

  return "";
}

interface RichBlogEditorProps {
  name: string;
  initialContent: string;
  scope?: "system" | "family";
  familyId?: string;
  imageLimit?: BlogImageLimit;
  coverImageCount?: number;
  allowImages?: boolean;
}

export default function RichBlogEditor({
  name,
  initialContent,
  scope = "system",
  familyId,
  imageLimit,
  coverImageCount = 0,
  allowImages = true,
}: RichBlogEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const initializedRef = useRef(false);
  const [initialHtml] = useState(() => toEditorHtml(initialContent));
  const [uploading, startUploadTransition] = useTransition();
  const [editorError, setEditorError] = useState("");

  useEffect(() => {
    if (initializedRef.current || !editorRef.current) return;

    editorRef.current.innerHTML = initialHtml;
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = initialHtml;
    }
    initializedRef.current = true;
  }, [initialHtml]);

  const syncHtml = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = editorRef.current?.innerHTML || "";
    }
  };

  const saveSelection = () => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  };

  const restoreSelection = () => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    const range = savedRangeRef.current;
    if (!editor || !selection || !range) {
      if (editor && selection) {
        const fallbackRange = document.createRange();
        fallbackRange.selectNodeContents(editor);
        fallbackRange.collapse(false);
        editor.focus();
        selection.removeAllRanges();
        selection.addRange(fallbackRange);
        savedRangeRef.current = fallbackRange.cloneRange();
        return;
      }
      editor?.focus();
      return;
    }

    editor.focus();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const runCommand = (command: string, value?: string) => {
    restoreSelection();
    document.execCommand(command, false, value);
    saveSelection();
    syncHtml();
  };

  const insertHtml = (
    value: string,
    options: { replaceSelection?: boolean } = {},
  ) => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection) return;

    restoreSelection();
    let range =
      selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;

    if (!range || !editor.contains(range.commonAncestorContainer)) {
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
    }

    if (options.replaceSelection === false) {
      range.collapse(false);
    }

    const template = document.createElement("template");
    template.innerHTML = value.trim();
    const nodes = Array.from(template.content.childNodes);
    const fragment = document.createDocumentFragment();
    nodes.forEach((node) => fragment.appendChild(node));

    if (options.replaceSelection !== false) {
      range.deleteContents();
    }
    range.insertNode(fragment);

    const lastNode = nodes.at(-1);
    if (lastNode) {
      const nextRange = document.createRange();
      nextRange.setStartAfter(lastNode);
      nextRange.collapse(true);
      editor.focus();
      selection.removeAllRanges();
      selection.addRange(nextRange);
      savedRangeRef.current = nextRange.cloneRange();
    }

    editor.normalize();
    syncHtml();
  };

  const insertLink = () => {
    saveSelection();
    const selectedText = window.getSelection()?.toString();
    const url = window.prompt("Nhập đường dẫn liên kết:");
    if (!url) return;

    const label = selectedText || url;
    insertHtml(
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`,
    );
  };

  const insertVideo = () => {
    saveSelection();
    const url = window.prompt("Dán link YouTube:");
    if (!url) return;

    const embedUrl = getYoutubeEmbedUrl(url);
    if (!embedUrl) {
      setEditorError("Hiện chỉ hỗ trợ link YouTube hợp lệ.");
      return;
    }

    insertHtml(
      `<figure class="media-embed"><iframe src="${embedUrl}" title="Video" allowfullscreen></iframe></figure><p><br></p>`,
    );
  };

  const uploadInlineImage = (file: File) => {
    const currentContent = editorRef.current?.innerHTML || "";
    const nextImageCount =
      Math.max(0, coverImageCount) + countBlogImages(currentContent) + 1;

    if (typeof imageLimit === "number" && nextImageCount > imageLimit) {
      setEditorError(getBlogImageLimitError(imageLimit));
      return;
    }

    const formData = new FormData();
    formData.set("image", file);
    formData.set("current_content", currentContent);
    formData.set("cover_image_count", String(Math.max(0, coverImageCount)));
    if (scope === "family") {
      if (!familyId) {
        setEditorError("Thiếu thông tin dòng họ để upload ảnh.");
        return;
      }
      formData.set("family_id", familyId);
    }

    setEditorError("");
    startUploadTransition(async () => {
      const result =
        scope === "family"
          ? await uploadFamilyBlogInlineImage(formData)
          : await uploadBlogInlineImage(formData);
      if ("error" in result && result.error) {
        setEditorError(result.error);
        return;
      }

      if ("url" in result && result.url) {
        const imageUrl = escapeHtmlAttribute(result.url);
        const imageAlt = escapeHtmlAttribute(file.name);
        insertHtml(
          `<figure class="blog-inline-image"><img src="${imageUrl}" alt="${imageAlt}" /><figcaption></figcaption></figure><p><br></p>`,
          { replaceSelection: false },
        );
      }
    });
  };

  const toolButtonClass =
    "inline-flex size-9 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 hover:text-[#800000] focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-55";
  const groupClass =
    "flex min-h-[76px] flex-1 flex-wrap items-center gap-2 border-b border-r border-stone-300/80 px-3 py-2 last:border-r-0 md:flex-none";
  const selectClass =
    "h-9 rounded-lg border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-800 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200";

  return (
    <div className="overflow-hidden rounded-[24px] border border-stone-300 bg-[#e7e2da] shadow-[0_22px_70px_rgba(41,37,36,0.12)]">
      <input
        ref={hiddenInputRef}
        type="hidden"
        name={name}
        defaultValue={initialHtml}
      />
      {allowImages && (
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) uploadInlineImage(file);
            event.currentTarget.value = "";
          }}
        />
      )}

      <div className="border-b border-stone-300 bg-[#f6f2ea]">
        <div className="flex flex-col gap-2 border-b border-stone-300 px-4 py-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#800000]">
              Trình soạn bài
            </p>
            <p className="mt-1 text-sm font-semibold text-stone-600">
              Đặt con trỏ ở đâu thì ảnh, link hoặc video sẽ được chèn đúng tại vị trí đó.
            </p>
          </div>
          {uploading && (
            <span className="rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-black text-amber-700">
              Đang tải ảnh...
            </span>
          )}
        </div>
        <div
          className="flex flex-wrap border-b border-stone-300 bg-[#ebe6dd]"
          onMouseDown={(event) => {
            if ((event.target as HTMLElement).closest("button")) {
              event.preventDefault();
            }
          }}
        >
          <div className={groupClass}>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                {allowImages && (
                <button
                  type="button"
                  className={toolButtonClass}
                  title="Hoàn tác"
                  onClick={() => runCommand("undo")}
                >
                  <Undo2 className="size-4" />
                </button>
                )}
                <button
                  type="button"
                  className={toolButtonClass}
                  title="Làm lại"
                  onClick={() => runCommand("redo")}
                >
                  <Redo2 className="size-4" />
                </button>
              </div>
              <span className="text-center text-[10px] font-bold text-stone-500">
                Bảng tạm
              </span>
            </div>
          </div>

          <div className={groupClass}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <select
                  className={selectClass}
                  defaultValue="Arial"
                  aria-label="Phông chữ"
                  onChange={(event) => runCommand("fontName", event.target.value)}
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                </select>
                <select
                  className="h-9 w-20 rounded-lg border border-stone-300 bg-white px-2 text-sm font-semibold text-stone-800 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-200"
                  defaultValue="3"
                  aria-label="Cỡ chữ"
                  onChange={(event) => runCommand("fontSize", event.target.value)}
                >
                  <option value="2">11</option>
                  <option value="3">12</option>
                  <option value="4">14</option>
                  <option value="5">18</option>
                  <option value="6">24</option>
                </select>
                <button
                  type="button"
                  className={toolButtonClass}
                  title="In đậm"
                  onClick={() => runCommand("bold")}
                >
                  <Bold className="size-4" />
                </button>
                <button
                  type="button"
                  className={toolButtonClass}
                  title="In nghiêng"
                  onClick={() => runCommand("italic")}
                >
                  <Italic className="size-4" />
                </button>
                <button
                  type="button"
                  className={toolButtonClass}
                  title="Gạch chân"
                  onClick={() => runCommand("underline")}
                >
                  <Underline className="size-4" />
                </button>
                <label className={toolButtonClass} title="Màu chữ">
                  <Palette className="size-4" />
                  <input
                    type="color"
                    className="sr-only"
                    onChange={(event) => runCommand("foreColor", event.target.value)}
                  />
                </label>
              </div>
              <span className="text-center text-[10px] font-bold text-stone-500">
                Phông chữ
              </span>
            </div>
          </div>

          <div className={groupClass}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={toolButtonClass}
                  title="Danh sách"
                  onClick={() => runCommand("insertUnorderedList")}
                >
                  <List className="size-4" />
                </button>
                <button
                  type="button"
                  className={toolButtonClass}
                  title="Danh sách số"
                  onClick={() => runCommand("insertOrderedList")}
                >
                  <ListOrdered className="size-4" />
                </button>
                <button
                  type="button"
                  className={toolButtonClass}
                  title="Canh trái"
                  onClick={() => runCommand("justifyLeft")}
                >
                  <AlignLeft className="size-4" />
                </button>
                <button
                  type="button"
                  className={toolButtonClass}
                  title="Canh giữa"
                  onClick={() => runCommand("justifyCenter")}
                >
                  <AlignCenter className="size-4" />
                </button>
                <button
                  type="button"
                  className={toolButtonClass}
                  title="Canh phải"
                  onClick={() => runCommand("justifyRight")}
                >
                  <AlignRight className="size-4" />
                </button>
                <button
                  type="button"
                  className={toolButtonClass}
                  title="Trích dẫn"
                  onClick={() => runCommand("formatBlock", "blockquote")}
                >
                  <Quote className="size-4" />
                </button>
              </div>
              <span className="text-center text-[10px] font-bold text-stone-500">
                Đoạn văn
              </span>
            </div>
          </div>

          <div className={groupClass}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`${toolButtonClass} w-auto px-3 text-sm font-black`}
                  title="Đoạn văn thường"
                  onClick={() => runCommand("formatBlock", "p")}
                >
                  Bình thường
                </button>
                <button
                  type="button"
                  className={`${toolButtonClass} w-auto px-3 text-sm font-black text-[#800000]`}
                  title="Đầu đề 1"
                  onClick={() => runCommand("formatBlock", "h2")}
                >
                  <Heading1 className="size-4" />
                  Đầu đề 1
                </button>
                <button
                  type="button"
                  className={`${toolButtonClass} w-auto px-3 text-sm font-black`}
                  title="Đầu đề 2"
                  onClick={() => runCommand("formatBlock", "h3")}
                >
                  <Heading2 className="size-4" />
                  Đầu đề 2
                </button>
              </div>
              <span className="text-center text-[10px] font-bold text-stone-500">
                Kiểu
              </span>
            </div>
          </div>

          {scope === "system" && (
            <div className={groupClass}>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  {allowImages && (
                    <button
                      type="button"
                      className={`${toolButtonClass} w-auto px-3 text-sm font-black text-emerald-700`}
                      title="Chèn ảnh tại vị trí con trỏ"
                      onMouseDown={saveSelection}
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <ImagePlus className="size-4" />
                      Chèn ảnh
                    </button>
                  )}
                  <button
                    type="button"
                    className={toolButtonClass}
                    title="Chèn link"
                    onClick={insertLink}
                  >
                    <Link2 className="size-4" />
                  </button>
                  <button
                    type="button"
                    className={toolButtonClass}
                    title="Chèn video YouTube"
                    onClick={insertVideo}
                  >
                    <Video className="size-4" />
                  </button>
                </div>
                <span className="text-center text-[10px] font-bold text-stone-500">
                  Chèn nội dung
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {editorError && (
        <div className="border-b border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
          {editorError}
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncHtml}
        onBlur={() => {
          saveSelection();
          syncHtml();
        }}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        data-placeholder="Bắt đầu viết nội dung bài tại đây..."
        className="rich-editor mx-auto my-8 min-h-[760px] w-[min(100%,980px)] bg-white px-8 py-10 text-stone-800 outline-none shadow-[0_12px_40px_rgba(41,37,36,0.16)] sm:px-12 lg:px-16"
      />
    </div>
  );
}
