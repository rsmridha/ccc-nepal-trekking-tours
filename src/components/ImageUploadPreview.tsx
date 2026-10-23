"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  FolderOpen,
  X,
  Eye,
  Trash2,
  Loader2,
  Plus,
} from "lucide-react";

interface ImageUploadPreviewProps {
  label?: string;
  value: string;
  onChange: (newPath: string) => void;
  folder?: string;
}

export default function ImageUploadPreview({
  label = "Cover Image (Application Path)",
  value,
  onChange,
  folder = "custom",
}: ImageUploadPreviewProps) {
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryImages, setLibraryImages] = useState<string[]>([]);
  const [libraryFilter, setLibraryFilter] = useState("");
  const [zoomOpen, setZoomOpen] = useState(false);

  const displaySrc = localPreviewUrl || value || "/images/upload/package/deluxe-everest-base-camp-trek.jpg";

  const loadLibrary = async () => {
    if (libraryImages.length > 0) return;
    try {
      const res = await fetch("/api/upload");
      const data = await res.json();
      if (data.images) {
        setLibraryImages(data.images);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (showLibrary) {
      loadLibrary();
    }
  }, [showLibrary]);

  const processFile = async (file: File | undefined) => {
    if (!file) return;
    // 1. Instant client-side preview during selection/upload
    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);
    setUploading(true);
    setUploadStatus(`Uploading ${file.name}...`);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.path) {
        onChange(data.path);
        setLocalPreviewUrl(null);
        setUploadStatus(`Saved to ${data.path}`);
      } else {
        setUploadStatus("Upload failed");
      }
    } catch {
      setUploadStatus("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const filteredLibrary = libraryImages.filter((img) =>
    img.toLowerCase().includes(libraryFilter.toLowerCase())
  );

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">{label}</label>
        <button
          type="button"
          onClick={() => setShowLibrary(!showLibrary)}
          className="text-[11px] font-extrabold text-[#006ebf] hover:underline inline-flex items-center gap-1"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          {showLibrary ? "Hide App Image Library" : "Browse App Image Library"}
        </button>
      </div>

      {/* Live Preview & Drag/Drop Upload Card */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`p-3 rounded-2xl border-2 transition-all bg-slate-50/70 ${
          dragOver
            ? "border-[#006ebf] bg-sky-50/60"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Thumbnail Preview Box */}
          <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 group">
            <img
              src={displaySrc}
              alt="Selected Preview"
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1">
                <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                <span>Uploading...</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              className="absolute bottom-1.5 right-1.5 p-1.5 rounded-lg bg-slate-900/75 text-white opacity-90 hover:opacity-100 transition-opacity"
              title="Full Preview"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Controls & Application Path Input */}
          <div className="flex-1 w-full space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  setLocalPreviewUrl(null);
                  onChange(e.target.value);
                }}
                placeholder={`/images/upload/${folder}/example.jpg`}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-700 bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="px-3.5 py-2 rounded-xl bg-[#006ebf] hover:bg-[#0b243b] text-white text-xs font-extrabold cursor-pointer inline-flex items-center gap-1.5 transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                Choose / Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => processFile(e.target.files?.[0])}
                />
              </label>

              <button
                type="button"
                onClick={() => setShowLibrary(!showLibrary)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:border-[#006ebf] text-slate-700 text-xs font-bold inline-flex items-center gap-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#006ebf]" />
                Select Existing
              </button>

              {uploadStatus && (
                <span className="text-[11px] font-bold text-emerald-700 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {uploadStatus}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Drag & drop an image or click &ldquo;Choose / Upload Image&rdquo; — live preview updates immediately and saves under <code>/images/upload/{folder}/</code>.
            </p>
          </div>
        </div>

        {/* Visual Application Media Library Drawer */}
        {showLibrary && (
          <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={libraryFilter}
                onChange={(e) => setLibraryFilter(e.target.value)}
                placeholder="Filter local app images (e.g. everest, annapurna, blog, luxury)..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1">
              {filteredLibrary.map((imgPath) => {
                const isSelected = value === imgPath;
                return (
                  <button
                    key={imgPath}
                    type="button"
                    onClick={() => {
                      setLocalPreviewUrl(null);
                      onChange(imgPath);
                      setUploadStatus(`Selected ${imgPath.split("/").pop()}`);
                      setShowLibrary(false);
                    }}
                    className={`group relative h-20 rounded-xl overflow-hidden border-2 text-left transition-all ${
                      isSelected
                        ? "border-[#006ebf] ring-2 ring-[#006ebf]/30"
                        : "border-slate-200 hover:border-[#006ebf]"
                    }`}
                    title={imgPath}
                  >
                    <img
                      src={imgPath}
                      alt={imgPath}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/75 text-[9px] text-white px-1.5 py-0.5 truncate">
                      {imgPath.split("/").pop()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Preview */}
      {zoomOpen && (
        <div
          onClick={() => setZoomOpen(false)}
          className="fixed inset-0 z-[70] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-4 max-w-2xl w-full shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-600 truncate">
                {value}
              </span>
              <button
                type="button"
                onClick={() => setZoomOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden max-h-[70vh] bg-slate-900 flex items-center justify-center">
              <img
                src={displaySrc}
                alt="Full Preview"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MultiImageUploadPreview({
  label = "Package Image Gallery (Multi-Image Upload & Preview)",
  values = [],
  onChange,
  folder = "package/slider",
}: {
  label?: string;
  values: string[];
  onChange: (newValues: string[]) => void;
  folder?: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleMultiFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    const addedPaths: string[] = [];

    for (const file of Array.from(fileList)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.path) {
          addedPaths.push(data.path);
        }
      } catch {
        // ignore
      }
    }
    if (addedPaths.length > 0) {
      onChange([...values, ...addedPaths]);
    }
    setUploading(false);
  };

  const removeAt = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} ({values.length} photos)
        </label>
        <label className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 hover:bg-sky-100 text-[#006ebf] text-xs font-extrabold cursor-pointer inline-flex items-center gap-1">
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" /> Upload Gallery Photos
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleMultiFiles(e.target.files)}
          />
        </label>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl border border-slate-200 bg-slate-50/70">
        {values.map((img, idx) => (
          <div
            key={`${img}-${idx}`}
            className="relative h-20 rounded-xl overflow-hidden border border-slate-300 bg-slate-200 group"
          >
            <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute top-1 right-1 p-1 rounded-lg bg-rose-600 text-white opacity-90 hover:opacity-100"
              title="Remove Photo"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        <label className="h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#006ebf] flex flex-col items-center justify-center text-slate-400 hover:text-[#006ebf] cursor-pointer text-[11px] font-bold">
          <Upload className="w-4 h-4 mb-1" />
          <span>Add Photo</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleMultiFiles(e.target.files)}
          />
        </label>
      </div>
    </div>
  );
}
