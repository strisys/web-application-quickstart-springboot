import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export function usePathInfo() {
  const location = useLocation();

  const { pathParts, currentPath, basePath } = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    const current = parts.length > 1 ? parts[1] : "";
    const base = current.split("/")[0];

    return {
      pathParts: parts,
      currentPath: current,
      basePath: base,
    };
  }, [location.pathname]);

  return {
    pathname: location.pathname,
    pathParts,
    currentPath,
    basePath,
  };
}
