"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IconX } from "@/components/icons";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB — matches the bucket limit

/**
 * Product image picker for the admin form. Lets the owner drag-and-drop or
 * browse for a file (uploaded to Supabase Storage on submit via the server
 * action), with a live preview. Falls back to a pasteable URL. The selected
 * file posts as `image_file`; the typed URL posts as `image_url`.
 */
export function ImageUploadField({ defaultUrl }: { defaultUrl?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(defaultUrl ?? null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  // Revoke any object URL we created when it changes or the field unmounts.
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  function selectFile(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be 5MB or smaller.");
      return;
    }
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    setPreview(url);
    setFileName(file.name);
  }

  function clear() {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setObjectUrl(null);
    setPreview(null);
    setFileName(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      {/* The real file input — visually hidden, driven by the drop zone. */}
      <input
        ref={inputRef}
        id="image_file"
        name="image_file"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="sr-only"
        onChange={(e) => selectFile(e.target.files?.[0])}
      />

      {preview ? (
        <div className="flex items-center gap-4 rounded-2xl border border-clay bg-cream p-3">
          <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-sand/40">
            <Image
              src={preview}
              alt="Product preview"
              fill
              sizes="96px"
              className="object-contain p-1"
              unoptimized={preview.startsWith("blob:")}
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-cocoa">
              {fileName ?? "Current image"}
            </p>
            <div className="mt-1.5 flex gap-3 text-sm">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="font-medium text-spice hover:text-spice-dark"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-1 text-cocoa-soft transition-colors hover:text-spice"
              >
                <IconX className="h-4 w-4" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            selectFile(e.dataTransfer.files?.[0]);
          }}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragging
              ? "border-spice bg-spice/5"
              : "border-clay bg-cream hover:border-spice/60"
          }`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand/50 text-spice">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 16V4m0 0L8 8m4-4 4 4" />
              <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
          </span>
          <span className="text-sm font-medium text-cocoa">
            Drag &amp; drop an image, or{" "}
            <span className="text-spice">browse</span>
          </span>
          <span className="text-xs text-cocoa-soft">PNG, JPG or WebP — up to 5MB</span>
        </button>
      )}

      {error && (
        <p role="alert" className="mt-2 text-sm text-spice">
          {error}
        </p>
      )}

      <div className="mt-2.5">
        <button
          type="button"
          onClick={() => setShowUrl((v) => !v)}
          className="text-xs font-medium text-cocoa-soft hover:text-spice"
        >
          {showUrl ? "Hide URL option" : "Or paste an image URL"}
        </button>
        {showUrl && (
          <input
            name="image_url"
            defaultValue={defaultUrl}
            placeholder="/tempered-sprats.jpg or https://…"
            className="mt-2 w-full rounded-xl border border-clay bg-cream px-4 py-2.5 text-cocoa focus-visible:outline-spice"
          />
        )}
        {/* Keep the existing URL in the payload when the URL box is collapsed
            and no new file is chosen, so editing preserves the current image. */}
        {!showUrl && defaultUrl && (
          <input type="hidden" name="image_url" defaultValue={defaultUrl} />
        )}
      </div>
    </div>
  );
}
