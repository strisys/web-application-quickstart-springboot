import React, { useEffect, useRef, useState, type JSX } from "react";
import { PhotoRepository } from "./PhotoRespository";

const photoRepository = new PhotoRepository();

type PhotoRow = {
  key: string;
  name: string;
  url?: string;
};

export default function App() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [photos, setPhotos] = useState<PhotoRow[]>([]);

  // Load existing photos on mount
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        // Expecting PhotoRepository.fetch() to return a list of items.
        // Normalize conservatively to handle varied shapes.
        const list = await photoRepository.fetch();

        if (cancelled) return;

        const normalized: PhotoRow[] = (list ?? []).map((item: any, i: number) => {
          const key =
            item?.key ??
            item?.id ??
            item?.name ??
            // fallback unique key if repo doesn't provide one
            `${item?.filename ?? "photo"}-${i}`;
          const name = item?.name ?? item?.filename ?? String(key);
          const url = item?.url ?? item?.href ?? item?.signedUrl ?? undefined;
          return { key, name, url };
        });

        setPhotos(normalized);
      } catch (err) {
        console.error("Failed to fetch photos:", err);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const onChooseFiles = () => {
    inputRef.current?.click();
  };

  const onFilesChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setSelectedFiles(files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragActive) setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files ?? []);
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (!imageFiles.length) return;

    setSelectedFiles(imageFiles);
  };

  const uploadFile = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const result = await photoRepository.upload(selectedFiles[0]);
      if (result) {
        alert(`File uploaded successfully: ${result}`);
      }

      // Clear selection and input
      setSelectedFiles([]);
      if (inputRef.current) inputRef.current.value = "";

      // Refresh the table by re-fetching
      try {
        const list = await photoRepository.fetch();
        const normalized: PhotoRow[] = (list ?? []).map((item: any, i: number) => {
          const key = 
            item?.key ??
            item?.id ??
            item?.name ??
            `${item?.filename ?? "photo"}-${i}`;
          const name = item?.name ?? item?.filename ?? String(key);
          const url = item?.url ?? item?.href ?? item?.signedUrl ?? undefined;
          return { key, name, url };
        });
        setPhotos(normalized);
      } catch (err) {
        console.error("Failed to refresh photos:", err);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed.");
    }
  };


const getUploadedFileTableBody = (): JSX.Element[] => {
  return photos.map((p) => {
    const key = p.key;
    return (
      <tr key={key}>
        <td className="border border-gray-300 p-2 break-all">{p.name}</td>
        <td className="border border-gray-300 p-2">
          <button
            className="p-2 rounded hover:bg-gray-200 transition"
            onClick={async () => {
              try {
                const result = await photoRepository.downloadPhoto(key);

                if (!result) {
                  alert("Download failed: No data returned.");
                  return;
                }

                const { url } = result;

                const a = document.createElement("a");
                a.href = url;
                a.download = p.name || "photo";
                document.body.appendChild(a);
                a.click();
                a.remove();

              } catch (err) {
                console.error("Download failed:", err);
              }
            }}
            aria-label="Download photo"
            title="Download photo"
          >
            {/* Download icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5m-4.5 4.5V3"
              />
            </svg>
          </button>
        </td>
      </tr>
    );
  });
};

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container p-4 max-w-md">
        <div
          id="drop-area"
          className={[
            "border-2 border-dashed border-gray-400 p-6 text-center bg-white rounded-lg transition-colors cursor-pointer",
            dragActive ? "bg-gray-200" : "hover:bg-gray-200",
          ].join(" ")}
          onClick={onChooseFiles}
          onDragOver={onDragOver}
          onDragEnter={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          role="button"
          aria-label="Drag and drop your image here or click to select"
        >
          Drag and drop your image here or click to select
          {selectedFiles.length > 0 && (
            <div className="mt-3 text-sm text-gray-600">
              {selectedFiles.length === 1
                ? `Selected: ${selectedFiles[0].name}`
                : `${selectedFiles.length} files selected`}
            </div>
          )}
        </div>

        <input
          id="fileupload"
          ref={inputRef}
          type="file"
          name="fileupload"
          accept="image/*"
          className="hidden"
          multiple
          onChange={onFilesChosen}
        />

        <button
          id="upload-button"
          onClick={uploadFile}
          className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedFiles.length === 0}
        >
          Upload
        </button>

        <div
          id="photos-table-container"
          className={"mt-6" + (photos.length ? "" : " hidden")}
        >
          <table
            id="photos-table"
            className="w-full border-collapse bg-white rounded-lg shadow"
          >
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2 text-left">
                  File Name
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody id="photos-table-body">{getUploadedFileTableBody()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
