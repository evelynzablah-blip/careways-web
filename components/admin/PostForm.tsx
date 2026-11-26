"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { savePost } from "@/app/admin/(panel)/posts/actions";
import type { AdminDict, AdminLang } from "@/lib/admin-i18n";
import type { Post } from "@/lib/types";
import { Card, CountryCheckboxes, Field, inputClass, LocaleTabs, SaveBar, slugify, type SaveState } from "./fields";
import { FileUpload } from "./FileUpload";
import { RichTextEditor } from "./RichTextEditor";

export function PostForm({
  post,
  dict,
  lang,
  countries,
  categories,
}: {
  post: Post | null;
  dict: AdminDict;
  lang: AdminLang;
  countries: Array<{ code: string; label: string }>;
  categories: string[];
}) {
  const router = useRouter();
  const [state, action] = useActionState<SaveState, FormData>(savePost, {});
  const [title, setTitle] = useState(post?.title_en ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [slug, setSlug] = useState(post?.slug ?? "");
  const f = dict.posts.fields;
  const id = state.id ?? post?.id ?? "";
  const status = state.status ?? post?.status ?? null;

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card>
          <LocaleTabs
            dict={dict}
            en={
              <>
                <Field label={f.title} required>
                  <input
                    name="title_en"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!slugTouched) setSlug(slugify(e.target.value));
                    }}
                    className={`${inputClass} text-lg font-semibold`}
                  />
                </Field>
                <Field label={f.excerpt} hint={f.excerptHint}>
                  <textarea name="excerpt_en" rows={2} defaultValue={post?.excerpt_en ?? ""} className={inputClass} />
                </Field>
                <RichTextEditor name="body_en" label={f.body} defaultValue={post?.body_en} dict={dict} uploadFolder="posts" />
                <Field label={f.coverAlt}>
                  <input name="cover_alt_en" defaultValue={post?.cover_alt_en ?? ""} className={inputClass} />
                </Field>
              </>
            }
            es={
              <>
                <Field label={f.title}>
                  <input name="title_es" defaultValue={post?.title_es ?? ""} className={`${inputClass} text-lg font-semibold`} />
                </Field>
                <Field label={f.excerpt} hint={f.excerptHint}>
                  <textarea name="excerpt_es" rows={2} defaultValue={post?.excerpt_es ?? ""} className={inputClass} />
                </Field>
                <RichTextEditor name="body_es" label={f.body} defaultValue={post?.body_es} dict={dict} uploadFolder="posts" />
                <Field label={f.coverAlt}>
                  <input name="cover_alt_es" defaultValue={post?.cover_alt_es ?? ""} className={inputClass} />
                </Field>
              </>
            }
          />
        </Card>

        <div className="space-y-6">
          <Card>
            <FileUpload name="cover_image_path" bucket="media" folder="posts" defaultPath={post?.cover_image_path} label={f.cover} dict={dict} />
            <Field label={f.category} hint={f.categoryHint}>
              <input name="category" list="post-categories" defaultValue={post?.category ?? ""} className={inputClass} />
              <datalist id="post-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field label={f.author}>
              <input name="author_name" defaultValue={post?.author_name ?? ""} className={inputClass} />
            </Field>
            <CountryCheckboxes options={countries} selected={post?.country_codes ?? []} dict={dict} />
            <Field label={dict.common.slug} hint={dict.common.slugHint}>
              <input
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                className={`${inputClass} font-mono text-sm`}
              />
            </Field>
          </Card>
        </div>
      </div>

      <SaveBar
        dict={dict}
        status={status}
        state={state}
        previewPath={(pid) => `/${lang}/preview/posts/${pid}`}
        onSaved={(pid) => {
          if (!post) router.replace(`/admin/posts/${pid}`);
        }}
      />
    </form>
  );
}
