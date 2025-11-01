
type Brand<K, T> = K & { __brand: T };

export interface Photo {
    uuid: string;
    fileName: string;
    contentType: string;
}

export interface DownloadResult {
    blob: Blob;
    url: string;
    filename: string;
}

export interface App {
    baseUrl: string;
    getUrl: (path: string) => string;
    upload: (file: File | null | undefined) => Promise<string | undefined>;
    fetchPhotos: () => Promise<Photo[]>;
    downloadPhoto: (id: string) => Promise<DownloadResult | undefined>;
}

export interface AppElements {
    dropArea: HTMLElement;
    fileInput: HTMLInputElement;
    uploadButton: HTMLButtonElement;
    photosTableBody: HTMLTableSectionElement;
    photosTableContainer: HTMLElement;
}

declare global {
    interface Window {
        app: App;
        appElements: AppElements;
        downloadPhoto: (id: string) => Promise<void>;
        uploadFile: () => Promise<void>;
    }
}

// ---- Utilities ----
function getEl<T extends HTMLElement>(id: string): T {
    const el = document.getElementById(id);
    if (!el) {
        throw new Error(`UI element not found: ${id}`);
    }
    return el as T;
}

function ensureSingleFile(fileList: FileList | null): File | null {
    if (!fileList || fileList.length === 0) {
        return null;
    }
    return fileList.item(0);
}

function makePhotoDownloadFilenameFromContentDisposition(header: string | null, fallback: string): string {
    if (!header) {
        return fallback;
    }

    const match = header.match(/filename\*?=(?:UTF-8''|")?([^";]+)"?/i);
    if (match?.[1]) {
        try {
            return decodeURIComponent(match[1]);
        } catch {
            return match[1];
        }
    }
    return fallback;
}

