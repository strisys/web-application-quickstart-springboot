import { registerRouteTracker } from "./useLogLocation";

export type RouteEvent = {
   pathname: string;
   search: string;
   hash: string;
   state: any;
   key: string;
};

export type RouteTracker = (eventName: string, payload: RouteEvent) => void;

/**
 * Call this once at app startup to wire up your analytics implementation.
 */
export function register(tracker: RouteTracker) {
  registerRouteTracker(tracker);
}