import { useEffect } from "react";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;

    document.title = title;

    // Optional: restore previous title on unmount
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
