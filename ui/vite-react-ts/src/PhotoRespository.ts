const baseUrl = "http://localhost:8080";


const normalizeBase = (base: string) => base.replace(/\/+$/, "");
const join = (base: string, path: string) => `${normalizeBase(base)}/api/photos/${path}`;

const getUrl = (path: string = ''): string => {
   return join(baseUrl, path);
}

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

export class PhotoRepository {
   public async upload(file: File | null | undefined): Promise<string | undefined> {
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
         const response = await fetch(getUrl("upload"), {
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
   }

   public async fetch(): Promise<Photo[]> {
      try {
         const response = await fetch(getUrl(), { method: "GET" });

         if (!response.ok) {
            throw new Error(`Failed to fetch photos: ${response.status} ${response.statusText}`);
         }

         const json = await response.json();
         if (!Array.isArray(json)) {
            return [];
         }

         const photos: Photo[] = json.filter(
            (p): p is Photo =>
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
   }

   async downloadPhoto(id: string): Promise<DownloadResult | undefined> {
      try {
         const response = await fetch(getUrl(`download/${encodeURIComponent(id)}`), {
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
}