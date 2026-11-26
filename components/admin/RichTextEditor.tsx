"use client";

import Image from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";
import { cx } from "@/components/site/ui";
import type { AdminDict } from "@/lib/admin-i18n";
import { mediaUrl } from "@/lib/storage";
import { uploadFile } from "./FileUpload";

/**
 * Visual editor for article / report bodies. Produces HTML that is stored as
 * is and sanitized again when rendered on the public site.
 */
export function RichTextEditor({
  name,
  defaultValue,
  label,
  dict,
  uploadFolder,
}: {
  name: string;
  defaultValue?: string | null;
  label: string;
  dict: AdminDict;
  uploadFolder: string;
}) {
  const [html, setHtml] = useState(defaultValue ?? "");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      LinkExt.configure({ openOnClick: false, autolink: true }),
      Image,
    ],
    content: defaultValue ?? "",
    editorProps: {
      attributes: {
        class: "prose-cw min-h-[280px] rounded-b-xl bg-white px-5 py-4 focus:outline-none",
        "aria-label": label,
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.isEmpty ? "" : editor.getHTML()),
  });

  return (
    <div>
      <p className="font-semibold text-navy">{label}</p>
      <input type="hidden" name={name} value={html} />
      <div className="mt-1.5 rounded-xl ring-1 ring-line focus-within:ring-2 focus-within:ring-blue">
        {editor && <Toolbar editor={editor} dict={dict} uploadFolder={uploadFolder} />}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Toolbar({ editor, dict, uploadFolder }: { editor: Editor; dict: AdminDict; uploadFolder: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const es = dict.common.spanish === "Español";

  const b = (active: boolean) =>
    cx("rounded-lg px-2.5 py-1.5 text-sm font-semibold", active ? "bg-navy text-white" : "text-navy hover:bg-sky-50");

  const items: Array<{ label: string; title: string; run: () => void; active?: boolean }> = [
    { label: "H2", title: es ? "Título" : "Heading", run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { label: "H3", title: es ? "Subtítulo" : "Subheading", run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
    { label: "B", title: es ? "Negrita" : "Bold", run: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { label: "I", title: es ? "Cursiva" : "Italic", run: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { label: "• —", title: es ? "Lista" : "Bullet list", run: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { label: "1.", title: es ? "Lista numerada" : "Numbered list", run: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
    { label: "❝", title: es ? "Cita" : "Quote", run: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
    {
      label: "🔗",
      title: es ? "Enlace" : "Link",
      active: editor.isActive("link"),
      run: () => {
        const prev = editor.getAttributes("link").href as string | undefined;
        const url = window.prompt(es ? "Dirección del enlace (https://…)" : "Link address (https://…)", prev ?? "https://");
        if (url === null) return;
        if (!url || url === "https://") editor.chain().focus().unsetLink().run();
        else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      },
    },
    { label: "🖼", title: es ? "Imagen" : "Image", run: () => fileRef.current?.click() },
    { label: "↶", title: es ? "Deshacer" : "Undo", run: () => editor.chain().focus().undo().run() },
    { label: "↷", title: es ? "Rehacer" : "Redo", run: () => editor.chain().focus().redo().run() },
  ];

  return (
    <div className="flex flex-wrap gap-1 rounded-t-xl border-b border-line bg-paper p-2" role="toolbar">
      {items.map((it) => (
        <button key={it.title} type="button" title={it.title} aria-label={it.title} aria-pressed={it.active} onClick={it.run} className={b(Boolean(it.active))}>
          {it.label}
        </button>
      ))}
      {uploading && <span className="self-center px-2 text-sm text-muted">{dict.media.uploading}</span>}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        tabIndex={-1}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setUploading(true);
          try {
            const path = await uploadFile(file, "media", uploadFolder);
            const src = mediaUrl(path);
            const alt = window.prompt(dict.media.alt, "") ?? "";
            if (src) editor.chain().focus().setImage({ src, alt }).run();
          } catch (err) {
            window.alert(`${dict.media.failed}: ${err instanceof Error ? err.message : String(err)}`);
          } finally {
            setUploading(false);
          }
        }}
      />
    </div>
  );
}
