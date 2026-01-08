import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { RouteEvent, RouteTracker } from "./routeTracker";

let current = '';
let routeTracker: (RouteTracker | null) = null;

export function registerRouteTracker(tracker: RouteTracker) {
  routeTracker = tracker;
}

export function useLogLocation(prefix: string = "pageView"): ReturnType<typeof useLocation> {
   const location = useLocation();

   useEffect(() => {
      if (current === location.key) {
         return; 
      }

      current = location.key;

      const logInfo = {
         pathname: location.pathname,
         search: location.search,
         hash: location.hash,
         state: location.state,
         key: location.key
      } as RouteEvent   

      if (routeTracker) {
         routeTracker(prefix, logInfo);
      }

      console.log(`%c${prefix} changed`, "color: #888; font-weight: bold;", logInfo);
   }, [location.key, prefix]);

   return location; 
}