// ---- App Impl ----
(() => {
    const normalizeBase = (base: string) => base.replace(/\/+$/, "");
    const join = (base: string, path: string) => `${normalizeBase(base)}/api/photos/${path}`;

    window.app = {
        baseUrl: "http://localhost:8080",

        getUrl(path: string): string {
            return join(window.app.baseUrl, path);
        },

        async upload(file: File | null | undefined): Promise<string | undefined> {
            const maxSizeInBytes = 5 * 1024 * 1024;

            if (!file) {
                alert("Please select or drop a file to upload.");
                return;
            }

            if (!file.type.startsWith("image/")) {
                alert("Please select or drop an image file.");
                return;
            }

            if (file.size > maxSizeInBytes) {
                alert("File is too large. Maximum size allowed is 5MB.");
                return;
            }

            const formData = new FormData();
            formData.append("data", file);

            try {
                const response = await fetch(window.app.getUrl("upload"), {
                    method: "POST",
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
                }

                return await response.text();
            } catch (error) {
                const err = error as Error;
                console.error("Error uploading file:", err);
                alert(`Error uploading file: ${err.message}`);
            }
        },

        async fetchPhotos(): Promise<Photo[]> {
            try {
                const response = await fetch(window.app.getUrl(""), { method: "GET" });

                if (!response.ok) {
                    throw new Error(`Failed to fetch photos: ${response.status} ${response.statusText}`);
                }

                const json = await response.json();
                if (!Array.isArray(json)) {
                    return [];
                }

                const photos: Photo[] = json.filter(
                    (p: any): p is Photo =>
                        p && typeof p.uuid === "string" &&
                        typeof p.fileName === "string" &&
                        typeof p.contentType === "string"
                );

                return photos;
            } catch (error) {
                const err = error as Error;
                console.error("Error fetching photos:", err);
                alert(`Error fetching photos: ${err.message}`);
                return [];
            }
        },

        async downloadPhoto(id: string): Promise<DownloadResult | undefined> {
            try {
                const response = await fetch(window.app.getUrl(`download/${encodeURIComponent(id)}`), {
                    method: "GET"
                });

                if (!response.ok) {
                    throw new Error(`Failed to download photo: ${response.status} ${response.statusText}`);
                }

                const filename = makePhotoDownloadFilenameFromContentDisposition(
                    response.headers.get("content-disposition"),
                    "downloaded-photo"
                );

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                return { blob, url, filename };
            } catch (error) {
                const err = error as Error;
                console.error("Error downloading photo:", err);
                alert(`Error downloading photo: ${err.message}`);
            }
        }
    };
})();

// ---- UI Actions ----
export async function uploadFile(): Promise<void> {
    const file = ensureSingleFile(window.appElements.fileInput.files);
    await window.app.upload(file);

    window.appElements.fileInput.value = "";
    window.appElements.dropArea.textContent = "Drag and drop your image here or click to select";
    window.appElements.uploadButton.disabled = true;
    window.appElements.uploadButton.classList.add("opacity-50", "cursor-not-allowed");

    const photos = await window.app.fetchPhotos();
    renderPhotos(photos);
}

export function renderPhotos(photos: ReadonlyArray<Photo>): void {
    const tbody = window.appElements.photosTableBody;
    const container = window.appElements.photosTableContainer;
    tbody.innerHTML = "";

    if (photos.length === 0) {
        container.classList.add("hidden");
        return;
    }

    for (const photo of photos) {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td class="border border-gray-300 p-2">${photo.fileName}</td>
      <td class="border border-gray-300 p-2 text-center">
        <a href="#" onclick="downloadPhoto('${photo.uuid}'); return false;" class="text-blue-500 hover:text-blue-700">
          <svg class="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4">
            </path>
          </svg>
        </a>
      </td>
    `;
        tbody.appendChild(row);
    }

    container.classList.remove("hidden");
}

export async function downloadPhoto(id: string): Promise<void> {
    try {
        const result = await window.app.downloadPhoto(id);
        if (!result) {
            alert("Failed to download file. Invalid response from server.");
            return;
        }

        const link = document.createElement("a");
        link.href = result.url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(result.url);
    } catch (error) {
        const err = error as Error;
        console.error("Error in downloadPhoto:", err);
        alert(`Error downloading photo: ${err.message}`);
    }
}

// ---- Bootstrap ----
function collectElements(): AppElements {
    const elements: AppElements = {
        dropArea: getEl("drop-area"),
        fileInput: getEl("fileupload"),
        uploadButton: getEl("upload-button"),
        photosTableBody: getEl("photos-table-body"),
        photosTableContainer: getEl("photos-table-container")
    };

    return elements;
}

export function setupApp(): void {
    window.appElements = collectElements();

    function preventDefaults(e: Event) {
        e.preventDefault();
        e.stopPropagation();
    }

    function setupDragAndDrop() {
        const dropArea = window.appElements.dropArea;

        ["dragenter", "dragover", "dragleave", "drop"].forEach(evt => {
            dropArea.addEventListener(evt, preventDefaults, false);
        });

        ["dragenter", "dragover"].forEach(evt => {
            dropArea.addEventListener(evt, () => {
                dropArea.classList.add("bg-gray-200", "border-gray-800");
            });
        });

        ["dragleave", "drop"].forEach(evt => {
            dropArea.addEventListener(evt, () => {
                dropArea.classList.remove("bg-gray-200", "border-gray-800");
            });
        });

        dropArea.addEventListener("drop", (e: DragEvent) => {
            const files = e.dataTransfer?.files;

            if (files && files.length > 1) {
                alert("Please drop only one file.");
                return;
            }

            if (files && files.length === 1) {
                const dt = new DataTransfer();
                dt.items.add(files[0]);
                window.appElements.fileInput.files = dt.files;
            }

            updateButtonState();
        });
    }

    function updateButtonState() {
        const input = window.appElements.fileInput;
        const hasOne = input.files && input.files.length === 1;

        window.appElements.uploadButton.disabled = !hasOne;

        if (hasOne) {
            window.appElements.dropArea.textContent = `Selected: ${input.files![0].name}`;
        } else {
            window.appElements.dropArea.textContent = "Drag and drop your image here or click to select";
        }
    }

    window.appElements.uploadButton.disabled = true;

    setupDragAndDrop();

    window.appElements.dropArea.addEventListener("click", () => {
        window.appElements.fileInput.click();
    });

    window.appElements.fileInput.addEventListener("change", () => {
        const files = window.appElements.fileInput.files;
        if (files && files.length > 1) {
            alert("Please select only one file.");
            window.appElements.fileInput.value = "";
        }
        updateButtonState();
    });

    window.app.fetchPhotos().then(renderPhotos);
}


window.downloadPhoto = downloadPhoto;
window.uploadFile = uploadFile;

document.addEventListener("DOMContentLoaded", setupApp);
