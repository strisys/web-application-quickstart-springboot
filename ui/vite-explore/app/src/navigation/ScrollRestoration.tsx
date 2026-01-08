import { useLayoutEffect, useRef } from "react";
import { useEffectiveLocation } from "./useEffectiveLocation";

type ScrollPositions = Record<string, number>;

export function ScrollRestoration() {
  const location = useEffectiveLocation();
  const pathname = location.underlay.pathname;
  const positionsRef = useRef<ScrollPositions>({});
  const prevPathRef = useRef<string>(pathname);

  useLayoutEffect(() => {
    const prevPath = prevPathRef.current;
    // Save scroll position for the route we are leaving
    positionsRef.current[prevPath] = window.scrollY;

    // Restore scroll for the route we are entering
    const currentPath = pathname;
    const savedY = positionsRef.current[currentPath] ?? 0;
    window.scrollTo(0, savedY);

    // Update previous path for the next navigation
    prevPathRef.current = currentPath;
  }, [pathname]);

  return null;
}
